import { prisma } from "@/lib/db";
import { getNextOrderNumber } from "@/lib/pos";
import { recordCashSale } from "@/lib/cashbook";
import { signAndStoreOrder, signAndStorePayment, getOrderTseData, isOrderTseQueued } from "@/lib/tse/db";
import { sendToFiscalPrinter } from "@/lib/tse/fiscalPrinter";
import { getTenantTaxInfo } from "@/lib/tse/org";
import { verifyPosPaymentIntent } from "@/lib/payments/stripe";
import { verifyCapturedPayPalOrder } from "@/lib/payments/paypal";
import { roundMoney } from "@/lib/payments/config";
import { encodeCashPaymentMeta } from "@/lib/receiptPayments";
import { NextResponse } from "next/server";
import { assertTenantFeatureAccess } from "@/lib/subscriptions";
import { getRequestActor, resolveDeviceStaffId } from "@/lib/device-auth";
import { verifyTabletWaiterSession } from "@/lib/tablet-waiter";
import { getKDSOrderById } from "@/lib/kds";
import { syncKdsItemsForOrder } from "@/lib/kds-routing";
import { broadcastTenantKdsEvent } from "@/lib/realtime";
import {
  isWalkInCustomer,
  computePointsEarned,
  computeRedemption,
  getTenantLoyaltySettings,
} from "@/lib/loyalty";
import { markDiningTableOccupied } from "@/lib/dining-table-availability";

function toNum(d) {
  return d ? Number(d) : 0;
}

const PAYMENT_METHODS = ["CASH", "STRIPE", "PAYPAL"];

function aggregatePaymentsByMethod(payments) {
  const grouped = new Map();

  for (const payment of payments) {
    const current = grouped.get(payment.method) || 0;
    grouped.set(payment.method, roundMoney(current + payment.amount));
  }

  return Array.from(grouped.entries()).map(([method, amount]) => ({ method, amount }));
}

/**
 * Resolve payment splits to amounts. Splits: [{ method, type: "amount"|"percentage"|"quantity", value }]
 */
function resolveSplits(splits, grandTotal) {
  const total = Number(grandTotal);
  if (!splits?.length) return [{ method: "CASH", amount: total }];

  let resolved = [];
  const pctOrQty = [];

  for (const s of splits) {
    const method = String(s.method || "CASH").toUpperCase();
    if (!PAYMENT_METHODS.includes(method)) continue;
    const type = String(s.type || "amount").toLowerCase();
    const value = toNum(s.value) || 0;

    if (type === "amount") {
      resolved.push({ method, amount: Math.min(value, total) });
    } else {
      pctOrQty.push({ method, type, value });
    }
  }

  const allocated = resolved.reduce((s, r) => s + r.amount, 0);
  let remaining = total - allocated;

  if (pctOrQty.length > 0 && remaining > 0.001) {
    const totalWeight = pctOrQty.reduce((s, p) => s + (p.type === "percentage" ? p.value : p.value || 1), 0);
    if (totalWeight > 0) {
      for (const p of pctOrQty) {
        const weight = p.type === "percentage" ? p.value : p.value || 1;
        const amt = (remaining * weight) / totalWeight;
        resolved.push({ method: p.method, amount: Math.round(amt * 100) / 100 });
      }
    }
  }

  if (remaining > 0.001 && resolved.length === 0) {
    resolved = [{ method: "CASH", amount: total }];
  } else if (remaining > 0.001) {
    resolved[0].amount = Math.round((resolved[0].amount + remaining) * 100) / 100;
  }

  return aggregatePaymentsByMethod(resolved.filter((r) => r.amount > 0));
}

export async function POST(request) {
  let offlineCheckoutIdForIdemp = "";
  let tenantIdForIdemp = null;

  try {
    const actor = await getRequestActor(request, { allowedDeviceTypes: ["POS", "TABLET"] });
    if (!actor?.tenantId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      items,
      orderType,
      tableId,
      customerId,
      orderNumber: clientOrderNumber,
      splits,
      discountAmount = 0,
      redeemLoyaltyPoints = 0,
      providerPayments = [],
      cashTenderedAmount = null,
      changeGiven = 0,
      offlineCheckoutId: offlineCheckoutIdBody,
    } = body;

    offlineCheckoutIdForIdemp =
      typeof offlineCheckoutIdBody === "string" ? offlineCheckoutIdBody.trim().slice(0, 64) : "";

    const tenantId = actor.tenantId ?? null;
    tenantIdForIdemp = tenantId;
    const branchId = actor.branchId ?? null;
    let staffId = actor.staffId ?? null;

    if (!tenantId || !branchId) {
      return NextResponse.json({ error: "Restaurant context required" }, { status: 400 });
    }

    if (actor.deviceType === "TABLET") {
      const waiterHeader = request.headers.get("x-tablet-waiter-session");
      const waiterSession = verifyTabletWaiterSession(waiterHeader);
      if (waiterSession && waiterSession.tenantId === tenantId) {
        staffId = waiterSession.staffId;
      } else {
        staffId = await resolveDeviceStaffId(tenantId, branchId);
      }
    }

    if (!staffId) {
      return NextResponse.json({ error: "No active staff member is linked to this POS device." }, { status: 400 });
    }

    const featureCode = actor.deviceType === "TABLET" ? "TABLET" : "POS";
    const posAccess = await assertTenantFeatureAccess(tenantId, featureCode);
    if (!posAccess.ok) {
      return NextResponse.json({ error: posAccess.error }, { status: posAccess.status });
    }

    if (!items?.length) {
      return NextResponse.json({ error: "Order must have items" }, { status: 400 });
    }

    if (offlineCheckoutIdForIdemp.length >= 8) {
      const existingOrder = await prisma.order.findFirst({
        where: { tenantId, offlineCheckoutId: offlineCheckoutIdForIdemp },
        include: { orderItems: true },
      });
      if (existingOrder) {
        return NextResponse.json({
          order: existingOrder,
          orderNumber: existingOrder.orderNumber,
          receipt: null,
          idempotentReplay: true,
        });
      }
    }

    // Server-authoritative pricing: load products + add-ons from DB (never trust client-sent prices).
    const productIds = [...new Set(items.map((i) => Number(i.productId)).filter(Boolean))];
    const products = await prisma.product.findMany({
      where: { tenantId, id: { in: productIds }, isActive: true },
      select: { id: true, name: true, basePrice: true, taxRate: true, kdsStation: true },
    });
    const productById = new Map(products.map((p) => [p.id, p]));
    const productStationsByProductId = new Map(products.map((p) => [p.id, p.kdsStation || "MAIN"]));
    if (productById.size !== productIds.length) {
      return NextResponse.json({ error: "One or more products are unavailable" }, { status: 400 });
    }

    const addonIds = [
      ...new Set(
        items
          .flatMap((i) => (Array.isArray(i.addonItemIds) ? i.addonItemIds : []))
          .map((x) => Number(x))
          .filter(Boolean)
      ),
    ];
    const addons = addonIds.length
      ? await prisma.addonItem.findMany({
          where: { id: { in: addonIds }, group: { tenantId } },
          select: { id: true, name: true, price: true },
        })
      : [];
    const addonById = new Map(addons.map((a) => [a.id, a]));
    if (addonById.size !== addonIds.length) {
      return NextResponse.json({ error: "One or more add-ons are unavailable" }, { status: 400 });
    }

    const branch = await prisma.branch.findFirst({
      where: { id: branchId, tenantId },
    });
    if (!branch) {
      return NextResponse.json({ error: "Branch not found" }, { status: 404 });
    }

    let table = await prisma.diningTable.findFirst({
      where: { tenantId, ...(tableId && { id: tableId }) },
    });
    if (!table) {
      table = await prisma.diningTable.findFirst({
        where: { tenantId, branchId },
      });
    }

    let customer = null;
    if (customerId) {
      customer = await prisma.customer.findFirst({
        where: { id: customerId, tenantId },
      });
    }
    if (!customer) {
      customer = await prisma.customer.findFirst({
        where: { tenantId },
      });
    }
    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          tenantId,
          name: "Walk-in",
          email: "walkin@internal.local",
          phone: "",
          loyaltyPoints: 0,
        },
      });
    }

    if (!table || !customer) {
      return NextResponse.json({ error: "Table and customer required. Run db seed." }, { status: 400 });
    }

    const now = new Date();
    const orderNumber = clientOrderNumber
      ? String(clientOrderNumber)
      : `ORD${await getNextOrderNumber(tenantId, branchId)}`;

    const session = await prisma.session.create({
      data: {
        tenantId,
        branchId,
        tableId: table.id,
        waiterId: staffId,
        openedAt: now,
      },
    });

    let subtotal = 0;
    const orderItemsData = items.map((item) => {
      const qty = Number(item.quantity) > 0 ? Number(item.quantity) : 1;
      const p = productById.get(Number(item.productId));
      const addonItemIds = Array.isArray(item.addonItemIds) ? item.addonItemIds : [];
      const addonList = addonItemIds.map((id) => addonById.get(Number(id)));
      const addonTotal = addonList.reduce((s, a) => s + Number(a?.price || 0), 0);
      const unitPrice = Number(p.basePrice) + addonTotal;
      const total = unitPrice * qty;
      subtotal += total;
      return {
        productId: p.id,
        productName: p.name,
        name: p.name,
        unitPrice,
        price: unitPrice,
        taxRate: Number(p.taxRate) || 0,
        quantity: qty,
        totalAmount: total,
        status: "CONFIRMED",
      };
    });

    const taxRate = 0.1;
    const taxAmount = subtotal * taxRate;
    const discount = toNum(discountAmount) || 0;
    const basePayable = Math.max(0, subtotal + taxAmount - discount);

    const loyaltyAccess = await assertTenantFeatureAccess(tenantId, "LOYALTY");
    const loyaltySettings = await getTenantLoyaltySettings(tenantId);
    const requestedCustomerId =
      customerId != null && customerId !== "" ? Number(customerId) : null;
    const loyaltyEligible =
      loyaltyAccess.ok &&
      customer &&
      !isWalkInCustomer(customer) &&
      Number.isInteger(requestedCustomerId) &&
      requestedCustomerId === customer.id;

    let loyaltyDiscount = 0;
    let pointsRedeemed = 0;
    if (loyaltyEligible) {
      const reqRedeem = Math.max(0, Math.floor(Number(redeemLoyaltyPoints) || 0));
      if (reqRedeem > 0) {
        const r = computeRedemption({
          balance: customer.loyaltyPoints,
          requestedPoints: reqRedeem,
          orderTotal: basePayable,
          redemptionRate: loyaltySettings.redemptionRate,
        });
        pointsRedeemed = r.points;
        loyaltyDiscount = r.discount;
      }
    }

    const grandTotal = Math.max(0, basePayable - loyaltyDiscount);

    let pointsEarned = 0;
    if (loyaltyEligible && grandTotal > 0) {
      pointsEarned = computePointsEarned(grandTotal, loyaltySettings.pointsPerEuro);
    }

    const paymentSplits = resolveSplits(splits, grandTotal);
    if (paymentSplits.length > 1) {
      const splitAccess = await assertTenantFeatureAccess(tenantId, "SPLIT_PAYMENTS");
      if (!splitAccess.ok) {
        return NextResponse.json({ error: splitAccess.error }, { status: splitAccess.status });
      }
    }

    if (paymentSplits.some((split) => split.method === "STRIPE" || split.method === "PAYPAL")) {
      const paymentAccess = await assertTenantFeatureAccess(tenantId, "ONLINE_PAYMENTS");
      if (!paymentAccess.ok) {
        return NextResponse.json({ error: paymentAccess.error }, { status: paymentAccess.status });
      }
    }

    const splitTotal = paymentSplits.reduce((s, p) => s + p.amount, 0);
    if (Math.abs(splitTotal - grandTotal) > 0.02) {
      return NextResponse.json(
        { error: `Payment split total €${splitTotal.toFixed(2)} must equal €${grandTotal.toFixed(2)}` },
        { status: 400 }
      );
    }

    const submittedProviderPayments = new Map(
      (Array.isArray(providerPayments) ? providerPayments : [])
        .map((payment) => [String(payment?.method || "").toUpperCase(), payment])
        .filter(([method]) => method === "STRIPE" || method === "PAYPAL")
    );
    const verifiedProviderRefs = new Map();
    const normalizedCashTendered = roundMoney(cashTenderedAmount);
    const normalizedChangeGiven = roundMoney(changeGiven);

    for (const split of paymentSplits) {
      if (split.method === "STRIPE") {
        const payment = submittedProviderPayments.get("STRIPE");
        const paymentIntentId = String(payment?.providerRef || "").trim();
        const channel = String(payment?.channel || "").trim() || "browser";
        const checkoutSessionId = String(payment?.checkoutSessionId || "").trim();

        if (!paymentIntentId || !checkoutSessionId) {
          return NextResponse.json(
            { error: "Stripe payment must be completed before checkout." },
            { status: 400 }
          );
        }

        const paymentIntent = await verifyPosPaymentIntent({
          paymentIntentId,
          expectedAmount: split.amount,
          tenantId,
          branchId,
          staffId,
          checkoutSessionId,
          channel,
        });

        verifiedProviderRefs.set("STRIPE", paymentIntent.id);
      }

      if (split.method === "PAYPAL") {
        const payment = submittedProviderPayments.get("PAYPAL");
        const captureId = String(payment?.providerRef || "").trim();
        const orderId = String(payment?.paypalOrderId || "").trim();
        const checkoutSessionId = String(payment?.checkoutSessionId || "").trim();

        if (!captureId || !orderId || !checkoutSessionId) {
          return NextResponse.json(
            { error: "PayPal payment must be completed before checkout." },
            { status: 400 }
          );
        }

        const { capture } = await verifyCapturedPayPalOrder({
          orderId,
          captureId,
          expectedAmount: split.amount,
          tenantId,
          branchId,
          staffId,
          checkoutSessionId,
        });

        verifiedProviderRefs.set("PAYPAL", capture.id);
      }
    }

    for (const method of submittedProviderPayments.keys()) {
      if (!paymentSplits.some((split) => split.method === method)) {
        return NextResponse.json(
          { error: `${method} confirmation does not match the current payment splits.` },
          { status: 400 }
        );
      }
    }

    const resolvedCheckoutOrderType = orderType === "TAKEAWAY" ? "TAKEAWAY" : "DINE_IN";

    const order = await prisma.order.create({
      data: {
        tenantId,
        branchId,
        sessionId: session.id,
        tableId: table.id,
        customerId: customer.id,
        orderNumber,
        offlineCheckoutId: offlineCheckoutIdForIdemp.length >= 8 ? offlineCheckoutIdForIdemp : null,
        orderType: resolvedCheckoutOrderType,
        status: "CONFIRMED",
        subtotal,
        taxAmount,
        discountAmount: discount,
        loyaltyDiscountAmount: loyaltyDiscount,
        tipAmount: 0,
        totalAmount: grandTotal,
        grandTotal,
        loyaltyPointsEarned: pointsEarned,
        loyaltyPointsRedeemed: pointsRedeemed,
        orderItems: {
          create: orderItemsData,
        },
      },
      include: { orderItems: true },
    });

    if (resolvedCheckoutOrderType === "DINE_IN") {
      await markDiningTableOccupied(tenantId, table.id);
    }

    await syncKdsItemsForOrder({
      orderId: order.id,
      branchId,
      orderStatus: order.status,
      orderItems: order.orderItems,
      productStationsByProductId,
    });

    for (const split of paymentSplits) {
      const providerRef =
        verifiedProviderRefs.get(split.method) ||
        (split.method === "CASH"
          ? encodeCashPaymentMeta({
              cashReceived: normalizedCashTendered || split.amount,
              changeGiven: normalizedChangeGiven,
            })
          : null);

      await prisma.payment.create({
        data: {
          orderId: order.id,
          method: split.method,
          status: "COMPLETED",
          amount: split.amount,
          transactionId: providerRef,
          providerRef,
          metadata:
            split.method === "CASH"
              ? {
                  cashTenderedAmount: normalizedCashTendered || split.amount,
                  changeGiven: normalizedChangeGiven,
                }
              : null,
        },
      });

      if (split.method === "CASH") {
        await recordCashSale(tenantId, split.amount, order.id);
      }

      await signAndStorePayment(tenantId, order.id, orderNumber, split.amount, split.method);
    }

    if (loyaltyEligible && (pointsRedeemed > 0 || pointsEarned > 0)) {
      const net = pointsEarned - pointsRedeemed;
      const up = await prisma.customer.updateMany({
        where: {
          id: customer.id,
          tenantId,
          ...(pointsRedeemed > 0 ? { loyaltyPoints: { gte: pointsRedeemed } } : {}),
        },
        data: { loyaltyPoints: { increment: net } },
      });
      if (up.count !== 1) {
        return NextResponse.json(
          { error: "Loyalty balance changed — adjust redemption or retry checkout." },
          { status: 409 }
        );
      }
    }

    console.log("[POS checkout] Signing order with TSE...", order.id, orderNumber);
    const tseResult = await signAndStoreOrder(tenantId, order.id, orderNumber, grandTotal);
    console.log("[POS checkout] TSE result:", tseResult ? "OK" : "FAILED (queued for retry)");

    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
      // `logoUrl` is not yet on Tenant in the current DB schema
      select: { name: true },
    });

    // Load organization-level tax identifiers from Fiskaly (per-tenant).
    const orgTaxInfo = await getTenantTaxInfo(tenantId);

    const tseData = tseResult
      ? {
          signature: tseResult.signature,
          fiskalyTxId: tseResult.transactionId,
          signedAt: tseResult.signedAt,
          tss_id: tseResult.tss_id ?? null,
          tx_id: tseResult.tx_id ?? String(tseResult.transactionId),
          signature_counter: tseResult.signature_counter ?? null,
          log_time_start: tseResult.log_time_start ?? null,
          log_time_end: tseResult.log_time_end ?? null,
          qrCodeData: tseResult.qrCodeData ?? null,
        }
      : (await getOrderTseData(order.id));
    const tseQueued = !tseResult && (await isOrderTseQueued(order.id));

    const host = request.headers.get("host") || "localhost:3000";
    const proto = request.headers.get("x-forwarded-proto") || "http";
    const baseUrl = `${proto}://${host}`;
    const receiptUrl = `${baseUrl}/receipt/${order.id}`;

    const receipt = {
      orderNumber,
      orderId: order.id,
      tenantName: tenant?.name || "Restaurant",
      tenantLogo: null,
      branchName: branch.name,
      branchAddress: `${branch.address || ""}, ${branch.city || ""}, ${branch.country || ""}`.replace(/^,\s*|,\s*$/g, "").trim(),
      date: now.toISOString(),
      receiptUrl,
      items: orderItemsData.map((i) => ({
        name: i.productName,
        qty: i.quantity,
        unitPrice: i.unitPrice,
        total: i.totalAmount,
        taxRate: i.taxRate ?? 10,
      })),
      subtotal,
      taxAmount,
      discountAmount: discount,
      loyaltyDiscountAmount: loyaltyDiscount,
      loyaltyPointsEarned: pointsEarned,
      loyaltyPointsRedeemed: pointsRedeemed,
      grandTotal,
      payments: paymentSplits,
      cashReceived: normalizedCashTendered || null,
      changeGiven: normalizedChangeGiven || 0,
      orgVat: orgTaxInfo?.vatId ?? null,
      orgTaxNumber: orgTaxInfo?.taxNumber ?? null,
      orgWidnr: orgTaxInfo?.widnr ?? null,
      tseSignature: tseData?.signature ?? null,
      tseTransactionId: tseData?.fiskalyTxId ?? null,
      tseSignedAt: tseData?.signedAt ? new Date(tseData.signedAt).toISOString() : null,
      tseQueued: tseQueued || false,
      // Fiskaly API receipt fields (KassenSichV)
      tss_id: tseData?.tss_id ?? null,
      tx_id: tseData?.tx_id ?? tseData?.fiskalyTxId ?? null,
      signature_counter: tseData?.signature_counter ?? null,
      log_time_start: tseData?.log_time_start ?? null,
      log_time_end: tseData?.log_time_end ?? null,
      signature: tseData?.signature ?? null,
      tseQrData: tseData?.qrCodeData ?? null,
    };

    if (process.env.FISCAL_PRINTER_ENABLED === "1") {
      sendToFiscalPrinter(receipt).catch((e) => console.warn("[Fiscal printer]", e));
    }

    const kdsOrder = await getKDSOrderById(tenantId, order.id);
    if (kdsOrder) {
      broadcastTenantKdsEvent(tenantId, "order.created", { order: kdsOrder });
    }

    return NextResponse.json({
      order,
      orderNumber,
      receipt,
      loyalty: loyaltyEligible
        ? { pointsEarned, pointsRedeemed, discountEuros: loyaltyDiscount }
        : null,
    });
  } catch (err) {
    if (
      err?.code === "P2002" &&
      offlineCheckoutIdForIdemp.length >= 8 &&
      tenantIdForIdemp
    ) {
      const existingOrder = await prisma.order.findFirst({
        where: { tenantId: tenantIdForIdemp, offlineCheckoutId: offlineCheckoutIdForIdemp },
        include: { orderItems: true },
      });
      if (existingOrder) {
        return NextResponse.json({
          order: existingOrder,
          orderNumber: existingOrder.orderNumber,
          receipt: null,
          idempotentReplay: true,
        });
      }
    }
    console.error("[POS checkout error]", err);
    return NextResponse.json({ error: err.message || "Checkout failed" }, { status: 500 });
  }
}

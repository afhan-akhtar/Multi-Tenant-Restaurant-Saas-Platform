import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/db";
import { getNextOrderNumber } from "@/lib/pos";
import { recordCashSale } from "@/lib/cashbook";
import { signAndStoreOrder, getOrderSignature } from "@/lib/tse/db";
import { NextResponse } from "next/server";

function toNum(d) {
  return d ? Number(d) : 0;
}

const PAYMENT_METHODS = ["CASH", "STRIPE", "PAYPAL", "CARD"];

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

  return resolved.filter((r) => r.amount > 0);
}

export async function POST(request) {
  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });
    if (!token) {
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
    } = body;

    const tenantId = token.tenantId ?? null;
    const branchId = token.branchId ?? null;
    const staffId = parseInt(token.id, 10);

    if (!tenantId || !branchId) {
      return NextResponse.json({ error: "Restaurant context required" }, { status: 400 });
    }

    if (!items?.length) {
      return NextResponse.json({ error: "Order must have items" }, { status: 400 });
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
      const price = toNum(item.unitPrice) + (item.addonTotal || 0);
      const qty = item.quantity || 1;
      const total = price * qty;
      subtotal += total;
      return {
        productId: item.productId,
        productName: item.productName,
        unitPrice: price,
        taxRate: toNum(item.taxRate),
        quantity: qty,
        totalAmount: total,
        status: "CONFIRMED",
      };
    });

    const taxRate = 0.1;
    const taxAmount = subtotal * taxRate;
    const discount = toNum(discountAmount) || 0;
    const grandTotal = Math.max(0, subtotal + taxAmount - discount);

    const paymentSplits = resolveSplits(splits, grandTotal);
    const splitTotal = paymentSplits.reduce((s, p) => s + p.amount, 0);
    if (Math.abs(splitTotal - grandTotal) > 0.02) {
      return NextResponse.json(
        { error: `Payment split total €${splitTotal.toFixed(2)} must equal €${grandTotal.toFixed(2)}` },
        { status: 400 }
      );
    }

    const order = await prisma.order.create({
      data: {
        tenantId,
        branchId,
        sessionId: session.id,
        tableId: table.id,
        customerId: customer.id,
        orderNumber,
        orderType: orderType === "TAKEAWAY" ? "TAKEAWAY" : "DINE_IN",
        status: "CONFIRMED",
        subtotal,
        taxAmount,
        discountAmount: discount,
        tipAmount: 0,
        grandTotal,
        orderItems: {
          create: orderItemsData,
        },
      },
      include: { orderItems: true },
    });

    for (const split of paymentSplits) {
      await prisma.payment.create({
        data: {
          orderId: order.id,
          method: split.method,
          status: "COMPLETED",
          amount: split.amount,
          providerRef:
            split.method === "STRIPE"
              ? `stripe_${Date.now()}`
              : split.method === "PAYPAL"
              ? `paypal_${Date.now()}`
              : split.method === "CARD"
              ? `card_device_${Date.now()}`
              : null,
        },
      });

      if (split.method === "CASH") {
        await recordCashSale(tenantId, split.amount, order.id);
      }
    }

    const tseResult = await signAndStoreOrder(tenantId, order.id, orderNumber, grandTotal);

    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
      select: { name: true },
    });

    const tseSignature = tseResult?.signature ?? (await getOrderSignature(order.id));

    const host = request.headers.get("host") || "localhost:3000";
    const proto = request.headers.get("x-forwarded-proto") || "http";
    const baseUrl = `${proto}://${host}`;
    const receiptUrl = `${baseUrl}/receipt/${order.id}`;

    const receipt = {
      orderNumber,
      orderId: order.id,
      tenantName: tenant?.name || "Restaurant",
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
      grandTotal,
      payments: paymentSplits,
      tseSignature,
    };

    return NextResponse.json({
      order,
      orderNumber,
      receipt,
    });
  } catch (err) {
    console.error("[POS checkout error]", err);
    return NextResponse.json({ error: err.message || "Checkout failed" }, { status: 500 });
  }
}

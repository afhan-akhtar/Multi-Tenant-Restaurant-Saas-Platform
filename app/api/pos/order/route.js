import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

function toNum(d) {
  return d ? Number(d) : 0;
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

    const { items, orderType, tableId, customerId } = await request.json();
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

    let customer = await prisma.customer.findFirst({
      where: { id: customerId, tenantId },
    });
    if (!customer) {
      customer = await prisma.customer.findFirst({
        where: { tenantId },
      });
    }

    if (!table || !customer) {
      return NextResponse.json({ error: "Table and customer required. Run db seed." }, { status: 400 });
    }

    const now = new Date();
    const orderNumber = `ORD${Date.now().toString().slice(-6)}`;

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
        status: "OPEN",
      };
    });

    const taxRate = 0.1;
    const taxAmount = subtotal * taxRate;
    const grandTotal = subtotal + taxAmount;

    const order = await prisma.order.create({
      data: {
        tenantId,
        branchId,
        sessionId: session.id,
        tableId: table.id,
        customerId: customer.id,
        orderNumber,
        orderType: orderType === "TAKEAWAY" ? "TAKEAWAY" : "DINE_IN",
        status: "OPEN",
        subtotal,
        taxAmount,
        discountAmount: 0,
        tipAmount: 0,
        grandTotal,
        orderItems: {
          create: orderItemsData,
        },
      },
      include: { orderItems: true },
    });

    return NextResponse.json({ order, orderNumber });
  } catch (err) {
    console.error("[POS order error]", err);
    return NextResponse.json({ error: err.message || "Failed to create order" }, { status: 500 });
  }
}

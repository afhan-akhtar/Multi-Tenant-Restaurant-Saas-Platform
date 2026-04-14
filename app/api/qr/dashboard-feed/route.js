import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getTenantPrisma } from "@/lib/tenant-db";

export const dynamic = "force-dynamic";

const ACTIVE = ["OPEN", "CONFIRMED", "PREPARING", "READY", "PACK"];

export async function GET() {
  try {
    const session = await auth();
    const tenantId = session?.user?.tenantId ?? null;
    const branchId = session?.user?.branchId ?? null;

    if (!tenantId || session?.user?.type !== "staff") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const prisma = await getTenantPrisma(tenantId);
    const orders = await prisma.order.findMany({
      where: {
        tenantId,
        orderSource: "QR",
        ...(branchId ? { branchId } : {}),
        status: { in: ACTIVE },
      },
      include: {
        table: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 30,
    });

    return NextResponse.json({
      orders: orders.map((o) => ({
        id: o.id,
        orderNumber: o.orderNumber,
        status: o.status,
        grandTotal: Number(o.grandTotal),
        guestNotes: o.guestNotes,
        createdAt: o.createdAt?.toISOString?.() ?? null,
        table: o.table,
      })),
    });
  } catch (err) {
    console.error("[qr dashboard-feed]", err);
    return NextResponse.json({ error: "Failed to load" }, { status: 500 });
  }
}

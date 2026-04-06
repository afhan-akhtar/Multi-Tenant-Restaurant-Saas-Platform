import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import LoyaltyClient from "@/app/components/LoyaltyClient";
import { normalizeLoyaltySettings } from "@/lib/loyalty";

export const dynamic = "force-dynamic";

export default async function LoyaltyPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const tenantId = session.user?.tenantId ?? null;
  if (!tenantId) {
    return (
      <div className="py-4 w-full min-w-0">
        <p className="text-color-text-muted">Restaurant context required.</p>
      </div>
    );
  }

  const [customers, orderStats, tenantRow] = await Promise.all([
    prisma.customer.findMany({
      where: { tenantId },
      orderBy: { loyaltyPoints: "desc" },
    }),
    prisma.order.groupBy({
      by: ["customerId"],
      where: { tenantId, status: { in: ["COMPLETED", "CONFIRMED"] } },
      _sum: { grandTotal: true },
      _count: true,
    }),
    prisma.tenant.findUnique({
      where: { id: tenantId },
      select: { loyaltySettings: true },
    }),
  ]);

  const customerStats = {};
  orderStats.forEach((o) => {
    customerStats[o.customerId] = {
      totalSpent: Number(o._sum.grandTotal || 0),
      orderCount: o._count,
    };
  });

  const customersWithStats = customers.map((c) => ({
    ...c,
    totalSpent: customerStats[c.id]?.totalSpent ?? 0,
    orderCount: customerStats[c.id]?.orderCount ?? 0,
  }));

  const totalPoints = customers.reduce((s, c) => s + (c.loyaltyPoints || 0), 0);

  return (
    <LoyaltyClient
      customers={customersWithStats}
      totalPoints={totalPoints}
      initialSettings={normalizeLoyaltySettings(tenantRow?.loyaltySettings)}
    />
  );
}

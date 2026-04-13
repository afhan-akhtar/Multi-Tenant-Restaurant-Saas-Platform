import { platformPrisma } from "./platform-db";
import { getTenantPrisma } from "./tenant-db";

/** Completed-order revenue and counts per tenant (for Super Admin commission view). */
export async function getRevenueByTenantFromOrders() {
  const tenants = await platformPrisma.tenant.findMany({
    where: { databaseUrl: { not: null } },
    select: { id: true },
  });
  const revenueByTenant = {};
  for (const t of tenants) {
    try {
      const tp = await getTenantPrisma(t.id);
      const agg = await tp.order.aggregate({
        where: { status: "COMPLETED" },
        _sum: { grandTotal: true },
        _count: true,
      });
      revenueByTenant[t.id] = {
        revenue: Number(agg._sum.grandTotal || 0),
        orderCount: agg._count || 0,
      };
    } catch {
      revenueByTenant[t.id] = { revenue: 0, orderCount: 0 };
    }
  }
  return revenueByTenant;
}

/** Recent audit log rows across all tenant databases (newest first). */
export async function getMergedAuditLogs(take = 200) {
  const tenants = await platformPrisma.tenant.findMany({
    where: { databaseUrl: { not: null } },
    select: { id: true, name: true, subdomain: true },
  });
  const all = [];
  for (const meta of tenants) {
    try {
      const tp = await getTenantPrisma(meta.id);
      const logs = await tp.auditLog.findMany({
        include: { tenantAdmin: true, tenant: true },
        orderBy: { createdAt: "desc" },
        take: Math.min(take, 500),
      });
      all.push(...logs.map((l) => ({ ...l, _tenantKey: `${meta.id}-${l.id}` })));
    } catch {
      /* skip broken tenant DB */
    }
  }
  all.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  return all.slice(0, take);
}

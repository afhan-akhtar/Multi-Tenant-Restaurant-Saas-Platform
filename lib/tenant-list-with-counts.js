import { platformPrisma } from "./platform-db";
import { getTenantPrisma } from "./tenant-db";

/**
 * Super Admin tenant table: platform registry + order/staff counts from each tenant DB.
 */
export async function getTenantsWithOperationalCounts() {
  const tenants = await platformPrisma.tenant.findMany({
    orderBy: [{ status: "asc" }, { name: "asc" }],
  });
  const out = [];
  for (const t of tenants) {
    let orderCount = 0;
    let tenantAdminCount = 0;
    let branchCount = 0;
    let lastActivityAt = null;
    if (t.databaseUrl) {
      try {
        const tp = await getTenantPrisma(t.id);
        const [oc, ac, bc, lastOrder, lastAudit] = await Promise.all([
          tp.order.count(),
          tp.tenantAdmin.count(),
          tp.branch.count(),
          tp.order.findFirst({
            orderBy: { createdAt: "desc" },
            select: { createdAt: true },
          }),
          tp.auditLog.findFirst({
            orderBy: { createdAt: "desc" },
            select: { createdAt: true },
          }),
        ]);
        orderCount = oc;
        tenantAdminCount = ac;
        branchCount = bc;
        const tOrder = lastOrder?.createdAt ? new Date(lastOrder.createdAt).getTime() : 0;
        const tAudit = lastAudit?.createdAt ? new Date(lastAudit.createdAt).getTime() : 0;
        const best = Math.max(tOrder, tAudit);
        lastActivityAt = best > 0 ? new Date(best) : null;
      } catch {
        orderCount = 0;
        tenantAdminCount = 0;
        branchCount = 0;
        lastActivityAt = null;
      }
    }
    out.push({
      ...t,
      _count: { orders: orderCount, tenantAdmins: tenantAdminCount, branches: branchCount },
      lastActivityAt,
    });
  }
  return out;
}

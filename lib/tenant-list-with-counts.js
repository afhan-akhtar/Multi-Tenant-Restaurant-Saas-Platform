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
    if (t.databaseUrl) {
      try {
        const tp = await getTenantPrisma(t.id);
        const [oc, ac] = await Promise.all([
          tp.order.count(),
          tp.tenantAdmin.count(),
        ]);
        orderCount = oc;
        tenantAdminCount = ac;
      } catch {
        orderCount = 0;
        tenantAdminCount = 0;
      }
    }
    out.push({
      ...t,
      _count: { orders: orderCount, tenantAdmins: tenantAdminCount },
    });
  }
  return out;
}

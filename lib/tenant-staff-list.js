import { platformPrisma } from "./platform-db";
import { getTenantPrisma } from "./tenant-db";

/**
 * Aggregate all active tenant admins across tenant databases (Super Admin tooling).
 */
export async function listAllTenantAdmins() {
  const tenants = await platformPrisma.tenant.findMany({
    where: {
      databaseUrl: { not: null },
      status: "ACTIVE",
    },
    orderBy: { name: "asc" },
  });
  const all = [];
  for (const t of tenants) {
    try {
      const tp = await getTenantPrisma(t.id);
      const rows = await tp.tenantAdmin.findMany({
        where: { status: "ACTIVE" },
        include: { tenant: true, role: true },
      });
      all.push(...rows);
    } catch (err) {
      console.error("[listAllTenantAdmins] tenant", t.id, err);
    }
  }
  all.sort((a, b) => {
    const ta = a.tenant?.name || "";
    const tb = b.tenant?.name || "";
    if (ta !== tb) return ta.localeCompare(tb);
    return (a.name || "").localeCompare(b.name || "");
  });
  return all;
}

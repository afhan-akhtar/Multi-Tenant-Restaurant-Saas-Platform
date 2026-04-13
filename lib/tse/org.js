import { getTenantPrisma } from "@/lib/tenant-db";

/**
 * Fetch organization-level tax identifiers (VAT, Tax Number, W-IdNr.)
 * from our database (cached per-tenant in TenantFiskalyConfig).
 * These values should be copied from the Fiskaly Dashboard for each tenant.
 */
export async function getTenantTaxInfo(tenantId) {
  try {
    if (tenantId == null) return null;

    const prisma = await getTenantPrisma(Number(tenantId));
    const cfg = await prisma.tenantFiskalyConfig.findUnique({
      where: { tenantId: Number(tenantId) },
      select: {
        vatId: true,
        taxNumber: true,
        wIdNr: true,
      },
    });

    if (!cfg) return null;

    return {
      vatId: cfg.vatId || null,
      taxNumber: cfg.taxNumber || null,
      widnr: cfg.wIdNr || null,
    };
  } catch (err) {
    console.warn("[Fiskaly org] Error while resolving tenant tax info:", err?.message || err);
    return null;
  }
}


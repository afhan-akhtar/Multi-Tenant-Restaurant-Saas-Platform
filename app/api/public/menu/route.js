import { NextResponse } from "next/server";
import { platformPrisma } from "@/lib/platform-db";
import { getTenantPrisma } from "@/lib/tenant-db";

function toNum(v) {
  if (v == null) return 0;
  if (typeof v === "number") return v;
  return Number(v);
}

export const dynamic = "force-dynamic";

/**
 * Public read-only menu for QR ordering. Validates tenant + table ownership.
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get("tenant_id") ? Number(searchParams.get("tenant_id")) : null;
    const tableId = searchParams.get("table_id") ? Number(searchParams.get("table_id")) : null;

    if (!tenantId || !tableId) {
      return NextResponse.json({ error: "tenant_id and table_id are required" }, { status: 400 });
    }

    const platformTenant = await platformPrisma.tenant.findUnique({
      where: { id: tenantId },
      select: { id: true, status: true, name: true, logoUrl: true },
    });
    if (!platformTenant || platformTenant.status !== "ACTIVE") {
      return NextResponse.json({ error: "Restaurant not found" }, { status: 404 });
    }

    const prisma = await getTenantPrisma(tenantId);
    const table = await prisma.diningTable.findFirst({
      where: { tenantId, id: tableId },
      include: { branch: { select: { id: true, name: true } } },
    });
    if (!table) {
      return NextResponse.json({ error: "Table not found" }, { status: 404 });
    }

    const [categories, products, addonGroups] = await Promise.all([
      prisma.category.findMany({
        where: { tenantId },
        orderBy: { name: "asc" },
      }),
      prisma.product.findMany({
        where: { tenantId, isActive: true },
        include: { category: true, variants: true },
        orderBy: { name: "asc" },
      }),
      prisma.addonGroup.findMany({
        where: { tenantId },
        include: { addonItems: true },
        orderBy: { name: "asc" },
      }),
    ]);

    return NextResponse.json({
      tenant: {
        id: platformTenant.id,
        name: platformTenant.name,
        logoUrl: platformTenant.logoUrl,
      },
      table: {
        id: table.id,
        name: table.name,
        branchId: table.branchId,
        branchName: table.branch?.name ?? "",
      },
      categories,
      products: products.map((p) => ({
        ...p,
        basePrice: toNum(p.basePrice),
        taxRate: toNum(p.taxRate),
        variants: (p.variants || []).map((v) => ({ ...v, price: toNum(v.price) })),
      })),
      addonGroups: addonGroups.map((g) => ({
        ...g,
        addonItems: (g.addonItems || []).map((a) => ({ ...a, price: toNum(a.price) })),
      })),
    });
  } catch (err) {
    console.error("[public menu]", err);
    return NextResponse.json({ error: "Failed to load menu" }, { status: 500 });
  }
}

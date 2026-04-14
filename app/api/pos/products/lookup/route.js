import { NextResponse } from "next/server";
import { getRequestActor } from "@/lib/device-auth";
import { getTenantPrisma } from "@/lib/tenant-db";

export const dynamic = "force-dynamic";

/**
 * Barcode / PLU lookup for POS scanners (keyboard wedge).
 * Query: ?code=  (trimmed; matches product id or plu)
 */
export async function GET(request) {
  try {
    const actor = await getRequestActor(request, { allowedDeviceTypes: ["POS", "TABLET"] });
    if (!actor?.tenantId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const raw = String(searchParams.get("code") ?? "").trim();
    if (!raw) {
      return NextResponse.json({ error: "code query parameter is required" }, { status: 400 });
    }

    const prisma = await getTenantPrisma(actor.tenantId);
    const idGuess = Number.parseInt(raw, 10);

    const byId =
      Number.isInteger(idGuess) && idGuess > 0
        ? await prisma.product.findFirst({
            where: { tenantId: actor.tenantId, id: idGuess, isActive: true },
            include: { category: true, variants: true },
          })
        : null;

    const byPlu = byId
      ? null
      : await prisma.product.findFirst({
          where: { tenantId: actor.tenantId, plu: raw, isActive: true },
          include: { category: true, variants: true },
        });

    const product = byId || byPlu;
    if (!product) {
      return NextResponse.json({ product: null, found: false });
    }

    return NextResponse.json({
      found: true,
      product: {
        id: product.id,
        name: product.name,
        plu: product.plu,
        basePrice: Number(product.basePrice),
        taxRate: Number(product.taxRate),
        categoryId: product.categoryId,
        category: product.category,
        variants: (product.variants || []).map((v) => ({
          id: v.id,
          name: v.name,
          price: Number(v.price),
        })),
      },
    });
  } catch (e) {
    console.error("[pos/products/lookup]", e);
    return NextResponse.json({ error: e?.message || "Lookup failed" }, { status: 500 });
  }
}

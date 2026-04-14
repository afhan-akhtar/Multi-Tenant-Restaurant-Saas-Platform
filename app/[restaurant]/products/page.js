import { auth } from "@/lib/auth";
import { getTenantPrisma } from "@/lib/tenant-db";
import { redirect } from "next/navigation";
import ProductsManagement from "@/app/components/ProductsManagement";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
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

  const prisma = await getTenantPrisma(tenantId);
  const where = { tenantId };

  const [productsRaw, categories] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { category: true },
      orderBy: [{ category: { name: "asc" } }, { name: "asc" }],
    }),
    prisma.category.findMany({
      where: { tenantId },
      orderBy: { name: "asc" },
    }),
  ]);

  const products = productsRaw.map((p) => ({
    ...p,
    basePrice: Number(p.basePrice ?? 0),
    taxRate: Number(p.taxRate ?? 0),
  }));

  return <ProductsManagement products={products} categories={categories} />;
}

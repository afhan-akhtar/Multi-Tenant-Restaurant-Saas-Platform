import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import ProductsManagement from "@/app/components/ProductsManagement";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const tenantId = session.user?.tenantId ?? null;
  const where = tenantId ? { tenantId } : {};

  const [productsRaw, categories] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { category: true },
      orderBy: [{ category: { name: "asc" } }, { name: "asc" }],
    }),
    prisma.category.findMany({
      where: tenantId ? { tenantId } : {},
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

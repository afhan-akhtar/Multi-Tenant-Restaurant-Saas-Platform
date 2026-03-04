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

  const [products, categories] = await Promise.all([
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

  return <ProductsManagement products={products} categories={categories} />;
}

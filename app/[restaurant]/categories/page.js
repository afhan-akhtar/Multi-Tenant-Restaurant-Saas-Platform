import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import CategoriesManagement from "@/app/components/CategoriesManagement";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const tenantId = session.user?.tenantId ?? null;
  if (!tenantId) return <div className="py-4 w-full min-w-0"><p>Restaurant context required.</p></div>;

  const categories = await prisma.category.findMany({
    where: { tenantId },
    include: { _count: { select: { products: true } }, parent: true },
    orderBy: { name: "asc" },
  });

  const parentCategories = categories.filter((c) => !c.parentId);

  return <CategoriesManagement categories={categories} parentCategories={parentCategories} />;
}

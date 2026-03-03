import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function ProductsPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const tenantId = session.user?.tenantId ?? null;
  const where = tenantId ? { tenantId } : {};

  const products = await prisma.product.findMany({
    where,
    include: { category: true },
    orderBy: [{ category: { name: "asc" } }, { name: "asc" }],
  });

  return (
    <div className="py-4 w-full min-w-0 md:py-3 sm:py-2">
      <div className="flex justify-between items-center flex-wrap gap-4 mb-6 md:flex-col md:items-start md:mb-4">
        <h2 className="m-0 text-xl font-semibold text-color-text md:text-lg sm:text-base">Products</h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 xl:gap-4 lg:gap-3.5 md:gap-3 sm:gap-3">
        {products.map((p) => (
          <div key={p.id} className="bg-color-card rounded-lg border border-color-border overflow-hidden transition-all hover:shadow-md">
            <div className="aspect-square bg-slate-100 relative overflow-hidden">
              {p.imageUrl ? (
                <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover object-center" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl">🍽</div>
              )}
            </div>
            <div className="p-4 md:p-3 sm:p-2.5">
              <div className="font-semibold text-base text-color-text mb-1 md:text-[0.95rem] sm:text-sm">{p.name}</div>
              <div className="text-sm text-color-text-muted mb-2 sm:text-xs">{p.category?.name}</div>
              <div className="flex justify-between items-center flex-wrap gap-2">
                <span className="font-bold text-primary">€{Number(p.basePrice).toLocaleString()}</span>
                <span
                  className="inline-block py-0.5 px-2 rounded-md text-xs font-medium"
                  style={{
                    background: p.isActive ? "#dcfce7" : "#fee2e2",
                    color: p.isActive ? "#166534" : "#991b1b",
                  }}
                >
                  {p.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      {products.length === 0 && (
        <div className="py-8 px-6 text-center text-color-text-muted text-[0.95rem] bg-color-card rounded-lg border border-color-border">
          No products found
        </div>
      )}
    </div>
  );
}

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function TablesPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const tenantId = session.user?.tenantId ?? null;
  if (!tenantId) return <div className="py-4 w-full min-w-0"><p>Restaurant context required.</p></div>;

  const tables = await prisma.diningTable.findMany({
    where: { tenantId },
    include: { branch: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="py-4 w-full min-w-0">
      <h2 className="m-0 text-xl font-semibold text-color-text mb-6">Floor & Tables</h2>
      <div className="bg-color-card rounded-lg border border-color-border overflow-hidden shadow-sm">
        <div className="w-full overflow-x-auto overflow-y-hidden">
          <table className="w-full border-collapse text-sm min-w-[600px] [&_th[data-align=right]]:text-right [&_td[data-align=right]]:text-right">
            <thead>
              <tr className="bg-color-bg border-b border-color-border">
                <th className="py-3 px-4 text-left font-semibold text-color-text whitespace-nowrap">Table</th>
                <th className="py-3 px-4 text-left font-semibold text-color-text whitespace-nowrap">Branch</th>
                <th className="py-3 px-4 text-left font-semibold text-color-text whitespace-nowrap" data-align="right">Seats</th>
                <th className="py-3 px-4 text-left font-semibold text-color-text whitespace-nowrap">Status</th>
              </tr>
            </thead>
            <tbody>
              {tables.map((t) => (
                <tr key={t.id} className="border-b border-slate-100 last:border-0">
                  <td className="py-3 px-4">{t.name}</td>
                  <td className="py-3 px-4">{t.branch?.name}</td>
                  <td className="py-3 px-4" data-align="right">{t.seats}</td>
                  <td className="py-3 px-4">
                    <span
                      className="inline-block py-0.5 px-2 rounded-md text-xs font-medium"
                      style={{
                        background: t.status === "AVAILABLE" ? "#dcfce7" : t.status === "OCCUPIED" ? "#fef3c7" : "#e0e7ff",
                        color: t.status === "AVAILABLE" ? "#166534" : t.status === "OCCUPIED" ? "#92400e" : "#3730a3",
                      }}
                    >
                      {t.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {tables.length === 0 && (
          <div className="py-8 px-6 text-center text-color-text-muted text-[0.95rem]">No tables defined</div>
        )}
      </div>
    </div>
  );
}

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function CashbookPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const tenantId = session.user?.tenantId ?? null;
  const where = tenantId ? { tenantId } : {};

  const entries = await prisma.cashbookEntry.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  const amountColor = (type) => {
    const t = (type || "").toLowerCase();
    return t.includes("sent") || t.includes("expense") ? "#dc2626" : "#166534";
  };

  return (
    <div className="py-4 w-full min-w-0">
      <h2 className="m-0 text-xl font-semibold text-color-text mb-4">Cashbook</h2>
      <p className="text-color-text-muted mb-4 text-sm">
        Immutable recording of all cash sales, deposits, and withdrawals (DS-FinV-K compliant).
      </p>
      <div className="bg-color-card rounded-lg border border-color-border overflow-hidden shadow-sm">
        <div className="w-full overflow-x-auto overflow-y-hidden">
          <table className="w-full border-collapse text-sm min-w-[600px] [&_th[data-align=right]]:text-right [&_td[data-align=right]]:text-right">
            <thead>
              <tr className="bg-color-bg border-b border-color-border">
                <th className="py-3 px-4 text-left font-semibold text-color-text whitespace-nowrap">Date</th>
                <th className="py-3 px-4 text-left font-semibold text-color-text whitespace-nowrap">Type</th>
                <th className="py-3 px-4 text-left font-semibold text-color-text whitespace-nowrap" data-align="right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((e) => (
                <tr key={e.id} className="border-b border-slate-100 last:border-0">
                  <td className="py-3 px-4 text-color-text-muted">
                    {new Date(e.createdAt).toLocaleString()}
                  </td>
                  <td className="py-3 px-4">{e.type}</td>
                  <td
                    className="py-3 px-4 font-semibold"
                    data-align="right"
                    style={{ color: amountColor(e.type) }}
                  >
                    {(e.type || "").toLowerCase().includes("sent") || (e.type || "").toLowerCase().includes("expense") ? "-" : "+"}
                    €{Number(e.amount).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {entries.length === 0 && (
          <div className="py-8 px-6 text-center text-color-text-muted text-[0.95rem]">No cashbook entries</div>
        )}
      </div>
    </div>
  );
}

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import pageStyles from "@/app/styles/Page.module.css";
import tableStyles from "@/app/styles/Table.module.css";

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
    <div className={pageStyles.page}>
      <h2 className={pageStyles.pageTitle}>Cashbook</h2>
      <p className={pageStyles.pageDescriptionBlock}>
        Immutable recording of all cash sales, deposits, and withdrawals (DS-FinV-K compliant).
      </p>
      <div className={pageStyles.card}>
        <div className={tableStyles.tableWrapper}>
          <table className={tableStyles.table}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th data-align="right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((e) => (
                <tr key={e.id}>
                  <td style={{ color: "var(--color-text-muted)" }}>
                    {new Date(e.createdAt).toLocaleString()}
                  </td>
                  <td>{e.type}</td>
                  <td
                    data-align="right"
                    style={{
                      fontWeight: 600,
                      color: amountColor(e.type),
                    }}
                  >
                    {(e.type || "").toLowerCase().includes("sent") || (e.type || "").toLowerCase().includes("expense") ? "-" : "+"}
                    €{Number(e.amount).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {entries.length === 0 && <div className={pageStyles.emptyState}>No cashbook entries</div>}
      </div>
    </div>
  );
}

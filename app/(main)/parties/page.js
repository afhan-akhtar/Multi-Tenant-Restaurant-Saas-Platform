import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import pageStyles from "@/app/styles/Page.module.css";
import tableStyles from "@/app/styles/Table.module.css";

export default async function PartiesPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const tenantId = session.user?.tenantId ?? null;
  const where = tenantId ? { tenantId } : {};

  const customers = await prisma.customer.findMany({
    where,
    orderBy: { name: "asc" },
  });

  return (
    <div className={pageStyles.page}>
      <div className={pageStyles.pageHeader}>
        <h2 className={pageStyles.pageTitle}>Parties (Customers)</h2>
      </div>
      <div className={pageStyles.card}>
        <div className={tableStyles.tableWrapper}>
          <table className={tableStyles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th data-align="right">Loyalty</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.id}>
                  <td>{c.name}</td>
                  <td>{c.email}</td>
                  <td>{c.phone}</td>
                  <td data-align="right">{c.loyaltyPoints}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {customers.length === 0 && <div className={pageStyles.emptyState}>No parties found</div>}
      </div>
    </div>
  );
}

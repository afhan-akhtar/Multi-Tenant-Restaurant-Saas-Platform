import { auth } from "@/lib/auth";
import { getSalesReport } from "@/lib/reports";
import { redirect } from "next/navigation";
import ReportsClient from "@/app/components/ReportsClient";

export const dynamic = "force-dynamic";

export default async function ReportsPage({ searchParams }) {
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

  const today = new Date();
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const start = searchParams?.from || monthStart.toISOString().slice(0, 10);
  const end = searchParams?.to || today.toISOString().slice(0, 10);

  const report = await getSalesReport(tenantId, start, end);

  return <ReportsClient report={report} defaultFrom={start} defaultTo={end} />;
}

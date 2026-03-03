import { auth } from "@/lib/auth";
import { getZReportData } from "@/lib/reports";
import { redirect } from "next/navigation";
import ZReportsClient from "@/app/components/ZReportsClient";

export const dynamic = "force-dynamic";

export default async function ZReportsPage({ searchParams }) {
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

  const today = new Date().toISOString().slice(0, 10);
  const date = searchParams?.date || today;
  const data = await getZReportData(tenantId, date);

  return <ZReportsClient data={data} defaultDate={date} />;
}

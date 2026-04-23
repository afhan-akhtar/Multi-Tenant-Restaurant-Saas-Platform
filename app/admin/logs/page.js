import { auth } from "@/lib/auth";
import { getMergedAuditLogs } from "@/lib/cross-tenant-aggregates";
import { redirect } from "next/navigation";
import GlobalLogsClient from "@/app/components/GlobalLogsClient";

export const dynamic = "force-dynamic";

export default async function AdminLogsPage() {
  const session = await auth();
  if (!session || session.user?.type !== "super_admin") redirect("/admin");

  const logs = await getMergedAuditLogs(200);

  return <GlobalLogsClient logs={logs} />;
}

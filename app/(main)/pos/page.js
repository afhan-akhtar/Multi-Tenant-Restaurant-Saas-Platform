import { auth } from "@/lib/auth";
import { getPOSData } from "@/lib/pos";
import { redirect } from "next/navigation";
import POS from "@/app/components/POS";

export default async function POSPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const tenantId = session.user?.tenantId ?? null;
  const branchId = session.user?.branchId ?? null;

  if (!tenantId) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <p>Restaurant context required. Log in as Restaurant Admin.</p>
      </div>
    );
  }

  const data = await getPOSData(tenantId, branchId);

  return <POS data={data} />;
}

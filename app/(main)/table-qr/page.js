import { auth } from "@/lib/auth";
import { getTenantPrisma } from "@/lib/tenant-db";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import TableQRCodes from "@/app/components/TableQRCodes";

export const dynamic = "force-dynamic";

export default async function TableQrPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const tenantId = session.user?.tenantId ?? null;
  if (!tenantId) {
    return (
      <div className="py-4 w-full min-w-0">
        <p>Restaurant context required.</p>
      </div>
    );
  }

  const prisma = await getTenantPrisma(tenantId);
  const tables = await prisma.diningTable.findMany({
    where: { tenantId },
    include: { branch: true },
    orderBy: { name: "asc" },
  });

  const h = headers();
  const host = h.get("x-forwarded-host") || h.get("host") || "localhost:3000";
  const proto = h.get("x-forwarded-proto") || "http";
  const baseUrl = `${proto}://${host}`;

  return (
    <div className="py-4 w-full min-w-0 max-w-6xl mx-auto px-2 sm:px-0">
      <h1 className="text-xl font-semibold text-color-text m-0 mb-2">Table QR codes</h1>
      <TableQRCodes tenantId={tenantId} tables={tables} baseUrl={baseUrl} />
    </div>
  );
}

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <div className="py-4 w-full min-w-0">
      <h2 className="m-0 text-xl font-semibold text-color-text mb-6">Profile</h2>
      <div className="p-4 bg-color-bg rounded-md mt-4">
        <p className="my-2 first:mt-0"><strong>Name:</strong> {session.user?.name}</p>
        <p className="my-2 first:mt-0"><strong>Email:</strong> {session.user?.email}</p>
        <p className="my-2 first:mt-0"><strong>Type:</strong> {session.user?.type}</p>
        {session.user?.tenantName && <p className="my-2 first:mt-0"><strong>Tenant:</strong> {session.user.tenantName}</p>}
      </div>
    </div>
  );
}

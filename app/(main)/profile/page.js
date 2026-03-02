import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Profile</h2>
      <div style={{ marginTop: "1rem", padding: "1rem", background: "#f8f9fa", borderRadius: 8 }}>
        <p><strong>Name:</strong> {session.user?.name}</p>
        <p><strong>Email:</strong> {session.user?.email}</p>
        <p><strong>Type:</strong> {session.user?.type}</p>
        {session.user?.tenantName && <p><strong>Tenant:</strong> {session.user.tenantName}</p>}
      </div>
    </div>
  );
}

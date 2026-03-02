import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function HomePage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <main style={{ padding: "2rem", fontFamily: "system-ui, sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1>Welcome, {session.user?.name}</h1>
        <Link
          href="/api/auth/signout?callbackUrl=/login"
          style={{ padding: "0.5rem 1rem", background: "#e94560", color: "white", textDecoration: "none", borderRadius: "6px" }}
        >
          Sign out
        </Link>
      </div>
      <div style={{ padding: "1rem", background: "#f5f5f5", borderRadius: "8px" }}>
        <p><strong>Email:</strong> {session.user?.email}</p>
        <p><strong>Type:</strong> {session.user?.type}</p>
        {session.user?.tenantName && (
          <p><strong>Tenant:</strong> {session.user.tenantName}</p>
        )}
      </div>
    </main>
  );
}

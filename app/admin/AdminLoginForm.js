"use client";

import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Spinner from "@/app/components/Spinner";
import { AuthShell, auth, authDisplayFont } from "@/app/components/auth/AuthShell";

function AdminLoginFormInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: email.trim(),
        password,
        subdomain: "",
      });

      if (res?.error) {
        setError("Invalid email or password.");
        setLoading(false);
        return;
      }
      if (res?.ok) {
        router.push(callbackUrl);
        router.refresh();
        return;
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell>
      <div className={`${auth.cardNarrow} mx-auto w-full`}>
        <h1 className={`${authDisplayFont} ${auth.title}`}>Super Admin</h1>
        <p className={auth.subtitle}>Sign in with your platform credentials</p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="admin-email" className={auth.label}>
              Email
            </label>
            <input
              id="admin-email"
              type="email"
              placeholder="you@example.com"
              className={auth.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="admin-password" className={auth.label}>
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              className={auth.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              autoComplete="current-password"
            />
          </div>
          {error ? <p className={`${auth.error} mt-2 mb-0`}>{error}</p> : null}
          <button type="submit" className={`${auth.btnPrimary} mt-4`} disabled={loading}>
            {loading ? (
              <span className="flex items-center gap-2">
                <Spinner size="sm" className="text-white" />
                <span>Signing in…</span>
              </span>
            ) : (
              "Sign in"
            )}
          </button>
        </form>
        <p className={`mt-6 text-center ${auth.muted}`}>
          Restaurant?{" "}
          <a href="/login" className={auth.link}>
            Sign in as Restaurant Admin
          </a>
        </p>
      </div>
    </AuthShell>
  );
}

function AdminLoginFallback() {
  return (
    <div className="flex min-h-screen min-h-[100dvh] items-center justify-center bg-[#f6f4f0]">
      <Spinner size="xl" className="text-teal-600" />
    </div>
  );
}

export default function AdminLoginForm() {
  return (
    <Suspense fallback={<AdminLoginFallback />}>
      <AdminLoginFormInner />
    </Suspense>
  );
}

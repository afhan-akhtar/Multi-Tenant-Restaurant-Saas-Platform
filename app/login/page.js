"use client";

import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const [mode, setMode] = useState("super_admin"); // "super_admin" | "staff"
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [subdomain, setSubdomain] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: email.trim(),
        password,
        subdomain: mode === "staff" ? subdomain.trim() : "",
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
    <main className="min-h-screen min-h-[100dvh] flex items-center justify-center p-4 sm:p-6 bg-gradient-to-br from-[#1a1a2e] to-[#16213e] box-border">
      <div className="w-full max-w-[400px] bg-white/5 rounded-xl p-6 sm:p-8 border border-white/10">
        <h1 className="m-0 mb-6 text-2xl text-white">Sign in</h1>
        <div className="flex gap-2 mb-6">
          <button
            type="button"
            className={`flex-1 py-2 px-4 border rounded-lg cursor-pointer text-sm transition-colors ${
              mode === "super_admin"
                ? "bg-white/15 text-white border-white/30"
                : "border-white/20 bg-transparent text-white/70"
            }`}
            onClick={() => setMode("super_admin")}
          >
            Super Admin
          </button>
          <button
            type="button"
            className={`flex-1 py-2 px-4 border rounded-lg cursor-pointer text-sm transition-colors ${
              mode === "staff"
                ? "bg-white/15 text-white border-white/30"
                : "border-white/20 bg-transparent text-white/70"
            }`}
            onClick={() => setMode("staff")}
          >
            Restaurant Staff
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          {mode === "staff" && (
            <div className="mb-4">
              <label htmlFor="subdomain" className="block mb-1 text-sm text-white/80">
                Subdomain
              </label>
              <input
                id="subdomain"
                type="text"
                placeholder="your-restaurant"
                className="w-full py-3 px-4 border border-white/20 rounded-lg bg-black/20 text-white text-base box-border placeholder:text-white/40"
                value={subdomain}
                onChange={(e) => setSubdomain(e.target.value)}
                required={mode === "staff"}
                autoComplete="organization"
              />
            </div>
          )}
          <div className="mb-4">
            <label htmlFor="email" className="block mb-1 text-sm text-white/80">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="w-full py-3 px-4 border border-white/20 rounded-lg bg-black/20 text-white text-base box-border placeholder:text-white/40"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block mb-1 text-sm text-white/80">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="w-full py-3 px-4 border border-white/20 rounded-lg bg-black/20 text-white text-base box-border placeholder:text-white/40"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              autoComplete="current-password"
            />
          </div>
          {error && <p className="text-primary text-sm mt-2 mb-0">{error}</p>}
          <button
            type="submit"
            className="w-full py-3 mt-2 bg-primary text-white border-none rounded-lg text-base font-semibold cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#1a1a2e] to-[#16213e] text-white">Loading…</div>}>
      <LoginForm />
    </Suspense>
  );
}

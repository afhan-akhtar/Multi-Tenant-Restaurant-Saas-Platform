"use client";

import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import Link from "next/link";
import Spinner, { PageLoader } from "@/app/components/Spinner";

function LoginFormInner() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const restaurant = params?.restaurant || "";
  const callbackUrl = searchParams.get("callbackUrl") || `/${restaurant}`;

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
        subdomain: restaurant,
      });

      if (res?.error) {
        setError("Invalid email or password.");
        setLoading(false);
        return;
      }
      if (res?.ok) {
        router.push(callbackUrl);
        router.refresh();
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
        <h1 className="m-0 mb-2 text-2xl text-white">Restaurant Admin</h1>
        <p className="m-0 mb-6 text-sm text-white/60">Sign in to {restaurant || "your restaurant"}</p>
        <form onSubmit={handleSubmit}>
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
          <p className="mt-4 text-center text-sm text-white/60">
            <a href="/admin" className="text-primary hover:underline">Super Admin</a>
          </p>
          <p className="mt-2 text-center text-sm text-white/60">
            New restaurant?{" "}
            <Link href="/register" className="text-primary hover:underline">
              Sign Up
            </Link>
          </p>
          <button
            type="submit"
            className="w-full py-3 mt-2 bg-primary text-white border-none rounded-lg text-base font-semibold cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
            disabled={loading}
          >
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
      </div>
    </main>
  );
}

export default function RestaurantLoginForm() {
  return (
    <Suspense fallback={<PageLoader />}>
      <LoginFormInner />
    </Suspense>
  );
}

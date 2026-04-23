"use client";

import { Suspense, useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useSearchParams, useParams } from "next/navigation";
import Spinner from "@/app/components/Spinner";
import { AuthShell, auth, authDisplayFont } from "@/app/components/auth/AuthShell";
import { PasswordField } from "@/app/components/auth/PasswordField";

function LoginFormInner() {
  const params = useParams();
  const searchParams = useSearchParams();
  const restaurant = params?.restaurant || "";
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const impersonateToken = searchParams.get("impersonateToken") || "";
  const passwordJustReset = searchParams.get("reset") === "1";

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!impersonateToken) return;

    let cancelled = false;

    async function completeImpersonation() {
      setError("");
      setLoading(true);

      try {
        const res = await signIn("impersonate", {
          redirect: false,
          token: impersonateToken,
        });

        if (cancelled) return;

        if (res?.error) {
          setError("Could not complete sign-in. Please try again.");
          return;
        }

        // Full reload so the browser sends the fresh session cookie to the server
        window.location.href = callbackUrl;
      } catch {
        if (!cancelled) {
          setError("Could not complete sign-in. Please try again.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    completeImpersonation();
    return () => { cancelled = true; };
  }, [callbackUrl, impersonateToken]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: email.trim().toLowerCase(),
        password,
        subdomain: restaurant,
      });

      if (res?.error) {
        setError("Invalid email or password.");
        setLoading(false);
        return;
      }

      if (res?.ok) {
        // Full reload so the browser sends the fresh session cookie to the server
        window.location.href = callbackUrl;
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (impersonateToken && !error) {
    return (
      <AuthShell>
        <div className="flex flex-col items-center justify-center gap-4 py-12">
          <Spinner size="xl" className="text-teal-600" />
          <p className="m-0 text-sm font-medium text-slate-600">Signing in…</p>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell>
      <div className={`${auth.cardNarrow} mx-auto w-full`}>
        <h1 className={`${authDisplayFont} ${auth.title}`}>Sign In</h1>
        <p className={auth.subtitle}>Enter your email and password to continue</p>
        {passwordJustReset ? (
          <p className="mb-4 rounded-xl border border-teal-200 bg-teal-50 px-3 py-2 text-sm text-teal-900">
            Your password was updated. You can sign in with your new password.
          </p>
        ) : null}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="tenant-email" className={auth.label}>
              Email
            </label>
            <input
              id="tenant-email"
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
            <label htmlFor="tenant-password" className={auth.label}>
              Password
            </label>
            <PasswordField
              id="tenant-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              autoComplete="current-password"
              showPassword={showPassword}
              onToggleShow={() => setShowPassword((v) => !v)}
            />
          </div>
          <p className="mb-0 mt-1 text-right">
            <Link className={`text-sm ${auth.link}`} href="/forgot-password">
              Forgot password?
            </Link>
          </p>
          {error ? <p className={`${auth.error} mt-2 mb-0`}>{error}</p> : null}
          <button
            type="submit"
            className={`${auth.btnPrimary} mt-4`}
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
    </AuthShell>
  );
}

function TenantLoginFallback() {
  return (
    <div className="flex min-h-screen min-h-[100dvh] items-center justify-center bg-[#f6f4f0]">
      <Spinner size="xl" className="text-teal-600" />
    </div>
  );
}

export default function RestaurantLoginForm() {
  return (
    <Suspense fallback={<TenantLoginFallback />}>
      <LoginFormInner />
    </Suspense>
  );
}

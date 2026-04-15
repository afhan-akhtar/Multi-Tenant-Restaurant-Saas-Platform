"use client";

import { Suspense, useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import Spinner from "@/app/components/Spinner";
import { AuthShell, auth, authDisplayFont } from "@/app/components/auth/AuthShell";
import { buildRootUrl } from "@/lib/tenant-url";

function LoginFormInner() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const restaurant = params?.restaurant || "";
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const impersonateToken = searchParams.get("impersonateToken") || "";

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
          setError("Could not complete impersonation login.");
          return;
        }

        router.push(callbackUrl);
        router.refresh();
      } catch (err) {
        if (!cancelled) {
          setError("Could not complete impersonation login.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    completeImpersonation();

    return () => {
      cancelled = true;
    };
  }, [callbackUrl, impersonateToken, router]);

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

  function handleSuperAdminClick() {
    window.location.assign(
      buildRootUrl({
        host: window.location.host,
        protocol: window.location.protocol.replace(":", ""),
        pathname: "/admin",
      })
    );
  }

  function handleSignUpClick() {
    window.location.assign(
      buildRootUrl({
        host: window.location.host,
        protocol: window.location.protocol.replace(":", ""),
        pathname: "/register",
      })
    );
  }

  return (
    <AuthShell>
      <div className={`${auth.cardNarrow} mx-auto w-full`}>
        <h1 className={`${authDisplayFont} ${auth.title}`}>Restaurant Admin</h1>
        <p className={auth.subtitle}>Sign in to {restaurant || "your restaurant"}</p>
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
            <input
              id="tenant-password"
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
          <button
            type="submit"
            className={`${auth.btnPrimary} mt-4`}
            disabled={loading || Boolean(impersonateToken)}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Spinner size="sm" className="text-white" />
                <span>{impersonateToken ? "Switching account…" : "Signing in…"}</span>
              </span>
            ) : (
              "Sign in"
            )}
          </button>
          <p className={`mt-4 text-center ${auth.muted}`}>
            <button
              type="button"
              onClick={handleSuperAdminClick}
              className={`${auth.link} cursor-pointer border-0 bg-transparent p-0 font-inherit`}
            >
              Super Admin
            </button>
          </p>
          <p className={`mt-2 text-center ${auth.muted}`}>
            New restaurant?{" "}
            <button
              type="button"
              onClick={handleSignUpClick}
              className={`${auth.link} cursor-pointer border-0 bg-transparent p-0 font-inherit`}
            >
              Sign Up
            </button>
          </p>
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

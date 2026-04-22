"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { signIn, getSession } from "next-auth/react";
import { COUNTRIES } from "@/lib/countries";
import Spinner from "@/app/components/Spinner";
import { AuthShell, auth, authDisplayFont } from "@/app/components/auth/AuthShell";

function LoginFormInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const callbackUrl = searchParams.get("callbackUrl") || "";
  const showSignUpByDefault = searchParams.get("signup") === "1";

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signUpOpen, setSignUpOpen] = useState(false);

  const [signUpLoading, setSignUpLoading] = useState(false);
  const [signUpError, setSignUpError] = useState("");
  const [signUpSuccess, setSignUpSuccess] = useState(false);
  const [restaurantName, setRestaurantName] = useState("");
  const [branchName, setBranchName] = useState("");
  const [country, setCountry] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");

  useEffect(() => {
    if (showSignUpByDefault) {
      setSignUpOpen(true);
    }
  }, [showSignUpByDefault]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: email.trim().toLowerCase(),
        password,
        subdomain: "",
      });

      if (res?.error) {
        setError("Invalid email or password.");
        return;
      }

      if (res?.ok) {
        const session = await getSession();
        if (session?.user?.type === "super_admin") {
          // Honor callbackUrl for super admin (e.g. /admin/restaurants), fall back to /admin
          router.push(callbackUrl || "/admin");
        } else {
          // For restaurant admins, /go resolves the subdomain URL server-side
          router.push("/go");
        }
        router.refresh();
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSignUp(e) {
    e.preventDefault();
    setSignUpError("");
    setSignUpLoading(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurantName: restaurantName.trim(),
          branchName: branchName.trim(),
          country: country.trim(),
          ownerName: ownerName.trim(),
          email: signUpEmail.trim(),
          password: signUpPassword,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setSignUpError(data.error || "Registration failed. Please try again.");
        return;
      }
      setSignUpSuccess(true);
    } catch {
      setSignUpError("Something went wrong. Please try again.");
    } finally {
      setSignUpLoading(false);
    }
  }

  function closeSignUpModal() {
    setSignUpOpen(false);
    setSignUpSuccess(false);
    setSignUpError("");
    setRestaurantName("");
    setBranchName("");
    setCountry("");
    setOwnerName("");
    setSignUpEmail("");
    setSignUpPassword("");
  }

  return (
    <AuthShell>
      <div className={`${auth.cardNarrow} mx-auto w-full`}>
        <h1 className={`${authDisplayFont} ${auth.title}`}>Sign In</h1>
        <p className={auth.subtitle}>Enter your email and password to continue</p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className={auth.label}>
              Email
            </label>
            <input
              id="email"
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
            <label htmlFor="password" className={auth.label}>
              Password
            </label>
            <input
              id="password"
              type="password"
              className={auth.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              autoComplete="current-password"
            />
          </div>
          {error && <p className={`${auth.error} mt-2 mb-0`}>{error}</p>}
          <p className={`mt-4 text-center ${auth.muted}`}>
            New restaurant?{" "}
            <button
              type="button"
              onClick={() => setSignUpOpen(true)}
              className={`${auth.link} cursor-pointer border-0 bg-transparent p-0 font-inherit`}
            >
              Sign Up
            </button>
          </p>
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
      </div>

      {signUpOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/25 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-[420px] overflow-y-auto rounded-2xl border border-stone-200 bg-white p-6 shadow-2xl shadow-stone-400/30">
            {signUpSuccess ? (
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-teal-100">
                  <svg
                    className="h-7 w-7 text-teal-600"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <path d="M22 4L12 14.01l-3-3" />
                  </svg>
                </div>
                <h2 className={`${authDisplayFont} m-0 mb-2 text-xl text-slate-900`}>Registration Successful</h2>
                <p className="m-0 mb-6 text-sm text-slate-600">
                  Your restaurant is pending approval. You will be able to log in once the platform
                  administrator approves your account.
                </p>
                <button
                  type="button"
                  onClick={closeSignUpModal}
                  className="cursor-pointer rounded-full border-0 bg-gradient-to-r from-teal-600 to-teal-700 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-teal-600/25 transition hover:from-teal-700 hover:to-teal-800"
                >
                  Close
                </button>
              </div>
            ) : (
              <>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className={`${authDisplayFont} m-0 text-xl text-slate-900`}>Sign Up</h2>
                  <button
                    type="button"
                    onClick={closeSignUpModal}
                    className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border-0 bg-stone-100 text-slate-500 transition hover:bg-stone-200 hover:text-slate-800"
                    aria-label="Close"
                  >
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <p className="m-0 mb-5 text-sm text-slate-600">Create an account to start using the platform</p>
                <form onSubmit={handleSignUp}>
                  <div className="mb-4">
                    <label htmlFor="modal-restaurantName" className={auth.label}>
                      Restaurant name
                    </label>
                    <input
                      id="modal-restaurantName"
                      type="text"
                      placeholder="My Restaurant"
                      required
                      className={auth.input}
                      value={restaurantName}
                      onChange={(e) => setRestaurantName(e.target.value)}
                      autoComplete="organization"
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="modal-branchName" className={auth.label}>
                      Branch name
                    </label>
                    <input
                      id="modal-branchName"
                      type="text"
                      placeholder="Main Branch"
                      required
                      className={auth.input}
                      value={branchName}
                      onChange={(e) => setBranchName(e.target.value)}
                      autoComplete="organization-unit"
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="modal-country" className={auth.label}>
                      Country
                    </label>
                    <select
                      id="modal-country"
                      className={auth.select}
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      autoComplete="country-name"
                    >
                      <option value="">Select country</option>
                      {COUNTRIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-4">
                    <label htmlFor="modal-ownerName" className={auth.label}>
                      Owner name
                    </label>
                    <input
                      id="modal-ownerName"
                      type="text"
                      placeholder="John Doe"
                      required
                      className={auth.input}
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      autoComplete="name"
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="modal-email" className={auth.label}>
                      Email
                    </label>
                    <input
                      id="modal-email"
                      type="email"
                      placeholder="owner@restaurant.com"
                      required
                      className={auth.input}
                      value={signUpEmail}
                      onChange={(e) => setSignUpEmail(e.target.value)}
                      autoComplete="email"
                    />
                  </div>
                  <div className="mb-5">
                    <label htmlFor="modal-password" className={auth.label}>
                      Password
                    </label>
                    <input
                      id="modal-password"
                      type="password"
                      placeholder="Min 6 characters"
                      required
                      minLength={6}
                      className={auth.input}
                      value={signUpPassword}
                      onChange={(e) => setSignUpPassword(e.target.value)}
                      autoComplete="new-password"
                    />
                  </div>
                  {signUpError && <p className={`${auth.error} mb-4`}>{signUpError}</p>}
                  <button type="submit" disabled={signUpLoading} className={auth.btnPrimary}>
                    {signUpLoading ? (
                      <span className="flex items-center gap-2">
                        <Spinner size="sm" className="text-white" />
                        <span>Signing up…</span>
                      </span>
                    ) : (
                      "Sign Up"
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </AuthShell>
  );
}

function LoginSuspenseFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f6f4f0]">
      <Spinner size="xl" className="text-teal-600" />
    </div>
  );
}

export default function LoginForm() {
  return (
    <Suspense fallback={<LoginSuspenseFallback />}>
      <LoginFormInner />
    </Suspense>
  );
}

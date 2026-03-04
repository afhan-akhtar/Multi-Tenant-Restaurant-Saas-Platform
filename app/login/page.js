"use client";

import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { COUNTRIES } from "@/lib/countries";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/go";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signUpOpen, setSignUpOpen] = useState(false);

  // Sign Up form state
  const [signUpLoading, setSignUpLoading] = useState(false);
  const [signUpError, setSignUpError] = useState("");
  const [signUpSuccess, setSignUpSuccess] = useState(false);
  const [restaurantName, setRestaurantName] = useState("");
  const [branchName, setBranchName] = useState("");
  const [country, setCountry] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");

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
      }
    } catch (err) {
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
    } catch (err) {
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
    <main className="min-h-screen min-h-[100dvh] flex items-center justify-center p-4 sm:p-6 bg-gradient-to-br from-[#1a1a2e] to-[#16213e] box-border">
      <div className="w-full max-w-[400px] bg-white/5 rounded-xl p-6 sm:p-8 border border-white/10">
        <h1 className="m-0 mb-2 text-2xl text-white">Restaurant Admin</h1>
        <p className="m-0 mb-6 text-sm text-white/60">Sign in to your restaurant</p>
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
            Super Admin?{" "}
            <a href="/admin" className="text-primary hover:underline">
              Sign in as Super Admin
            </a>
          </p>
          <p className="mt-2 text-center text-sm text-white/60">
            New restaurant?{" "}
            <button
              type="button"
              onClick={() => setSignUpOpen(true)}
              className="bg-transparent border-0 p-0 text-primary cursor-pointer hover:underline font-inherit text-inherit"
            >
              Sign Up
            </button>
          </p>
          <button
            type="submit"
            className="w-full py-3 mt-2 bg-primary text-white border-none rounded-lg text-base font-semibold cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
            disabled={loading}
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>

      {signUpOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60">
          <div className="w-full max-w-[420px] max-h-[90vh] overflow-y-auto bg-[#1a1a2e] rounded-xl p-6 border border-white/10 shadow-xl">
            {signUpSuccess ? (
              <div className="text-center">
                <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <svg className="w-7 h-7 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <path d="M22 4L12 14.01l-3-3" />
                  </svg>
                </div>
                <h2 className="m-0 mb-2 text-xl text-white">Registration Successful</h2>
                <p className="m-0 mb-6 text-sm text-white/70">
                  Your restaurant is pending approval. You will be able to log in once the platform administrator approves your account.
                </p>
                <button
                  type="button"
                  onClick={closeSignUpModal}
                  className="py-2.5 px-5 bg-primary text-white rounded-lg text-sm font-medium border-0 cursor-pointer hover:opacity-90 transition-opacity"
                >
                  Close
                </button>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="m-0 text-xl text-white">Sign Up</h2>
                  <button
                    type="button"
                    onClick={closeSignUpModal}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-white/60 hover:text-white hover:bg-white/10 border-0 cursor-pointer bg-transparent"
                    aria-label="Close"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <p className="m-0 mb-5 text-sm text-white/60">Create an account to start using the platform</p>
                <form onSubmit={handleSignUp}>
                  <div className="mb-4">
                    <label htmlFor="modal-restaurantName" className="block mb-1 text-sm text-white/80">Restaurant name</label>
                    <input
                      id="modal-restaurantName"
                      type="text"
                      placeholder="My Restaurant"
                      required
                      className="w-full py-2.5 px-4 border border-white/20 rounded-lg bg-black/20 text-white text-base box-border placeholder:text-white/40"
                      value={restaurantName}
                      onChange={(e) => setRestaurantName(e.target.value)}
                      autoComplete="organization"
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="modal-branchName" className="block mb-1 text-sm text-white/80">Branch name</label>
                    <input
                      id="modal-branchName"
                      type="text"
                      placeholder="Main Branch"
                      required
                      className="w-full py-2.5 px-4 border border-white/20 rounded-lg bg-black/20 text-white text-base box-border placeholder:text-white/40"
                      value={branchName}
                      onChange={(e) => setBranchName(e.target.value)}
                      autoComplete="organization-unit"
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="modal-country" className="block mb-1 text-sm text-white/80">Country</label>
                    <select
                      id="modal-country"
                      className="w-full py-2.5 px-4 border border-white/20 rounded-lg bg-black/20 text-white text-base box-border"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      autoComplete="country-name"
                    >
                      <option value="">Select country</option>
                      {COUNTRIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-4">
                    <label htmlFor="modal-ownerName" className="block mb-1 text-sm text-white/80">Owner name</label>
                    <input
                      id="modal-ownerName"
                      type="text"
                      placeholder="John Doe"
                      required
                      className="w-full py-2.5 px-4 border border-white/20 rounded-lg bg-black/20 text-white text-base box-border placeholder:text-white/40"
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      autoComplete="name"
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="modal-email" className="block mb-1 text-sm text-white/80">Email</label>
                    <input
                      id="modal-email"
                      type="email"
                      placeholder="owner@restaurant.com"
                      required
                      className="w-full py-2.5 px-4 border border-white/20 rounded-lg bg-black/20 text-white text-base box-border placeholder:text-white/40"
                      value={signUpEmail}
                      onChange={(e) => setSignUpEmail(e.target.value)}
                      autoComplete="email"
                    />
                  </div>
                  <div className="mb-5">
                    <label htmlFor="modal-password" className="block mb-1 text-sm text-white/80">Password</label>
                    <input
                      id="modal-password"
                      type="password"
                      placeholder="Min 6 characters"
                      required
                      minLength={6}
                      className="w-full py-2.5 px-4 border border-white/20 rounded-lg bg-black/20 text-white text-base box-border placeholder:text-white/40"
                      value={signUpPassword}
                      onChange={(e) => setSignUpPassword(e.target.value)}
                      autoComplete="new-password"
                    />
                  </div>
                  {signUpError && <p className="mb-4 text-sm text-red-400">{signUpError}</p>}
                  <button
                    type="submit"
                    disabled={signUpLoading}
                    className="w-full py-3 bg-primary text-white border-none rounded-lg text-base font-semibold cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {signUpLoading ? "Signing up…" : "Sign Up"}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
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

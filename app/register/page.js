"use client";

import { useState } from "react";
import Link from "next/link";
import { COUNTRIES } from "@/lib/countries";
import { AuthShell, auth, authDisplayFont } from "@/app/components/auth/AuthShell";

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [restaurantName, setRestaurantName] = useState("");
  const [branchName, setBranchName] = useState("");
  const [country, setCountry] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurantName: restaurantName.trim(),
          branchName: branchName.trim(),
          country: country.trim(),
          ownerName: ownerName.trim(),
          email: email.trim(),
          password,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.error || "Registration failed. Please try again.");
        setLoading(false);
        return;
      }

      setSuccess(true);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <AuthShell>
        <div className={`${auth.card} mx-auto w-full text-center`}>
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
          <h1 className={`${authDisplayFont} m-0 mb-2 text-xl text-slate-900`}>Registration Successful</h1>
          <p className="m-0 mb-6 text-sm text-slate-600">
            Your restaurant is pending approval. You will be able to log in once the platform administrator
            approves your account.
          </p>
          <Link
            href="/login"
            className="inline-block rounded-full bg-gradient-to-r from-teal-600 to-teal-700 px-6 py-2.5 text-sm font-semibold text-white no-underline shadow-md shadow-teal-600/25 transition hover:from-teal-700 hover:to-teal-800"
          >
            Go to Sign in
          </Link>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell>
      <div className={`${auth.card} relative mx-auto w-full`}>
        <Link
          href="/"
          aria-label="Close"
          className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-stone-100 text-slate-500 transition hover:bg-stone-200 hover:text-slate-800"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </Link>
        <h1 className={`${authDisplayFont} ${auth.title}`}>Register your restaurant</h1>
        <p className={auth.subtitle}>Create an account to start using the platform</p>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="restaurantName" className={auth.label}>
              Restaurant name
            </label>
            <input
              id="restaurantName"
              type="text"
              placeholder="My Restaurant"
              className={auth.input}
              value={restaurantName}
              onChange={(e) => setRestaurantName(e.target.value)}
              required
              autoComplete="organization"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="branchName" className={auth.label}>
              Branch name
            </label>
            <input
              id="branchName"
              type="text"
              placeholder="Main Branch"
              className={auth.input}
              value={branchName}
              onChange={(e) => setBranchName(e.target.value)}
              required
              autoComplete="organization-unit"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="country" className={auth.label}>
              Country
            </label>
            <select
              id="country"
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
            <label htmlFor="ownerName" className={auth.label}>
              Owner name
            </label>
            <input
              id="ownerName"
              type="text"
              placeholder="John Doe"
              className={auth.input}
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              required
              autoComplete="name"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className={auth.label}>
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="owner@restaurant.com"
              className={auth.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="mb-5">
            <label htmlFor="password" className={auth.label}>
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Min 6 characters"
              className={auth.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              autoComplete="new-password"
            />
          </div>

          {error && <p className={`${auth.error} mb-4`}>{error}</p>}

          <button type="submit" className={auth.btnPrimary} disabled={loading}>
            {loading ? "Registering…" : "Register"}
          </button>
        </form>

        <p className={`mt-6 text-center ${auth.muted}`}>
          Already have an account?{" "}
          <Link href="/login" className={auth.link}>
            Sign in
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}

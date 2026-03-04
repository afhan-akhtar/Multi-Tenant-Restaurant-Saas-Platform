"use client";

import { useState } from "react";
import Link from "next/link";
import { COUNTRIES } from "@/lib/countries";

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [restaurantName, setRestaurantName] = useState("");
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
      <main className="min-h-screen min-h-[100dvh] flex items-center justify-center p-4 sm:p-6 bg-gradient-to-br from-[#1a1a2e] to-[#16213e] box-border">
        <div className="w-full max-w-[420px] bg-white/5 rounded-xl p-6 sm:p-8 border border-white/10 text-center">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-emerald-500/20 flex items-center justify-center">
            <svg className="w-7 h-7 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <path d="M22 4L12 14.01l-3-3" />
            </svg>
          </div>
          <h1 className="m-0 mb-2 text-xl text-white">Registration Successful</h1>
          <p className="m-0 mb-6 text-sm text-white/70">
            Your restaurant is pending approval. You will be able to log in once the platform administrator approves your account.
          </p>
          <Link
            href="/login"
            className="inline-block py-2.5 px-5 bg-primary text-white rounded-lg text-sm font-medium no-underline hover:opacity-90 transition-opacity"
          >
            Go to Sign in
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen min-h-[100dvh] flex items-center justify-center p-4 sm:p-6 bg-gradient-to-br from-[#1a1a2e] to-[#16213e] box-border">
      <div className="w-full max-w-[420px] bg-white/5 rounded-xl p-6 sm:p-8 border border-white/10">
        <h1 className="m-0 mb-1 text-2xl text-white">Register your restaurant</h1>
        <p className="m-0 mb-6 text-sm text-white/60">Create an account to start using the platform</p>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="restaurantName" className="block mb-1 text-sm text-white/80">
              Restaurant name
            </label>
            <input
              id="restaurantName"
              type="text"
              placeholder="My Restaurant"
              className="w-full py-3 px-4 border border-white/20 rounded-lg bg-black/20 text-white text-base box-border placeholder:text-white/40"
              value={restaurantName}
              onChange={(e) => setRestaurantName(e.target.value)}
              required
              autoComplete="organization"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="country" className="block mb-1 text-sm text-white/80">
              Country
            </label>
            <select
              id="country"
              className="w-full py-3 px-4 border border-white/20 rounded-lg bg-black/20 text-white text-base box-border"
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
            <label htmlFor="ownerName" className="block mb-1 text-sm text-white/80">
              Owner name
            </label>
            <input
              id="ownerName"
              type="text"
              placeholder="John Doe"
              className="w-full py-3 px-4 border border-white/20 rounded-lg bg-black/20 text-white text-base box-border placeholder:text-white/40"
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              required
              autoComplete="name"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block mb-1 text-sm text-white/80">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="owner@restaurant.com"
              className="w-full py-3 px-4 border border-white/20 rounded-lg bg-black/20 text-white text-base box-border placeholder:text-white/40"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="mb-5">
            <label htmlFor="password" className="block mb-1 text-sm text-white/80">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Min 6 characters"
              className="w-full py-3 px-4 border border-white/20 rounded-lg bg-black/20 text-white text-base box-border placeholder:text-white/40"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              autoComplete="new-password"
            />
          </div>

          {error && <p className="mb-4 text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            className="w-full py-3 bg-primary text-white border-none rounded-lg text-base font-semibold cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? "Registering…" : "Register"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-white/60">
          Already have an account?{" "}
          <Link href="/login" className="text-primary no-underline hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}

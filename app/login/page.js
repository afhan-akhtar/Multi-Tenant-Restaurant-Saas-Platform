"use client";

import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./login.module.css";

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
    <main className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>Sign in</h1>
        <div className={styles.tabs}>
          <button
            type="button"
            className={`${styles.tab} ${mode === "super_admin" ? styles.active : ""}`}
            onClick={() => setMode("super_admin")}
          >
            Platform Admin
          </button>
          <button
            type="button"
            className={`${styles.tab} ${mode === "staff" ? styles.active : ""}`}
            onClick={() => setMode("staff")}
          >
            Restaurant Staff
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          {mode === "staff" && (
            <div className={styles.formGroup}>
              <label htmlFor="subdomain" className={styles.label}>
                Subdomain
              </label>
              <input
                id="subdomain"
                type="text"
                placeholder="your-restaurant"
                className={styles.input}
                value={subdomain}
                onChange={(e) => setSubdomain(e.target.value)}
                required={mode === "staff"}
                autoComplete="organization"
              />
            </div>
          )}
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>
              Password
            </label>
            <input
              id="password"
              type="password"
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              autoComplete="current-password"
            />
          </div>
          {error && <p className={styles.error}>{error}</p>}
          <button type="submit" className={styles.submit} disabled={loading}>
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className={styles.page} style={{ justifyContent: "center" }}>Loading…</div>}>
      <LoginForm />
    </Suspense>
  );
}

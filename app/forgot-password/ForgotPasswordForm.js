"use client";

import { useState } from "react";
import Link from "next/link";
import Spinner from "@/app/components/Spinner";
import { AuthShell, auth, authDisplayFont } from "@/app/components/auth/AuthShell";

function FormInner() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Invalid email. This address is not registered.");
        return;
      }
      setDone(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <AuthShell>
        <div className={`${auth.cardNarrow} mx-auto w-full`}>
          <h1 className={`${authDisplayFont} ${auth.title}`}>Check your email</h1>
          <p className={auth.subtitle}>
            We sent a message to <strong>{email}</strong> with a link to reset your password. The
            link expires in one hour. If you use more than one restaurant, you may receive several
            emails.
          </p>
          <p className={`mb-0 ${auth.muted}`}>
            <Link className={auth.link} href="/login">
              Back to sign in
            </Link>
          </p>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell>
      <div className={`${auth.cardNarrow} mx-auto w-full`}>
        <h1 className={`${authDisplayFont} ${auth.title}`}>Forgot password</h1>
        <p className={auth.subtitle}>
          Enter the email for your account. We&apos;ll send you a link to reset your password.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="forgot-email" className={auth.label}>
              Email
            </label>
            <input
              id="forgot-email"
              type="email"
              className={auth.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          {error ? <p className={auth.error}>{error}</p> : null}
          <button type="submit" className={`${auth.btnPrimary} mt-2`} disabled={loading}>
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Spinner size="sm" className="text-white" />
                Sending…
              </span>
            ) : (
              "Send reset link"
            )}
          </button>
        </form>
        <p className={`mb-0 mt-6 text-center ${auth.muted}`}>
          <Link className={auth.link} href="/login">
            Back to sign in
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}

export function ForgotPasswordForm() {
  return <FormInner />;
}

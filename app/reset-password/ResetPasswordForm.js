"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Spinner from "@/app/components/Spinner";
import { AuthShell, auth, authDisplayFont } from "@/app/components/auth/AuthShell";
import { PasswordField } from "@/app/components/auth/PasswordField";

function FormInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (password.length < 8) {
      setError("Use at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (!token) {
      setError("Missing token. Open the link from your email again.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Reset failed.");
        return;
      }
      router.replace("/login?reset=1");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <AuthShell>
        <div className={`${auth.cardNarrow} mx-auto w-full`}>
          <h1 className={`${authDisplayFont} ${auth.title}`}>Invalid link</h1>
          <p className={auth.subtitle}>
            This page needs a <code>token</code> from the password reset email.
          </p>
          <Link className={auth.link} href="/forgot-password">
            Request a new link
          </Link>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell>
      <div className={`${auth.cardNarrow} mx-auto w-full`}>
        <h1 className={`${authDisplayFont} ${auth.title}`}>Set a new password</h1>
        <p className={auth.subtitle}>Choose a strong password for your account.</p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="new-pass" className={auth.label}>
              New password
            </label>
            <PasswordField
              id="new-pass"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              autoComplete="new-password"
              showPassword={showNewPassword}
              onToggleShow={() => setShowNewPassword((v) => !v)}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="new-pass2" className={auth.label}>
              Confirm password
            </label>
            <PasswordField
              id="new-pass2"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              minLength={8}
              autoComplete="new-password"
              showPassword={showConfirmPassword}
              onToggleShow={() => setShowConfirmPassword((v) => !v)}
            />
            {confirm.length > 0 ? (
              <p
                className={`mb-0 mt-2 text-sm font-medium ${
                  password === confirm ? "text-teal-700" : "text-red-600"
                }`}
                role="status"
              >
                {password === confirm ? "Passwords match" : "Passwords do not match"}
              </p>
            ) : null}
          </div>
          {error ? <p className={auth.error}>{error}</p> : null}
          <button type="submit" className={`${auth.btnPrimary} mt-2`} disabled={loading}>
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Spinner size="sm" className="text-white" />
                Saving…
              </span>
            ) : (
              "Update password"
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

export function ResetPasswordForm() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center text-slate-500">
          Loading…
        </div>
      }
    >
      <FormInner />
    </Suspense>
  );
}

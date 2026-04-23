"use client";

import { auth } from "@/app/components/auth/AuthShell";

function EyeIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );
}

function EyeOffIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
  );
}

/**
 * Password input with inline show/hide toggle. Uses same styles as {@link auth.input}.
 */
export function PasswordField({
  id,
  value,
  onChange,
  autoComplete = "current-password",
  required = false,
  minLength,
  placeholder,
  showPassword,
  onToggleShow,
  className = "",
}) {
  const inputClass = `${auth.input} pr-12 ${className}`.trim();

  return (
    <div className="relative">
      <input
        id={id}
        type={showPassword ? "text" : "password"}
        className={inputClass}
        value={value}
        onChange={onChange}
        required={required}
        minLength={minLength}
        placeholder={placeholder}
        autoComplete={autoComplete}
      />
      <button
        type="button"
        className="absolute right-1.5 top-1/2 flex h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-lg border-0 bg-transparent text-slate-500 transition-colors hover:bg-stone-100/90 hover:text-teal-700"
        onClick={onToggleShow}
        aria-label={showPassword ? "Hide password" : "Show password"}
        aria-pressed={showPassword}
      >
        {showPassword ? (
          <EyeOffIcon className="h-5 w-5 shrink-0" />
        ) : (
          <EyeIcon className="h-5 w-5 shrink-0" />
        )}
      </button>
    </div>
  );
}

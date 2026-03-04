"use client";

// Reusable SVG spinner + page/inline loaders
export default function Spinner({ size = "md", className = "" }) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-12 h-12",
  };

  return (
    <svg
      className={`animate-spin text-white ${sizeClasses[size]} ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      role="status"
      aria-label="Loading"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

export function PageLoader() {
  return (
    <div className="min-h-screen min-h-[100dvh] flex items-center justify-center p-4 bg-gradient-to-br from-[#1a1a2e] to-[#16213e] text-white">
      <div className="flex flex-col items-center gap-4">
        <Spinner size="xl" className="text-white" />
        <p className="text-sm text-white/80">Loading...</p>
      </div>
    </div>
  );
}

export function InlineLoader({ label = "Loading…" }) {
  return (
    <div className="flex items-center justify-center gap-2 text-sm text-white/80">
      <Spinner size="sm" />
      <span>{label}</span>
    </div>
  );
}


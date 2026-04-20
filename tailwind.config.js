/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["var(--font-poppins)", "system-ui", "sans-serif"],
      },
      colors: {
        primary: "#e94560",
        "primary-hover": "#d63852",
        "color-bg": "#f8f9fa",
        "color-card": "#ffffff",
        sidebar: "#1a1d29",
        "sidebar-hover": "#252936",
        "color-text": "#2d3748",
        "color-text-muted": "#718096",
        "color-border": "#e2e8f0",
      },
      spacing: {
        "sidebar": "260px",
        "sidebar-collapsed": "72px",
        "header": "64px",
      },
      borderRadius: {
        sm: "6px",
        md: "8px",
        lg: "12px",
      },
      boxShadow: {
        sm: "0 1px 2px rgba(0, 0, 0, 0.05)",
        md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)",
        lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)",
        "glow-teal": "0 0 30px rgba(20, 184, 166, 0.35)",
        "glow-teal-sm": "0 0 16px rgba(20, 184, 166, 0.25)",
      },
      minWidth: {
        "sidebar": "260px",
        "sidebar-collapsed": "72px",
      },
      animation: {
        "toast-in": "toastIn 0.2s ease-out",
        "float": "float 7s ease-in-out infinite",
        "float-delayed": "float 7s ease-in-out infinite -3.5s",
        "float-slow": "float 10s ease-in-out infinite -2s",
        "fade-up": "fadeUp 0.7s ease-out forwards",
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "slide-in-left": "slideInLeft 0.7s ease-out forwards",
        "slide-in-right": "slideInRight 0.7s ease-out forwards",
        "scale-in": "scaleIn 0.5s ease-out forwards",
        "shimmer": "shimmer 2.5s linear infinite",
        "badge-pulse": "badgePulse 2.5s ease-in-out infinite",
        "spin-slow": "spin 20s linear infinite",
      },
      keyframes: {
        toastIn: {
          "0%": { opacity: "0", transform: "translate(-50%, 10px)" },
          "100%": { opacity: "1", transform: "translate(-50%, 0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px) scale(1)" },
          "50%": { transform: "translateY(-22px) scale(1.03)" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(28px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideInLeft: {
          "0%": { opacity: "0", transform: "translateX(-32px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(32px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.93)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
        badgePulse: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(20,184,166,0.5)" },
          "50%": { boxShadow: "0 0 0 8px rgba(20,184,166,0)" },
        },
      },
    },
  },
  plugins: [],
};

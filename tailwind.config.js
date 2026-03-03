/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
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
      },
      minWidth: {
        "sidebar": "260px",
        "sidebar-collapsed": "72px",
      },
      animation: {
        "toast-in": "toastIn 0.2s ease-out",
      },
      keyframes: {
        toastIn: {
          "0%": { opacity: "0", transform: "translate(-50%, 10px)" },
          "100%": { opacity: "1", transform: "translate(-50%, 0)" },
        },
      },
    },
  },
  plugins: [],
};

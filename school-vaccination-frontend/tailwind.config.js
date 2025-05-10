/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#f8fafc",
        foreground: "#020817",
        primary: {
          DEFAULT: "#2563eb",
          dark: "#1d4ed8",
        },
        secondary: "#64748b",
        accent: "#f59e0b",
        success: "#22c55e",
        warning: "#f59e0b",
        destructive: "#ef4444",
        muted: {
          DEFAULT: "#f1f5f9",
          foreground: "#64748b",
        },
        card: {
          DEFAULT: "#ffffff",
          foreground: "#020817",
        },
        border: "#e2e8f0",
        input: "#e2e8f0",
        ring: "#2563eb",
      },
      borderRadius: {
        lg: "0.5rem",
        md: "0.375rem",
        sm: "0.25rem",
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
};

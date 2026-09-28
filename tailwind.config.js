/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#0056D2", // Coursera Signature Royal Blue
          hover: "#00419E",   // Deep Royal Navy
          accent: "#2563EB",  // Electric Blue
          dark: "#002F72",
          soft: "#EFF6FF",    // Soft Ice Blue
          border: "#BFDBFE",  // Border for soft pills
        },
        surface: {
          DEFAULT: "#FFFFFF", // Crisp White
          base: "#F8FAFC",    // Clean Off-White / Soft Slate
          card: "#FFFFFF",
          tint: "#F0F5FF",
          alt: "#F1F5F9",
        },
        border: {
          DEFAULT: "#E2E8F0", // Clean Slate Gray
          hover: "#CBD5E1",
          subtle: "#F1F5F9",
        },
        navy: {
          900: "#0A192F",     // Deep Academic Navy
          800: "#0F172A",     // Charcoal Navy
          700: "#1E293B",
        },
        slate: {
          heading: "#0F172A", // Deep Academic Navy / Charcoal
          body: "#334155",    // Neutral Slate
          muted: "#64748B",   // Subtle Cool Gray
        },
        accent: {
          gold: "#F59E0B",    // Warm Amber Gold
          emerald: "#10B981", // Emerald Green
          red: "#EF4444",     // Clean Error Red
        }
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "'Segoe UI'",
          "Roboto",
          "Inter",
          "system-ui",
          "sans-serif"
        ]
      },
      letterSpacing: {
        academic: "-0.01em",
        tight: "-0.02em",
      },
      borderRadius: {
        sm: "4px",
        DEFAULT: "6px",
        md: "8px",
        lg: "8px",
        xl: "12px",
        "2xl": "16px",
        pill: "9999px"
      },
      boxShadow: {
        card: "0 2px 4px rgba(0, 0, 0, 0.06)",
        "card-hover": "0 6px 16px rgba(0, 0, 0, 0.08)",
        dropdown: "0 4px 14px rgba(0, 0, 0, 0.1)",
        subtle: "0 1px 3px rgba(0, 0, 0, 0.04)",
      }
    }
  },
  plugins: []
};
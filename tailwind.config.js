/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#4F46E5", // Modern Vibrant Indigo
          hover: "#4338CA",   // Deep Indigo
          accent: "#6366F1",  // Violet Indigo Accent
          dark: "#1E1B4B",    // Midnight Indigo
          soft: "#EEF2FF",    // Soft Indigo Ice
          border: "#C7D2FE",  // Indigo Pill Border
        },
        surface: {
          DEFAULT: "#FFFFFF",
          base: "#F9FAFB",    // Clean, warm soft gray (super friendly on the eyes)
          card: "#FFFFFF",
          tint: "#F5F3FF",
          alt: "#F3F4F6",
        },
        border: {
          DEFAULT: "#E5E7EB", // Soft warm gray border
          hover: "#CBD5E1",
          subtle: "#F3F4F6",
        },
        navy: {
          900: "#0F172A",
          800: "#1E293B",
          700: "#334155",
        },
        slate: {
          heading: "#0F172A",
          body: "#334155",
          muted: "#64748B",
        },
        accent: {
          gold: "#F59E0B",
          emerald: "#10B981",
          teal: "#0D9488",
          red: "#EF4444",
        }
      },
      fontFamily: {
        sans: [
          "'Plus Jakarta Sans'",
          "'Inter'",
          "-apple-system",
          "BlinkMacSystemFont",
          "'Segoe UI'",
          "Roboto",
          "sans-serif"
        ]
      },
      borderRadius: {
        sm: "6px",
        DEFAULT: "10px",
        md: "12px",
        lg: "14px",
        xl: "16px",
        "2xl": "20px",
        pill: "9999px"
      },
      boxShadow: {
        card: "0 2px 8px -1px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.04)",
        "card-hover": "0 8px 24px -4px rgba(79, 70, 229, 0.12), 0 4px 8px -2px rgba(0, 0, 0, 0.04)",
        dropdown: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
        subtle: "0 1px 3px rgba(0, 0, 0, 0.05)",
        btn: "0 4px 14px rgba(79, 70, 229, 0.25)"
      }
    }
  },
  plugins: []
};
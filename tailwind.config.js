/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#C1121F", // Vibrant Crimson Red (Color 2)
          hover: "#780000",   // Deep Maroon / Burgundy (Color 1)
          accent: "#669BBC",  // Cerulean Blue (Color 5)
          dark: "#003049",    // Prussian Blue / Deep Navy (Color 4)
          soft: "#FDF0D5",    // Warm Cream / Soft Vanilla (Color 3)
          border: "#E8D7B8",  // Warm Cream Border
        },
        maroon: {
          DEFAULT: "#780000",
          900: "#4D0000",
          800: "#600000",
          700: "#780000",
          600: "#940A16",
        },
        crimson: {
          DEFAULT: "#C1121F",
          900: "#780000",
          800: "#991B1B",
          700: "#B91C1C",
          600: "#C1121F",
          500: "#DC2626",
          100: "#FEE2E2",
          50: "#FEF2F2",
        },
        cream: {
          DEFAULT: "#FDF0D5",
          light: "#FFF9EE",
          base: "#FDF0D5",
          dark: "#F4E0B9",
          border: "#E8D7B8",
        },
        navy: {
          DEFAULT: "#003049",
          950: "#001D2C",
          900: "#003049",
          800: "#073B5A",
          700: "#104C70",
          600: "#1B5D88",
        },
        cerulean: {
          DEFAULT: "#669BBC",
          light: "#A3C4D7",
          dark: "#467A99",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          base: "#FAF7EE", // Warm Soft Canvas
          card: "#FFFFFF",
          tint: "#FDF0D5",
          alt: "#F3ECE0",
          navy: "#003049",
        },
        border: {
          DEFAULT: "#E5DCC5",
          hover: "#669BBC",
          subtle: "#EFE7D5",
        },
        slate: {
          heading: "#003049",
          body: "#1D2D44",
          muted: "#5C768D",
        },
        accent: {
          gold: "#D97706",
          emerald: "#0D9488",
          red: "#C1121F",
          blue: "#669BBC",
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
        card: "0 2px 6px rgba(0, 48, 73, 0.06)",
        "card-hover": "0 6px 18px rgba(0, 48, 73, 0.12)",
        dropdown: "0 8px 24px rgba(0, 48, 73, 0.16)",
        subtle: "0 1px 3px rgba(0, 48, 73, 0.04)",
      }
    }
  },
  plugins: []
};
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans:    ["Plus Jakarta Sans", "sans-serif"],
        display: ["Space Grotesk", "sans-serif"],
      },
      colors: {
        teal: {
          50:  "#e0f7f4",
          100: "#b2ece5",
          300: "#4dd6c8",
          400: "#26c6b5",
          500: "#00bfa5",
          600: "#00a896",
          700: "#008c7a",
        },
        coral: {
          400: "#ff6b6b",
          500: "#f95252",
          600: "#e03e3e",
        },
      },
      animation: {
        "spin-slow": "spin 3s linear infinite",
      },
    },
  },
  plugins: [],
};
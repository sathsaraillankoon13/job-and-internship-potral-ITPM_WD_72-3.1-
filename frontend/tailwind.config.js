/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        skyBrand: {
          50: "#f0f6ff",
          100: "#dbeafe",
          300: "#60a5fa",
          500: "#2563eb",
          700: "#1d4ed8",
          900: "#1e3a8a",
        },
      },
      boxShadow: {
        card: "0 8px 32px rgba(15,23,42,0.1), 0 2px 8px rgba(15,23,42,0.06)",
        glow: "0 10px 32px rgba(37,99,235,0.35)",
      },
      fontFamily: {
        sans: ["Cabinet Grotesk", "sans-serif"],
        serif: ["Lora", "serif"],
      },
    },
  },
  plugins: [],
};

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: "#1E293B",
          amber: "#F59E0B",
          bg: "#F8FAFC",
        },
        status: {
          pending: "#94A3B8",
          inservice: "#F59E0B",
          delivered: "#10B981",
        }
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [require("daisyui")],
}
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
          DEFAULT: "#E8611A",
          50:  "#FEF3EC",
          100: "#FDE3CF",
          200: "#FBBD96",
          300: "#F8975D",
          400: "#F47630",
          500: "#E8611A",
          600: "#C44E12",
          700: "#9A3C0D",
          800: "#712C09",
          900: "#481C06",
        },
      },
    },
  },
  plugins: [],
}
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        taste: {
          gold: '#D4AF37',
          bronze: '#CD7F32',
        }
      }
    },
  },
  plugins: [],
}

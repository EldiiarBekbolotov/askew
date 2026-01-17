/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./App.tsx",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Orbitron', 'sans-serif'],
        jersey: ['Jersey 15', 'sans-serif'],
      },
      colors: {
        neon: {
          pink: '#ff006e',
          cyan: '#00f5ff',
          purple: '#b537f2',
          green: '#39ff14',
        }
      }
    },
  },
  plugins: [],
}

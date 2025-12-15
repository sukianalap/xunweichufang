/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Noto Serif SC"', 'serif'],
        sans: ['"Noto Sans SC"', 'sans-serif'],
      },
      colors: {
        'china-red': '#C23531',
        'ink-black': '#2F2F2F',
        'rice-paper': '#F8F4E6',
        'jade-green': '#5E8B7E',
      }
    },
  },
  plugins: [],
}
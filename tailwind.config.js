/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        'zb-green': {
          DEFAULT: '#058f1f',
          dark: '#047017',
          light: '#06b525',
        }
      }
    },
  },
  plugins: [],
}

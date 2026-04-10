/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        'primary':"#5f6FFF",
        'accent': '#00D4AA',
        'dark': '#0D1117',
        'darkSurface': '#131929',
        'neonPurple': '#7B2FFF',
      },
      gridTemplateColumns:{
        'auto':'repeat(auto-fill, minmax(200px ,1fr))'
      }
    },
  },
  plugins: [],
}


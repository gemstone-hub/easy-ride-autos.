/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          orange: '#FF5C00', // Matches the logo's vibrant orange
          black: '#111111',
          silver: '#C0C0C0', // Or slightly darker #A0A0A0 depending on contrast
          white: '#FFFFFF',
          dark: '#0A0A0A', // Main background replacing black for better depth
          gray: '#1E1E1E', // Secondary background
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

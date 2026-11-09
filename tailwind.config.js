/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eefcf3', 100: '#d6f7e0', 200: '#b0edc4', 300: '#7adfa0',
          400: '#43c877', 500: '#22ad5c', 600: '#158c49', 700: '#13713c',
          800: '#125a33', 900: '#0f4a2c', 950: '#062817',
        },
        accent: {
          50: '#fff8eb', 100: '#ffe8c6', 200: '#ffce88', 300: '#ffae4a',
          400: '#ff9020', 500: '#f97316', 600: '#e25309', 700: '#bb3d09',
          800: '#94310e', 900: '#782a0f',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Sora', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

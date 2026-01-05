/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1976d2',
          light: '#42a5f5',
          dark: '#1565c0',
        },
        secondary: {
          DEFAULT: '#9c27b0',
          light: '#ba68c8',
          dark: '#7b1fa2',
        },
        customGreen: {
          DEFAULT: '#2ECC71',
          light: '#A7F3D0',
          dark: '#27AE60',
        },
      },
    },
  },
  plugins: [],
};

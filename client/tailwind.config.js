/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        indigo: {
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
        },
        blue: {
          500: '#4a90e2',
          800: '#1d4371',
        }
      }
    },
  },
  plugins: [],
};

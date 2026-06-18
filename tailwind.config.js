/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: '#47B275',
        primaryDark: '#3A9260',
        primaryLight: '#73CD9A',
        secondary: '#EBFFF3',
        accent: '#FFC043',
        success: '#3A9260',
        error: '#F23838',
        neutral: {
          900: '#000000',
          800: '#222222',
          700: '#444444',
          600: '#666666',
          500: '#888888',
          400: '#999999',
          300: '#BBBBBB',
          200: '#DDDDDD',
          100: '#F7F7F7',
          50: '#F7F7F7',
        },
      },
    },
  },
  plugins: [],
};

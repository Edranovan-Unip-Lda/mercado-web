/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        ministry: {
          50: '#eef8f6',
          100: '#d5eee9',
          500: '#1f8a78',
          600: '#176f63',
          700: '#125950'
        },
        civic: {
          gold: '#c99a2e',
          red: '#b42318',
          ink: '#1f2937'
        }
      }
    }
  },
  plugins: []
};

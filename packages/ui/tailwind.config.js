/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gray: {
          light: '#F7F5F2',
        },
        blue: {
          link: '#22609D',
        },
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['src/**/*.{js,ts,jsx,tsx}', '../../packages/ui/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      typography: theme => ({
        DEFAULT: {
          css: {
            color: theme('colors.gray.900'),
          },
        },
      }),
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
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')],
};

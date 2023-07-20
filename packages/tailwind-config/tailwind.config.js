/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    'src/**/*.{js,ts,jsx,tsx}',
    '../../packages/ui/**/*.{js,ts,jsx,tsx}',
  ],
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
        sand: {
          50: 'hsl(36, 20%, 97%)',
          100: 'hsl(36, 20%, 90%)',
          200: 'hsl(36, 20%, 80%)',
          300: 'hsl(36, 20%, 70%)',
          400: 'hsl(36, 20%, 60%)',
          500: 'hsl(36, 20%, 50%)',
          600: 'hsl(36, 20%, 40%)',
          700: 'hsl(36, 20%, 30%)',
          800: 'hsl(36, 20%, 20%)',
          900: 'hsl(36, 20%, 10%)',
        },
        blueGrey: {
          50: 'hsl(216, 35%, 97%)',
          100: 'hsl(216, 35%, 90%)',
          200: 'hsl(216, 35%, 80%)',
          300: 'hsl(216, 35%, 70%)',
          400: 'hsl(216, 35%, 60%)',
          500: 'hsl(216, 35%, 52%)',
          600: 'hsl(216, 35%, 40%)',
          700: 'hsl(216, 35%, 30%)',
          800: 'hsl(216, 35%, 20%)',
          900: 'hsl(216, 35%, 10%)',
        },
        greenGrey: {
          50: 'hsl(170, 35%, 97%)',
          100: 'hsl(170, 35%, 90%)',
          200: 'hsl(170, 35%, 80%)',
          300: 'hsl(170, 35%, 70%)',
          400: 'hsl(170, 35%, 60%)',
          500: 'hsl(170, 35%, 52%)',
          600: 'hsl(170, 35%, 40%)',
          700: 'hsl(170, 35%, 30%)',
          800: 'hsl(170, 35%, 20%)',
          900: 'hsl(170, 35%, 10%)',
        },
        blue: {
          link: '#22609D',
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
};

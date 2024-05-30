import type {Config} from 'tailwindcss';
import formsPlugin from '@tailwindcss/forms';
import typographyPlugin from '@tailwindcss/typography';
import aspectRatioPlugin from '@tailwindcss/aspect-ratio';

export default {
  content: [
    'src/**/*.{js,ts,jsx,tsx}',
    '../../packages/ui/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      typography: (theme: (color: string) => string) => ({
        DEFAULT: {
          css: {
            color: theme('colors.gray.900'),
          },
        },
      }),
      colors: {
        'consortium-blue': {
          50: '#c6d5f2',
          100: '#a9b9db',
          200: '#6d82ab',
          300: '#455d8d',
          400: '#3c5485',
          500: '#223b6e',
          600: '#1e386e',
          700: '#142f65',
          800: 'hsl(220, 82%, 20%)',
          900: '#082154',
          950: '#071e4a',
          970: '#061a41',
        },
        'consortium-green': {
          50: 'hsl(145, 65%, 96%)',
          100: 'hsl(145, 65%, 90%)',
          200: 'hsl(145, 65%, 80%)',
          300: 'hsl(145, 65%, 70%)',
          400: 'hsl(145, 65%, 60%)',
          500: 'hsl(145, 65%, 50%)',
          600: 'hsl(145, 65%, 40%)',
          700: 'hsl(145, 65%, 30%)',
          800: 'hsl(145, 65%, 20%)',
          900: 'hsl(145, 65%, 10%)',
        },
        'consortium-light-blue': {
          50: 'hsl(187, 20%, 99%)',
          100: 'hsl(188, 10%, 94%)',
        },
        'consortium-sand': {
          50: 'hsl(49, 6%, 98%)',
          100: '#F2EEDF',
          200: '#E6DFC4',
          800: '#504B3C',
        },
        'blue-grey': {
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
        ' green-grey': {
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
  plugins: [formsPlugin, typographyPlugin, aspectRatioPlugin],
} satisfies Config;

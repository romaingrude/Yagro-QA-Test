// https://unocss.dev/guide/config-file

import { defineConfig, presetIcons, presetUno, presetWebFonts } from 'unocss'

export default defineConfig({
  presets: [
    presetUno(),
    presetIcons(),
    presetWebFonts({
      provider: 'google',
      fonts: {
        montserrat: [
          {
            name: 'Montserrat',
            weights: ['200', '400', '700'],
            italic: true,
          },
        ],
      },
    }),
  ],
  /* Used for global CSS */
  preflights: [
    {
      getCSS: ({ theme }) => `
      html {
        box-sizing: border-box;
        scroll-behavior: smooth;
        text-rendering: optimizeSpeed;
        font-family: ${theme.fonts.primary};
        color: ${theme.colors.typography.text};
      }
      
      body {
        margin: 0;
        min-height: 100vh;
      }

      img, svg {
        display: block;
        max-width: 100%;
      }

      ::-webkit-input-placeholder {
        font-size: 14px;
        color: inherit;
        opacity: 0.25;
      }
      ::-moz-placeholder {
        font-size: 14px;
        color: inherit;
        opacity: 0.25
      }
      :-ms-input-placeholder {
        font-size: 14px;
        color: inherit;
        opacity: 0.25;
      }
      ::placeholder {
        font-size: 14px;
        color: inherit;
        opacity: 0.25;
      }
      
      *,
      *::before,
      *::after {
        box-sizing: inherit;
        -webkit-font-smoothing: antialiased;
      }
      `,
    },
  ],
  theme: {
    /*
      Useful tool for generating tints and shades:
      https://www.tailwindshades.com/
    */
    fonts: {
      primary: 'Montserrat, san-serif',
    },
    colors: {
      border: '#ced4da',
      typography: {
        text: '#333333',
      },
      /* Branding */
      yagro: {
        darkGreen: {
          DEFAULT: '#006838',
          50: '#00DB76',
          100: '#00CE6F',
          200: '#00B461',
          300: '#009B53',
          400: '#008246',
          500: '#006838',
          600: '#004E2A',
          700: '#00351D',
          800: '#001B0F',
          900: '#000201',
          950: '#000000',
        },
        lightGreen: {
          DEFAULT: '#8DC63F',
          50: '#E1F0CD',
          100: '#D8EBBD',
          200: '#C5E29D',
          300: '#B2D97E',
          400: '#A0CF5E',
          500: '#8DC63F',
          600: '#6F9E2F',
          700: '#517322',
          800: '#324715',
          900: '#141C08',
          950: '#050702',
        },
      },
      /* User feedback */
      status: {
        success: '#28a745',
        danger: '#ff0000',
        warning: '#ffab00',
        info: '#17a2b8',
      },
    },
    /* Matches Bootstrap for compatibility */
    breakpoints: {
      sm: '576px',
      md: '768px',
      lg: '992px',
      xl: '1200px',
      xxl: '1400px',
    },
  },
})

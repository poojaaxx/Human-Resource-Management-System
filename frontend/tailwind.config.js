/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#14161F',
          50: '#F3F4F7',
          100: '#E3E4EB',
          200: '#B9BBCB',
          300: '#8F92AB',
          400: '#5C5F79',
          500: '#3A3D53',
          600: '#282A3C',
          700: '#1D1F2C',
          800: '#181A25',
          900: '#14161F',
          950: '#0C0D13',
        },
        paper: '#F7F6F2',
        sunrise: {
          DEFAULT: '#F2A93B',
          50: '#FEF6E8',
          100: '#FDECC9',
          200: '#FAD68C',
          300: '#F7C05B',
          400: '#F2A93B',
          500: '#E2932A',
          600: '#C17A1F',
        },
        dusk: {
          DEFAULT: '#FF6452',
          50: '#FFEEEB',
          100: '#FFD8D0',
          400: '#FF6452',
          500: '#F04A38',
          600: '#D33A2A',
        },
        sage: {
          DEFAULT: '#3FA796',
          50: '#E8F7F4',
          100: '#CDEEE7',
          400: '#3FA796',
          500: '#2F8D7E',
          600: '#237267',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      boxShadow: {
        soft: '0 2px 10px -2px rgba(20, 22, 31, 0.06), 0 8px 24px -8px rgba(20, 22, 31, 0.08)',
        lift: '0 8px 30px -6px rgba(20, 22, 31, 0.16)',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: 0, transform: 'translateY(8px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s ease-out both',
      },
    },
  },
  plugins: [],
}

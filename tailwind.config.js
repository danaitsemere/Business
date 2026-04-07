/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts}"
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ['Manrope', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#f3e8fa',
          100: '#e1c4f3',
          200: '#cd9beb',
          300: '#b872e3',
          400: '#a854dc',
          500: '#7630A3',
          600: '#6a2b93',
          700: '#5a2480',
          800: '#4b1d6d',
          900: '#35134f',
        },
        secondary: {
          50: '#f0f3f5',
          100: '#dbe1e7',
          200: '#b7c3cf',
          300: '#8da0b2',
          400: '#6b8199',
          500: '#475569',
          600: '#3d4a5c',
          700: '#323d4d',
          800: '#27303e',
          900: '#1c2330',
        },
        tertiary: {
          50: '#e8faf5',
          100: '#c5f2e5',
          200: '#9ee9d3',
          300: '#64D2B1',
          400: '#4dc9a4',
          500: '#38b08c',
          600: '#2e9474',
          700: '#247860',
          800: '#1a5c4a',
          900: '#104034',
        },
        neutral: {
          50: '#fafafa',
          100: '#f4f4f5',
          200: '#e4e4e7',
          300: '#d4d4d8',
          400: '#a1a1aa',
          500: '#7C757E',
          600: '#636068',
          700: '#4a484e',
          800: '#313034',
          900: '#1a191c',
        },
        surface: {
          primary: '#0f0a18',
          secondary: '#1a1225',
          card: '#221a30',
          'card-hover': '#2d2240',
          elevated: '#2a1f3a',
          input: '#1e1530',
        }
      },
      borderRadius: {
        'xl': '16px',
        '2xl': '24px',
      },
      transitionDuration: {
        '250': '250ms',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(118, 48, 163, 0.3)',
        'glow-lg': '0 0 40px rgba(118, 48, 163, 0.2)',
        'dark-sm': '0 1px 3px rgba(0, 0, 0, 0.3)',
        'dark-md': '0 4px 12px rgba(0, 0, 0, 0.4)',
        'dark-lg': '0 8px 32px rgba(0, 0, 0, 0.5)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease forwards',
        'slide-left': 'slideInLeft 0.4s ease forwards',
        'slide-right': 'slideInRight 0.4s ease forwards',
        'scale-in': 'scaleIn 0.3s ease forwards',
        'float': 'float 4s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          from: { opacity: '0', transform: 'translateX(-20px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          from: { opacity: '0', transform: 'translateX(20px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
    },
  },
  plugins: [],
}
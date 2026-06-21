/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#f0f0ff',
          100: '#e0e1ff',
          200: '#c7c7fe',
          300: '#a5a3fc',
          400: '#8175f8',
          500: '#6b52f3',
          600: '#5b34e8',
          700: '#4e25d4',
          800: '#4120ac',
          900: '#371e88',
        },
        accent: {
          50:  '#fff8ed',
          100: '#ffefd4',
          200: '#ffdba8',
          300: '#ffc06e',
          400: '#ff9932',
          500: '#ff7b0a',
          600: '#f05f00',
          700: '#c74600',
          800: '#9e3800',
          900: '#7f2f00',
        },
        surface: {
          50:  '#f8f8ff',
          100: '#f1f1fe',
          200: '#e8e8fd',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      fontSize: {
        '2xs': ['0.65rem', { lineHeight: '1rem' }],
      },
      boxShadow: {
        'soft':    '0 2px 15px -3px rgba(0,0,0,0.07), 0 10px 20px -2px rgba(0,0,0,0.04)',
        'medium':  '0 4px 25px -5px rgba(0,0,0,0.1), 0 10px 30px -5px rgba(0,0,0,0.06)',
        'large':   '0 10px 40px -10px rgba(0,0,0,0.15), 0 20px 50px -10px rgba(0,0,0,0.08)',
        'glow':    '0 0 20px rgba(91,52,232,0.3)',
        'glow-sm': '0 0 10px rgba(91,52,232,0.2)',
        'inner-sm':'inset 0 1px 3px rgba(0,0,0,0.08)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #5b34e8 0%, #8175f8 100%)',
        'gradient-warm':    'linear-gradient(135deg, #5b34e8 0%, #c026d3 100%)',
        'gradient-dark':    'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
        'gradient-card':    'linear-gradient(145deg, rgba(255,255,255,0.9) 0%, rgba(248,248,255,0.9) 100%)',
      },
      animation: {
        'fade-in':     'fadeIn 0.3s ease-out',
        'slide-up':    'slideUp 0.3s ease-out',
        'slide-down':  'slideDown 0.2s ease-out',
        'scale-in':    'scaleIn 0.2s ease-out',
        'pulse-slow':  'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer':     'shimmer 1.5s infinite',
        'bounce-soft': 'bounceSoft 0.6s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%':   { opacity: '0', transform: 'translateY(-8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%':   { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        bounceSoft: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-4px)' },
        },
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};

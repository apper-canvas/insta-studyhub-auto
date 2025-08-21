/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#F4F3FF',
          100: '#EBE9FE',
          200: '#DAD5FE',
          300: '#C0B5FD',
          400: '#A089FB',
          500: '#8B7FFF',
          600: '#5B47E0',
          700: '#4C38C7',
          800: '#412EA8',
          900: '#36268A',
        },
        accent: {
          50: '#FFF5F5',
          100: '#FED7D7',
          200: '#FEB2B2',
          300: '#FC8181',
          400: '#F56565',
          500: '#FF6B6B',
          600: '#E53E3E',
          700: '#C53030',
          800: '#9B2C2C',
          900: '#742A2A',
        },
        surface: {
          50: '#FFFFFF',
          100: '#F8F9FC',
          200: '#F1F3F6',
          300: '#E4E7EC',
          400: '#D0D5DD',
          500: '#98A2B3',
          600: '#667085',
          700: '#475467',
          800: '#344054',
          900: '#1D2939',
        }
      },
      fontFamily: {
        'display': ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        'body': ['Inter', 'system-ui', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-soft': 'bounceSoft 0.6s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceSoft: {
          '0%, 20%, 53%, 80%, 100%': { transform: 'translate3d(0,0,0)' },
          '40%, 43%': { transform: 'translate3d(0, -10px, 0)' },
          '70%': { transform: 'translate3d(0, -5px, 0)' },
          '90%': { transform: 'translate3d(0, -2px, 0)' },
        }
      }
    },
  },
  plugins: [],
}
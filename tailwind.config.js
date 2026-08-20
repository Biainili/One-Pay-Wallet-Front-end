/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        tg: {
          bg: 'var(--tg-theme-bg-color, #0f172a)',
          secondaryBg: 'var(--tg-theme-secondary-bg-color, #1e293b)',
          text: 'var(--tg-theme-text-color, #f8fafc)',
          hint: 'var(--tg-theme-hint-color, #94a3b8)',
          link: 'var(--tg-theme-link-color, #38bdf8)',
          button: 'var(--tg-theme-button-color, #0ea5e9)',
          buttonText: 'var(--tg-theme-button-text-color, #ffffff)',
        },
        brand: {
          blue: '#0088cc',
          cyan: '#06b6d4',
          dark: '#0b1120',
          card: '#151e32',
          cardHover: '#1c2842',
          accent: '#10b981',
          gold: '#f59e0b',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 25px -5px rgba(6, 182, 212, 0.25)',
        glowBlue: '0 0 25px -5px rgba(14, 165, 233, 0.3)',
      }
    },
  },
  plugins: [],
}

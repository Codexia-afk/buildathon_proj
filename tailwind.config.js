/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#070A11',
        card: '#0D1424',
        'card-border': '#1E293B',
        'card-hover': '#141D33',
        brand: {
          50: '#fff4ed',
          100: '#ffe6d4',
          200: '#fecba9',
          300: '#fda673',
          400: '#fb7637',
          500: '#f9520c',
          DEFAULT: '#FF4D00', // Electric Blaze Orange
          600: '#ea3804',
          700: '#c22606',
          800: '#9a200d',
          900: '#7c1e0e',
        },
        cyber: {
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          DEFAULT: '#00F0FF', // High-voltage Cyan
          600: '#0891b2',
          700: '#0e7490',
        },
        verified: '#10B981',
        gold: '#F59E0B',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Teko', 'Plus Jakarta Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'glow-brand': '0 0 25px -5px rgba(255, 77, 0, 0.4)',
        'glow-cyber': '0 0 25px -5px rgba(0, 240, 255, 0.35)',
        'glow-verified': '0 0 20px -3px rgba(16, 185, 129, 0.4)',
        'card-elevated': '0 10px 30px -10px rgba(0, 0, 0, 0.7)',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.75', transform: 'scale(1.04)' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        },
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scanline': 'scanline 4s linear infinite',
      }
    },
  },
  plugins: [],
}

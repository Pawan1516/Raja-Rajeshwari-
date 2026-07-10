/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        whatsapp: '#25D366',
        whatsappdark: '#128C7E',
        wood: {
          light: '#EED9C4',
          DEFAULT: '#C5A880', // Premium Champagne Gold
          dark: '#A68059',
        },
        forest: {
          light: '#4CAF50',
          DEFAULT: '#2E7D32',
          dark: '#1B5E20',
        },
        royal: {
          light: '#1E293B',
          DEFAULT: '#0F172A',
          dark: '#020617',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        outfit: ['Outfit', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'call-glow': '0 10px 15px -3px rgba(46,125,50,0.20), 0 4px 6px -2px rgba(46,125,50,0.10)',
        'call-glow-hover': '0 20px 25px -5px rgba(46,125,50,0.35), 0 10px 10px -5px rgba(46,125,50,0.20)',
        'premium': '0 10px 30px -15px rgba(197,168,128,0.15), 0 4px 6px -2px rgba(37,211,102,0.02)',
        'premium-hover': '0 20px 45px -15px rgba(197,168,128,0.28), 0 10px 15px -3px rgba(37,211,102,0.06)',
        'gold-glow': '0 0 20px 2px rgba(197,168,128,0.25)',
      },
      backgroundImage: {
        'hero-gradient': 'radial-gradient(ellipse at top left, rgba(46,125,50,0.18) 0%, transparent 65%)',
        'gold-gradient': 'linear-gradient(135deg, #EED9C4 0%, #C5A880 50%, #A68059 100%)',
      },
      animation: {
        'float-slow': 'float 8s ease-in-out infinite',
        'pulse-slow': 'pulse 12s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) scale(1)' },
          '50%': { transform: 'translateY(-15px) scale(1.02)' },
        }
      }
    },
  },
  plugins: [],
}

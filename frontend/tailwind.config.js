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
          light: '#C4A484',
          DEFAULT: '#8B5A2B',
          dark: '#5C4033',
        },
        forest: {
          light: '#4CAF50',
          DEFAULT: '#2E7D32',
          dark: '#1B5E20',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        outfit: ['Outfit', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'call-glow': '0 10px 15px -3px rgba(46,125,50,0.20), 0 4px 6px -2px rgba(46,125,50,0.10)',
        'call-glow-hover': '0 20px 25px -5px rgba(46,125,50,0.35), 0 10px 10px -5px rgba(46,125,50,0.20)',
        'premium': '0 10px 30px -15px rgba(92,64,51,0.15), 0 4px 6px -2px rgba(37,211,102,0.05)',
        'premium-hover': '0 20px 40px -15px rgba(92,64,51,0.25), 0 10px 15px -3px rgba(37,211,102,0.10)',
      },
      backgroundImage: {
        'hero-gradient': 'radial-gradient(ellipse at top left, rgba(46,125,50,0.18) 0%, transparent 65%)',
      }
    },
  },
  plugins: [],
}

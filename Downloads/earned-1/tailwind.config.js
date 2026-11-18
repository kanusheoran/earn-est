/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: {
          50: '#FFFEFA',
          100: '#FAF6EE', // warm editorial cream
          200: '#F5EFE3',
          300: '#EFE5D3',
        },
        lavender: {
          50: '#F9F5F8',
          100: '#EFE6EE',
          200: '#DCCBD9',
          300: '#C7AFC3',
          400: '#B08EAB',
        },
        plum: {
          50: '#F7F3F7',
          100: '#E9DEE8',
          200: '#D4BFD2',
          300: '#BA9CBA',
          400: '#9C7A9B',
          500: '#795C78',
          600: '#644A63',
          700: '#4F394E',
          800: '#3A2939',
          900: '#261A25',
        },
        forest: {
          50: '#EDF5F2',
          100: '#D7E8E1',
          200: '#AFCFC3',
          400: '#4B7C6E',
          500: '#245747', // rich signature forest green
          600: '#1B4739',
          700: '#14382D',
          800: '#0E2921',
          900: '#081C16',
        },
        sage: {
          50: '#F5F8F5',
          100: '#E9EFE8',
          200: '#DCE8DA',
          300: '#C7D9C4',
          400: '#9DBA98',
          500: '#74986E',
        },
        terracotta: {
          50: '#FDF7F3',
          100: '#FBEDE4',
          200: '#F5D8C7',
          400: '#E5855A',
          500: '#D96B3E', // warm burnt orange / bakery terracotta
          600: '#C2572D',
          700: '#A1421E',
        },
        peach: {
          50: '#FDF6F2',
          100: '#F9E5DD',
          200: '#F4C4AF',
          300: '#EEA281',
        },
        mutedYellow: {
          50: '#FEFDF8',
          100: '#FAF4DC',
          200: '#F2D477',
          300: '#E4BD3E',
        },
        citron: {
          300: '#DCF86B',
          400: '#C7F236', // bright energetic agency lime
          500: '#A9DC19',
        },
        charcoal: {
          900: '#242025',
          800: '#3A343D',
          700: '#544D57',
        },
        mutedGray: {
          DEFAULT: '#726B73',
          light: '#9E979F',
          border: '#E7DFC6',
        }
      },
      fontFamily: {
        serif: ['"DM Serif Display"', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        handwriting: ['"Caveat"', 'cursive', 'sans-serif'],
      },
      borderRadius: {
        'xl': '14px',
        '2xl': '18px',
        '3xl': '24px',
        '4xl': '32px',
        'organic': '48px 24px 48px 24px',
      },
      boxShadow: {
        'soft': '0 2px 10px -2px rgba(41, 37, 42, 0.05), 0 1px 3px -1px rgba(41, 37, 42, 0.03)',
        'soft-lg': '0 12px 32px -6px rgba(41, 37, 42, 0.08), 0 4px 12px -2px rgba(41, 37, 42, 0.04)',
        'card': '0 2px 8px 0 rgba(36, 87, 71, 0.06), 0 1px 3px 0 rgba(41, 37, 42, 0.04)',
        'float': '0 16px 40px -8px rgba(36, 87, 71, 0.12), 0 6px 16px -4px rgba(217, 107, 62, 0.08)',
      },
      animation: {
        'spin-slow': 'spin 25s linear infinite',
        'marquee': 'marquee 30s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        }
      }
    },
  },
  plugins: [],
}

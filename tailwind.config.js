/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Base colors
        primary: '#000000',
        secondary: '#FFFFFF',
        tertiary: '#D1D5DB',

        // Semantic colors
        background: '#000000',
        foreground: '#F9FAFB',
        muted: '#0A0A0A',
        'muted-foreground': '#9CA3AF',
        border: '#1A1A1A',
        input: '#0A0A0A',
        ring: '#E91E63',

        // Octogoal colors (dégradé rose → bleu)
        'octo-pink': '#E91E63',
        'octo-pink-light': '#FF4081',
        'octo-blue': '#3F51B5',
        'octo-blue-light': '#2196F3',
        
        // Accent colors Octogoal
        'octo-accent': '#E91E63',
        'octo-card-bg': '#0A0A0A',
        'octo-card-border': 'rgba(255, 255, 255, 0.05)',
        'octo-text-white': '#FFFFFF',
        'octo-text-primary': '#E5E7EB',
        'octo-text-secondary': '#9CA3AF',
        'octo-text-accent': '#E91E63',

        // Gradient stops
        accent: {
          pink: '#E91E63',
          blue: '#3F51B5',
          'pink-5': 'rgba(233, 30, 99, 0.05)',
          'pink-10': 'rgba(233, 30, 99, 0.1)',
          'pink-20': 'rgba(233, 30, 99, 0.2)',
          'pink-40': 'rgba(233, 30, 99, 0.4)',
          'blue-5': 'rgba(63, 81, 181, 0.05)',
          'blue-10': 'rgba(63, 81, 181, 0.1)',
          'blue-20': 'rgba(63, 81, 181, 0.2)',
          'blue-40': 'rgba(63, 81, 181, 0.4)'
        }
      },
      fontFamily: {
        montserrat: ['Montserrat', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        'dm-sans': ['DM Sans', 'sans-serif'],
        playfair: ['Playfair Display', 'serif']
      },
      backgroundImage: {
        'octo-gradient': 'linear-gradient(135deg, #E91E63 0%, #3F51B5 100%)',
        'octo-gradient-hover': 'linear-gradient(135deg, #FF4081 0%, #2196F3 100%)',
      },
      animation: {
        tilt: 'tilt 10s infinite linear',
        'gradient-x': 'gradient-x 15s ease infinite',
        'gradient-y': 'gradient-y 15s ease infinite',
        'gradient-xy': 'gradient-xy 15s ease infinite',
      },
      keyframes: {
        tilt: {
          '0%, 50%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(0.5deg)' },
          '75%': { transform: 'rotate(-0.5deg)' },
        },
        'gradient-y': {
          '0%, 100%': { 'background-size': '400% 400%', 'background-position': 'center top' },
          '50%': { 'background-size': '200% 200%', 'background-position': 'center center' }
        },
        'gradient-x': {
          '0%, 100%': { 'background-size': '200% 200%', 'background-position': 'left center' },
          '50%': { 'background-size': '200% 200%', 'background-position': 'right center' }
        },
        'gradient-xy': {
          '0%, 100%': { 'background-size': '400% 400%', 'background-position': 'left center' },
          '50%': { 'background-size': '200% 200%', 'background-position': 'right center' }
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};

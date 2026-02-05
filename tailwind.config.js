/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary amber color system
        primary: {
          DEFAULT: '#f9a406',
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f9a406',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        
        // Background colors
        background: {
          light: '#FFFDF5', // Warm cream
          dark: '#231c0f',  // Deep warm charcoal
        },
        
        // Surface colors for cards/panels
        surface: {
          light: '#ffffff',
          dark: '#2d2417',   // Slightly lighter charcoal
        },
        
        // Text colors
        text: {
          light: '#181611',  // Stone dark
          dark: '#ffffff',
        },
        
        // Neutral stone colors
        stone: {
          50: '#fafaf9',
          100: '#f5f5f4',
          200: '#e7e5e4',
          300: '#d6d3d1',
          400: '#a8a29e',
          500: '#78716c',
          600: '#57534e',
          700: '#44403c',
          800: '#292524',
          900: '#1c1917',
          950: '#0c0a09',
        },
        
        // Glass effect colors
        glass: {
          light: 'rgba(255, 255, 255, 0.85)',
          dark: 'rgba(45, 36, 23, 0.4)',
        },
      },
      
      fontFamily: {
        display: ['var(--font-space-grotesk)', 'Space Grotesk', 'sans-serif'],
        body: ['var(--font-space-grotesk)', 'Space Grotesk', 'sans-serif'],
      },
      
      borderRadius: {
        DEFAULT: '0.5rem',
        lg: '1rem',
        xl: '1.5rem',
        '2xl': '2rem',
        '3xl': '2.5rem',
      },
      
      boxShadow: {
        'amber-glow': '0 4px 20px -5px rgba(249, 164, 6, 0.4)',
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'glass': '0 4px 30px rgba(0, 0, 0, 0.1)',
      },
      
      backdropBlur: {
        xs: '2px',
      },
      
      animation: {
        'scan-pulse': 'scan-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scan-line': 'scan-line 3s linear infinite',
        'pulse-ring': 'pulse-ring 2s cubic-bezier(0.215, 0.61, 0.355, 1) infinite',
        'float': 'float 4s ease-in-out infinite',
      },
      
      keyframes: {
        'scan-pulse': {
          '0%': { opacity: '0.4' },
          '50%': { opacity: '1' },
          '100%': { opacity: '0.4' },
        },
        'scan-line': {
          '0%': { top: '0%', opacity: '0' },
          '10%': { opacity: '1' },
          '90%': { opacity: '1' },
          '100%': { top: '100%', opacity: '0' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(0.5)', opacity: '0' },
          '50%': { opacity: '0.5' },
          '100%': { transform: 'scale(1.5)', opacity: '0' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Poppins', 'ui-sans-serif', 'system-ui'],
        'header': ['Candal', 'sans-serif'],
      },
      colors: {
        // Primary Brand
        primary: {
          DEFAULT: '#5729FF', // Electric Indigo
          50: '#F3EFFF',
          100: '#E8DEFF',
          200: '#D1BDFF',
          300: '#BA9CFF',
          400: '#A37BFF',
          500: '#5729FF',
          600: '#4A24E6',
          700: '#3D1FCC',
          800: '#301AB3',
          900: '#23159A',
        },
        // Neutrals
        neutral: {
          'light': '#F5F7FA',    // Light Gray - main background
          'medium': '#D1D5DB',   // Cool Gray - borders, input fields
          'dark': '#2E2E2E',     // Charcoal - main text
          'white': '#FFFFFF',    // White - cards, modals, UI surfaces
        },
        // Accent Colors
        accent: {
          'blue': '#3A8DFF',     // Sky Blue - info alerts, secondary buttons
          'green': '#4ADE80',    // Mint Green - success states
          'orange': '#FB923C',   // Sunset Orange - warnings/attention
          'red': '#EF4444',      // Rose Red - errors
        },
        // Secondary Support
        secondary: {
          'lavender': '#BFA8FF', // Lavender - soft backgrounds or tooltips
          'navy': '#1E1B4B',     // Deep Navy - headers, navigation
        },
        // Semantic colors for better UX
        success: '#4ADE80',
        warning: '#FB923C',
        error: '#EF4444',
        info: '#3A8DFF',
      },
    },
  },
  plugins: [],
}

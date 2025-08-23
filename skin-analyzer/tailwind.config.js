/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'cool-gray': '#8E9AAF',
        'thistle': '#CBC0D3',
        'misty-rose': '#EFD3D7',
        'pale-purple': '#FEEAFA',
        'lavender': '#DEE2FF',
      },
      // --- UPDATED: Added new gradients for the modern UI ---
      backgroundImage: {
        // A soft, bright gradient perfect for backgrounds or cards (Used in Dashboard)
        'gradient-daylight': 'linear-gradient(135deg, #FEEAFA 0%, #EFD3D7 50%, #DEE2FF 100%)',
        // A slightly deeper but still light gradient for primary actions (Used in Analyzer)
        'gradient-aurora': 'linear-gradient(135deg, #CBC0D3 0%, #EFD3D7 100%)',
        
        // Original gradients for Navbar and other elements
        'gradient-primary': 'linear-gradient(135deg, #8E9AAF 0%, #CBC0D3 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #EFD3D7 0%, #FEEAFA 100%)',
        'gradient-accent': 'linear-gradient(135deg, #CBC0D3 0%, #DEE2FF 100%)',
        'gradient-full': 'linear-gradient(135deg, #8E9AAF 0%, #CBC0D3 25%, #EFD3D7 50%, #FEEAFA 75%, #DEE2FF 100%)',
      },
      // --- UPDATED: Added new animations ---
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
          '100%': { 'background-position': '0% 50%' },
        },
        spin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
        'shimmer': 'shimmer 3s ease-in-out infinite',
        'spin-slow': 'spin 1s linear infinite',
      },
    },
  },
  plugins: [],
};
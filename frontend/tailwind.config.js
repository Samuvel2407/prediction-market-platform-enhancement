/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'primary-background': {
          DEFAULT: '#020617',
        },
        'custom-gray-verylight': {
          DEFAULT: '#F8FAFC',
        },
        'custom-gray-light': {
          DEFAULT: '#94A3B8',
        },
        'custom-gray-dark': {
          DEFAULT: '#0F172A',
        },
        'beige': {
          DEFAULT: '#06B6D4',
          hover: '#22D3EE',
          active: '#0891B2'
        },
        'green-btn': {
          DEFAULT: '#10B981',
          hover: '#34D399',
          'border-default': '#10B981',
          'border-hover': '#34D399',
        },
        'red-btn': {
          DEFAULT: '#EF4444',
          hover: '#F87171',
          'border-default': '#EF4444',
          'border-hover': '#F87171',
        },
        'gold-btn': {
          DEFAULT: '#F59E0B',
          hover: '#FBBF24',
          active: '#D97706',
        },
        'neutral-btn': {
          DEFAULT: '#2563EB',
          hover: '#3B82F6',
          active: '#1D4ED8',
        },
        'primary-pink': {
          DEFAULT: '#2563EB',
        },
        'info-blue': {
          DEFAULT: '#06B6D4',
        },
        'warning-orange': {
          DEFAULT: '#F59E0B',
        },
      },
      borderRadius: {
        'badge': '12px'
      },
      spacing: {
        'sidebar': '8rem', // more rem means sidebar thicker
      },
      zIndex: {
        'sidebar': 40, // higher number means more on top
      },
    },
  },
  plugins: [],
};

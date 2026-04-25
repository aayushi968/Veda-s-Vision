export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        sage: '#8A9A5B',
        sand: '#E6D9B8',
        clay: '#B18F6A',
        charcoal: '#333333',
        herbal: '#4F6F52',
        neem: '#739072',
        turmeric: '#D8A93A',
        marigold: '#E7B75F',
        ivory: '#F7F1E3',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};

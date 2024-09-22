module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}', // Add your paths here
  ],
  theme: {
    extend: {
      gridTemplateRows: {
        '[auto,auto,1fr]': 'auto auto 1fr',
      },
    },
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'), // Required plugin for the aspect ratio utility
  ],
}

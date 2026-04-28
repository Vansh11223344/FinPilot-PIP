/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        soft: '0 20px 60px rgba(15, 23, 42, 0.35)',
      },
      backgroundImage: {
        'mesh-gradient':
          'radial-gradient(circle at 20% 20%, rgba(91, 33, 182, 0.28), transparent 30%), radial-gradient(circle at 80% 10%, rgba(14, 165, 233, 0.2), transparent 25%), radial-gradient(circle at 50% 90%, rgba(16, 185, 129, 0.16), transparent 25%)',
      },
    },
  },
  plugins: [],
};
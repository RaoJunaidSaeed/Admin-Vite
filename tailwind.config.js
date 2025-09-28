/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}', // Required for CRA to work with Tailwind
  ],
  theme: {
    extend: {
      colors: {
        primary: '#00412E',
        secondary: '#96BF8A',
        background: '#E8EAE5',
        white: '#FFFFFF',
        'brand-dark': '#14532d', // ✅ Added to fix the error
      },
      borderRadius: {
        '2xl': '1rem',
      },
    },
  },
  plugins: [],
};

// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   content: [
//     './src/**/*.{js,jsx,ts,tsx}', // Required for CRA to work with Tailwind
//   ],
//   theme: {
//     extend: {
//       colors: {
//         primary: '#FF3500', // Vibrant highlight
//         secondary: '#3F3826', // Dark olive brown for backgrounds or accents
//         background: '#E7E6C4', // Light cream background
//         black: '#000000', // Deep black
//         white: '#FFFFFF',
//         'brand-dark': '#3F3826', // Optional: reuse as brand-dark
//       },
//       borderRadius: {
//         '2xl': '1rem',
//       },
//     },
//   },
//   plugins: [],
// };

/** @type {import('postcss-load-config').Config} */
// File path: postcss.config.js (Must be in your project root, e.g., Frontend/)
module.exports = {
  plugins: {
    // This explicitly tells PostCSS to run Tailwind and Autoprefixer,
    // ensuring utility classes are generated from your components.
    tailwindcss: {},
    autoprefixer: {},
  },
};
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./public/index.html", // تضمين ملف index.html
    "./src/**/*.{js,jsx,ts,tsx}" // تضمين جميع الملفات داخل src
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
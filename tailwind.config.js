/** @type {import('tailwindcss').Config} */
// tailwind.config.js

module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "",
        secondary: "hsl(38, 54%, 56%)",
        textInput: "hsl(36, 16%, 82%)",
        textBorder: "hsl(210, 13%, 35%)",
      },
    },
  },
  plugins: [],
};

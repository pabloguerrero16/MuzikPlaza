/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        body: ["Poppins"],
      },
    },
    container: {
      padding: "10rem",
    },
  },
  plugins: [],
};

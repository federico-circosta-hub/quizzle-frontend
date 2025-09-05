/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        rotateOnce: {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        shine: {
          "0%": { transform: "translateX(-100%) rotate(12deg)" },
          "100%": { transform: "translateX(100%) rotate(12deg)" },
        },
      },
      animation: {
        "rotate-once": "rotateOnce 1.5s linear",
      },
      animation: {
        shine: "shine 1.75s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

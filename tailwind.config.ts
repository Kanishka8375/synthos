import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        synthos: {
          50: "#f0e7ff",
          100: "#d9bfff",
          200: "#b980ff",
          300: "#9a40ff",
          400: "#8020ff",
          500: "#7C3AED",
          600: "#6D28D9",
          700: "#5b21b6",
          800: "#4c1d95",
          900: "#3b0764",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;

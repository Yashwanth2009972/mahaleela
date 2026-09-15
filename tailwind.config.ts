import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        white: "#000000",
        black: "#000000",
        cream: "#1E1E1E",
        charcoal: "#1E1E1E",
        gold: {
          DEFAULT: "#C9A45C",
          light: "#C9A45C",
          dark: "#C9A45C",
        },
      },
      fontFamily: {
        serif: ["Playfair Display", "Cinzel", "Georgia", "serif"],
        sans: ["Montserrat", "Inter", "-apple-system", "sans-serif"],
      },
      letterSpacing: {
        luxury: "0.25em",
        wide: "0.15em",
        ultra: "0.35em",
      },
      borderColor: {
        DEFAULT: "#C9A45C",
      },
    },
  },
  plugins: [],
};
export default config;

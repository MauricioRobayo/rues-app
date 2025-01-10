import type { Config } from "tailwindcss";
import colors from "tailwindcss/colors";

export default {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: colors.sky[700],
      },
      fontFamily: {
        brand: ["var(--font-montserrat)"],
        sans: ["var(--font-roboto-flex)"],
      },
    },
  },
  plugins: [],
} satisfies Config;

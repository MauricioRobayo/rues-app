import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

export default {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {},
  plugins: [typography],
} satisfies Config;

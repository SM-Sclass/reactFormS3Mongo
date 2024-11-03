import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screen: {
      sm: "340px",
      md: "540px",
      lg: "768px",
      xl: "1180px",
    },
    container: {
      center: true,
      padding: {
        DEFAULT: "12px",
        md: "32px"

      },
    },

    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
export default config;

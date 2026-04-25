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
        background: "var(--bg-primary)",
        secondary: "var(--bg-secondary)",
        accent: {
          purple: "var(--accent-purple)",
          cyan: "var(--accent-cyan)",
          blue: "var(--accent-blue)",
        },
        text: {
          primary: "var(--text-primary)",
          muted: "var(--text-muted)",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "gradient-primary": "var(--gradient-primary)",
      },
      boxShadow: {
        "glow-purple": "var(--glow-purple)",
        "glow-cyan": "var(--glow-cyan)",
      },
      fontFamily: {
        heading: ["var(--font-syne)", "sans-serif"],
        body: ["var(--font-dm-sans)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;

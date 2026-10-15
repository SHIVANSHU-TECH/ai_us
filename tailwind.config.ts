import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#070B12",
        panel: "#0D1420",
        panel2: "#111D2A",
        mint: "#67DDB5",
        cyanx: "#7DDCF5",
        soft: "#EAF1F8",
        mute: "#9BAABD",
        line: "#243342",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Segoe UI", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        mint: "0 0 0 1px rgba(103,221,181,0.22), 0 0 28px rgba(103,221,181,0.12)",
      },
    },
  },
  plugins: [],
} satisfies Config;

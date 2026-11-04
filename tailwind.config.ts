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
        "space-black": "#02050e",
        "card-bg": "rgba(8, 14, 32, 0.75)",
        "accent-blue": "#7dd3fc",
        "cyan-glow": "#38bdf8",
        "deep-nebula": "#1e3a8a",
      },
      fontFamily: {
        serif: ["var(--font-cinzel)", "serif"],
        sans: ["var(--font-poppins)", "sans-serif"],
      },
      animation: {
        "spin-slow": "spin 8s linear infinite",
        "pulse-glow": "pulseGlow 2.5s ease-in-out infinite",
        "nebula-breath": "nebulaBreath 14s ease-in-out infinite alternate",
      },
      keyframes: {
        pulseGlow: {
          "0%, 100%": { opacity: "0.8", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.15)" },
        },
        nebulaBreath: {
          "0%": { opacity: "0.7", transform: "scale(1)" },
          "100%": { opacity: "1", transform: "scale(1.06)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
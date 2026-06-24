/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./context/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#1C1916",
          50: "#F4F2F0",
          100: "#E7E2DC",
          200: "#C7BFB5",
          300: "#9C9186",
          400: "#6B6258",
          500: "#463F38",
          600: "#322C27",
          700: "#241F1B",
          800: "#1C1916",
          900: "#121009",
        },
        paper: {
          DEFAULT: "#F7F1E3",
          dim: "#EEE5D0",
        },
        flame: {
          DEFAULT: "#FF5722",
          dark: "#D8431A",
          light: "#FFE0D3",
        },
        sage: {
          DEFAULT: "#4F7A52",
          dark: "#3A5C3D",
          light: "#DEEADF",
        },
        brass: {
          DEFAULT: "#B8862E",
          dark: "#8F6822",
          light: "#F3E3C2",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Arial Black", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        ticket: "0 1px 0 rgba(28,25,22,0.05), 0 8px 24px -8px rgba(28,25,22,0.25)",
      },
      backgroundImage: {
        perf:
          "radial-gradient(circle, #1C1916 2.5px, transparent 2.6px)",
      },
    },
  },
  plugins: [],
};

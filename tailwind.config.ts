import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        navy: '#1B2A4A',
        'navy-dark': '#0D1B35',
        teal: '#2B8A9C',
        'teal-dark': '#1E6B7A',
        cyan: '#29B6D8',
        'cyan-bright': '#00D4FF',
        orange: '#F4891F',
      },
      fontFamily: {
        playfair: ['var(--font-playfair)', 'serif'],
        inter: ['var(--font-inter)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;

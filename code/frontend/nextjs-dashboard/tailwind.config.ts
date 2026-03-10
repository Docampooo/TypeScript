import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
        '13': 'repeat(13, minmax(0, 1fr))',
      },
      colors: {

        // ── Colores originales ────────────────────────────────
        blue: {
          400: '#2589FE',
          500: '#0070F3',
          600: '#2F6FEB',
          700: '#1e3a8a',
        },

        // ── Paleta MUI (proyecto principal) ──────────────────
        primary: {
          light:   '#3b82f6',
          DEFAULT: '#1e40af',
          dark:    '#1e3a8a',
        },
        secondary: {
          DEFAULT: '#10b981',
        },

        // ── Paleta Algas ──────────────────────────────────────
        algae: {
          50:  '#f0fdf4',  // verde muy claro, casi blanco
          100: '#dcfce7',  // verde menta suave
          200: '#bbf7d0',  // verde agua claro
          300: '#86efac',  // verde alga brillante
          400: '#4ade80',  // verde medio vibrante
          500: '#22c55e',  // verde base
          600: '#16a34a',  // verde oscuro
          700: '#15803d',  // verde bosque
          900: '#14532d',  // verde muy oscuro para fondos
        },

        // ── Paleta Agua ───────────────────────────────────────
        water: {
          100: '#cffafe',  // cian muy claro
          300: '#67e8f9',  // cian agua
          500: '#06b6d4',  // cian medio
          700: '#0e7490',  // cian oscuro
        },

      },
    },
    keyframes: {
      shimmer: {
        '100%': {
          transform: 'translateX(100%)',
        },
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};

export default config;
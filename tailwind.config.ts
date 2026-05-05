import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      animation: {
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'flicker': 'flicker 0.05s infinite alternate',
        'blink-slow': 'blink-slow 1.5s step-end infinite',
      },
    },
  },
  plugins: [],
}

export default config

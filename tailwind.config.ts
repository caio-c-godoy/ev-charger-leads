// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#eaf4ff',
          100: '#d4eaff',
          200: '#a9d6ff',
          300: '#7ec2ff',
          400: '#52adff',
          500: '#208ff7',   // primário (CTA)
          600: '#1674cf',
          700: '#115aa3',
          800: '#0d4279',
          900: '#0a2e4a'    // azul profundo
        },
        accent: {
          400: '#f7d774',
          500: '#f2c94c',   // dourado do logo
          600: '#e9b949'
        }
      },
      boxShadow: {
        brand: '0 10px 30px rgba(32,143,247,.25)',
      }
    }
  },
  plugins: []
}
export default config

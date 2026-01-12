import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import defaultTheme from 'tailwindcss/defaultTheme'


// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
  tailwindcss()],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", ...defaultTheme.fontFamily.sans],
      },
    },
  },
})

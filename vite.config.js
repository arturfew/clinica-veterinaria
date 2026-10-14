import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // tailwindcss(): o HeroUI v3 é construído sobre o Tailwind CSS v4.
  plugins: [react(), tailwindcss()],
})

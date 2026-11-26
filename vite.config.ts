import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // Plugin tailwindcss() membuat kelas utilitas Tailwind v4 bisa dipakai di JSX
  plugins: [react(), tailwindcss()],
})

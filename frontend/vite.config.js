import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // Dev: same-origin calls, no CORS headaches.
      '/api': 'http://localhost:8080',
      '/portfolio': 'http://localhost:8080',
    },
  },
})

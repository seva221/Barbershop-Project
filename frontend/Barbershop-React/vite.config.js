import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: { // allows access from local calls, fetch(http://localhost:4000/api/...) -> fetch("/api/...")
      '/api': {
        target: 'http://localhost:5000', // backend URL
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
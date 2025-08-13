import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'

// Export Vite configuration
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // Enables Tailwind build integration
  ],
  resolve: {
    alias: {
      // Enables writing imports like "@/component/Button/Button"
      '@': fileURLToPath(new URL('./src', import.meta.url)),

      // Keep "src/..." style
      src: fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 5173,
    open: true,
    // Proxy API calls to Spring Boot backend to avoid CORS in dev
    proxy: {
      '/api': 'http://localhost:8080',
      '/actuator': 'http://localhost:8080',
    },
  },
})
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Vite's config entry. "plug in" React support and Tailwind's Vite plugin.
// The server block configures the dev server (port and auto-open).
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,   // default vite port; backend allows CORS from here
    open: true,   // auto-open browser when dev server starts
  },
})
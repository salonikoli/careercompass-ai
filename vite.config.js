import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Base path for GitHub Pages deployment
  base: '/careercompass-ai/',
  build: {
    outDir: 'dist',
    sourcemap: false,
    // Chunk splitting for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
        },
      },
    },
  },
  server: {
    proxy: {
      // Forward /api/* requests to the FastAPI backend in LOCAL DEV only.
      // In production (GitHub Pages), VITE_API_URL points directly to the
      // deployed Render backend — no proxy needed.
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // React core
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // Sanity CMS
          'sanity': ['@sanity/client', '@sanity/image-url', '@portabletext/react'],
          // UI & Animations
          'ui': ['framer-motion', 'lucide-react'],
          // Carousel
          'carousel': ['embla-carousel-react'],
        }
      }
    }
  },
  server: {
    proxy: {
      '/api/football': {
        target: 'https://api.football-data.org',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/football/, '/v4'),
        headers: {
          'X-Auth-Token': '003a99a4b9fe4d8cb814b314077aeaff'
        }
      }
    }
  }
})
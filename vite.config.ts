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
      '^/api/football/.*': {
        target: 'https://v3.football.api-sports.io',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/football/, ''),
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq, req) => {
            proxyReq.setHeader('x-apisports-key', 'baddb54e402c0dcdc8d1bae4ebec5474');
            console.log('[Proxy]', req.url, '->', proxyReq.path);
          });
          proxy.on('proxyRes', (proxyRes, req) => {
            console.log('[Proxy Response]', req.url, proxyRes.statusCode);
          });
        }
      }
    }
  }
})
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
            proxyReq.setHeader('x-apisports-key', 'da33787ca20dc37d8986e538ef30f941');
            console.log('[Proxy Football]', req.url, '->', proxyReq.path);
          });
          proxy.on('proxyRes', (proxyRes, req) => {
            console.log('[Proxy Football Response]', req.url, proxyRes.statusCode);
          });
        }
      },
      // Proxy pour les cotes - redirige vers la production Vercel
      '/api/odds': {
        target: 'https://octogoalmedia.vercel.app',
        changeOrigin: true,
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq, req) => {
            console.log('[Proxy Odds]', req.url);
          });
          proxy.on('proxyRes', (proxyRes, req) => {
            console.log('[Proxy Odds Response]', req.url, proxyRes.statusCode);
          });
        }
      }
    }
  }
})
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Charger les variables d'environnement
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom', 'react-router-dom'],
            'sanity': ['@sanity/client', '@sanity/image-url', '@portabletext/react'],
            'ui': ['framer-motion', 'lucide-react'],
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
            proxy.on('proxyReq', (proxyReq) => {
              // Utiliser la variable d'environnement
              const apiKey = env.VITE_API_FOOTBALL_KEY || ''
              proxyReq.setHeader('x-apisports-key', apiKey)
            })
          }
        },
        '/api/odds': {
          target: 'https://octogoalmedia.vercel.app',
          changeOrigin: true,
        }
      }
    }
  }
})
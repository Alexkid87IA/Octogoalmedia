import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
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
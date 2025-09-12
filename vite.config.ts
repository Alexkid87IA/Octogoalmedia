// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import Pages from 'vite-plugin-pages';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    Pages({
      dirs: 'src/pages',
      extensions: ['tsx', 'ts'],
    }),
  ],
  
  optimizeDeps: {
    exclude: ['lucide-react'],
    include: ['react-helmet-async'],
  },
  
  build: {
    rollupOptions: {
      external: [],
    },
  },
  
  // SSG options (pour vite-ssg)
  ssr: {
    noExternal: ['react-helmet-async'],
  },
});
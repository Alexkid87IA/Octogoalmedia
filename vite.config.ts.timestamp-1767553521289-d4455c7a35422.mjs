// vite.config.ts
import { defineConfig } from "file:///Users/alexquilghini1/Desktop/Octogoalmedia/node_modules/vite/dist/node/index.js";
import react from "file:///Users/alexquilghini1/Desktop/Octogoalmedia/node_modules/@vitejs/plugin-react/dist/index.js";
import Pages from "file:///Users/alexquilghini1/Desktop/Octogoalmedia/node_modules/vite-plugin-pages/dist/index.js";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    Pages({
      dirs: "src/pages",
      extensions: ["tsx", "ts"]
    })
  ],
  optimizeDeps: {
    exclude: ["lucide-react"],
    include: ["react-helmet-async"]
  },
  build: {
    rollupOptions: {
      external: []
    }
  },
  // SSG options (pour vite-ssg)
  ssr: {
    noExternal: ["react-helmet-async"]
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvYWxleHF1aWxnaGluaTEvRGVza3RvcC9PY3RvZ29hbG1lZGlhXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvYWxleHF1aWxnaGluaTEvRGVza3RvcC9PY3RvZ29hbG1lZGlhL3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9hbGV4cXVpbGdoaW5pMS9EZXNrdG9wL09jdG9nb2FsbWVkaWEvdml0ZS5jb25maWcudHNcIjsvLyB2aXRlLmNvbmZpZy50c1xuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XG5pbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3QnO1xuaW1wb3J0IFBhZ2VzIGZyb20gJ3ZpdGUtcGx1Z2luLXBhZ2VzJztcblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFtcbiAgICByZWFjdCgpLFxuICAgIFBhZ2VzKHtcbiAgICAgIGRpcnM6ICdzcmMvcGFnZXMnLFxuICAgICAgZXh0ZW5zaW9uczogWyd0c3gnLCAndHMnXSxcbiAgICB9KSxcbiAgXSxcbiAgXG4gIG9wdGltaXplRGVwczoge1xuICAgIGV4Y2x1ZGU6IFsnbHVjaWRlLXJlYWN0J10sXG4gICAgaW5jbHVkZTogWydyZWFjdC1oZWxtZXQtYXN5bmMnXSxcbiAgfSxcbiAgXG4gIGJ1aWxkOiB7XG4gICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgZXh0ZXJuYWw6IFtdLFxuICAgIH0sXG4gIH0sXG4gIFxuICAvLyBTU0cgb3B0aW9ucyAocG91ciB2aXRlLXNzZylcbiAgc3NyOiB7XG4gICAgbm9FeHRlcm5hbDogWydyZWFjdC1oZWxtZXQtYXN5bmMnXSxcbiAgfSxcbn0pOyJdLAogICJtYXBwaW5ncyI6ICI7QUFDQSxTQUFTLG9CQUFvQjtBQUM3QixPQUFPLFdBQVc7QUFDbEIsT0FBTyxXQUFXO0FBR2xCLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVM7QUFBQSxJQUNQLE1BQU07QUFBQSxJQUNOLE1BQU07QUFBQSxNQUNKLE1BQU07QUFBQSxNQUNOLFlBQVksQ0FBQyxPQUFPLElBQUk7QUFBQSxJQUMxQixDQUFDO0FBQUEsRUFDSDtBQUFBLEVBRUEsY0FBYztBQUFBLElBQ1osU0FBUyxDQUFDLGNBQWM7QUFBQSxJQUN4QixTQUFTLENBQUMsb0JBQW9CO0FBQUEsRUFDaEM7QUFBQSxFQUVBLE9BQU87QUFBQSxJQUNMLGVBQWU7QUFBQSxNQUNiLFVBQVUsQ0FBQztBQUFBLElBQ2I7QUFBQSxFQUNGO0FBQUE7QUFBQSxFQUdBLEtBQUs7QUFBQSxJQUNILFlBQVksQ0FBQyxvQkFBb0I7QUFBQSxFQUNuQztBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==

// src/main-ssg.tsx
import { ViteSSG } from 'vite-ssg';
import App from './App';
import { getAllRoutes } from './routes';

// Export pour vite-ssg
export const createApp = ViteSSG(
  App,
  { 
    base: '/',
  },
  async ({ app, router, routes, isClient, initialState }) => {
    // Configuration supplémentaire si nécessaire
    if (import.meta.env.SSG) {
      // On est en mode génération statique
      const allRoutes = await getAllRoutes();
      
      // Ajouter les routes dynamiques
      allRoutes.forEach(route => {
        if (!routes.some(r => r.path === route)) {
          router.addRoute({
            path: route,
            component: () => import('./App'), // Utilise App pour toutes les routes
          });
        }
      });
    }
  }
);
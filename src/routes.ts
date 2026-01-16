// src/routes.ts
// Liste des routes pour la génération statique

export const staticRoutes = [
  // Pages principales
  '/',
  '/about',
  '/coaching',
  '/club',
  
  // Guides
  '/guides',
  '/guides/digital-detox',
  
  // Articles & Business
  '/articles',
  '/business-ideas',
  '/success-stories',
  
  // Émissions & Podcasts
  '/emissions',
  '/emission',
  '/podcast',
  
  // Autres
  '/recommendations',
  '/create-with-roger',
  '/test',
];

// Fonction pour récupérer les articles depuis Sanity
export async function getArticleRoutes() {
  try {
    const { sanityClient } = await import('./utils/sanityClient');
    
    const articles = await sanityClient.fetch(`
      *[_type == "article" && !(_id in path("drafts.**"))]{
        "slug": slug.current
      }
    `);
    
    return (articles as Array<{ slug?: string }>)
      .filter((article) => article.slug)
      .map((article) => `/article/${article.slug}`);
      
  } catch (error) {
    console.error('Erreur récupération articles:', error);
    return [];
  }
}

// Export toutes les routes
export async function getAllRoutes() {
  const articleRoutes = await getArticleRoutes();
  return [...staticRoutes, ...articleRoutes];
}
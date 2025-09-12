// netlify/edge-functions/meta-tags.js

export default async (request, context) => {
  // Récupérer la réponse originale
  const response = await context.next();
  
  // Vérifier si c'est un bot de réseau social
  const userAgent = request.headers.get('user-agent') || '';
  const isBot = /facebookexternalhit|linkedinbot|twitterbot|whatsapp|telegram|slackbot|discord/i.test(userAgent);
  
  // Si ce n'est pas un bot ou pas une page HTML, on ne modifie rien
  const contentType = response.headers.get('content-type') || '';
  if (!isBot || !contentType.includes('text/html')) {
    return response;
  }
  
  // Récupérer l'URL demandée
  const url = new URL(request.url);
  const path = url.pathname;
  
  // Définir les meta tags selon la page
  let metaTags = getMetaTagsForPath(path);
  
  // Si c'est un article ou guide dynamique, récupérer depuis Sanity
  if (path.startsWith('/article/') || path.startsWith('/guides/')) {
    metaTags = await fetchDynamicMetaTags(path);
  }
  
  // Récupérer le HTML original
  const html = await response.text();
  
  // Remplacer les meta tags
  const modifiedHtml = injectMetaTags(html, metaTags);
  
  // Retourner la réponse modifiée
  return new Response(modifiedHtml, {
    status: response.status,
    headers: response.headers
  });
};

// Configuration des routes
export const config = {
  path: "/*"
};

// Fonction pour obtenir les meta tags selon le chemin
function getMetaTagsForPath(path) {
  const routes = {
    '/': {
      title: 'High Value Media - Coaching & Stratégie Digitale',
      description: 'Développez votre potentiel avec High Value Media. Coaching personnalisé et stratégies digitales.',
      image: 'https://highvalue.media/LOGO_HV_MEDIA.svg'
    },
    '/guides': {
      title: 'Guides Pratiques - High Value Media',
      description: 'Découvrez nos guides pour maîtriser le digital et développer votre business.',
      image: 'https://highvalue.media/LOGO_HV_MEDIA.svg'
    },
    '/guides/maitrise-digitale': {
      title: 'Guide : Maîtrise Digitale Complète - High Value Media',
      description: 'Apprenez à maîtriser tous les aspects du digital pour votre business.',
      image: 'https://highvalue.media/LOGO_HV_MEDIA.svg'
    },
    '/articles': {
      title: 'Articles & Insights - High Value Media',
      description: 'Articles, analyses et conseils pour entrepreneurs ambitieux.',
      image: 'https://highvalue.media/LOGO_HV_MEDIA.svg'
    },
    '/coaching': {
      title: 'Coaching Personnalisé - High Value Media',
      description: 'Séances de coaching one-on-one avec Roger pour transformer votre business.',
      image: 'https://highvalue.media/LOGO_HV_MEDIA.svg'
    },
    '/club': {
      title: 'Le Club High Value - Accès Exclusif',
      description: 'Rejoignez une communauté exclusive d\'entrepreneurs ambitieux.',
      image: 'https://highvalue.media/LOGO_HV_MEDIA.svg'
    }
  };
  
  // Retourner les meta tags de la route ou ceux par défaut
  return routes[path] || routes['/'];
}

// Fonction pour récupérer les meta tags dynamiques depuis Sanity
async function fetchDynamicMetaTags(path) {
  try {
    // Extraire le slug
    const slug = path.split('/').pop();
    
    // Déterminer le type de contenu
    const isArticle = path.startsWith('/article/');
    const contentType = isArticle ? 'article' : 'guide';
    
    // Appel à l'API Sanity
    const projectId = 'z9wsynas';
    const dataset = 'production';
    const query = `*[_type == "${contentType}" && slug.current == "${slug}"][0]{
      title,
      "description": coalesce(excerpt, description, ""),
      "image": mainImage.asset->url
    }`;
    
    const encodedQuery = encodeURIComponent(query);
    const sanityUrl = `https://${projectId}.api.sanity.io/v2024-05-13/data/query/${dataset}?query=${encodedQuery}`;
    
    const response = await fetch(sanityUrl);
    const data = await response.json();
    
    if (data.result) {
      return {
        title: `${data.result.title} - High Value Media`,
        description: data.result.description || `Découvrez ${data.result.title} sur High Value Media`,
        image: data.result.image || 'https://highvalue.media/LOGO_HV_MEDIA.svg'
      };
    }
  } catch (error) {
    console.error('Erreur récupération Sanity:', error);
  }
  
  // Fallback si erreur
  return getMetaTagsForPath('/');
}

// Fonction pour injecter les meta tags dans le HTML
function injectMetaTags(html, metaTags) {
  // Remplacer le title
  html = html.replace(
    /<title>.*?<\/title>/,
    `<title>${metaTags.title}</title>`
  );
  
  // Préparer les nouvelles balises meta
  const newMetaTags = `
    <!-- Meta tags dynamiques -->
    <meta name="description" content="${metaTags.description}">
    <meta property="og:title" content="${metaTags.title}">
    <meta property="og:description" content="${metaTags.description}">
    <meta property="og:image" content="${metaTags.image}">
    <meta property="og:url" content="https://highvalue.media${metaTags.path || ''}">
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="High Value Media">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${metaTags.title}">
    <meta name="twitter:description" content="${metaTags.description}">
    <meta name="twitter:image" content="${metaTags.image}">
  `;
  
  // Injecter juste après <head>
  html = html.replace('<head>', `<head>${newMetaTags}`);
  
  return html;
}
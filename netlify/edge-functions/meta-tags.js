// netlify/edge-functions/meta-tags.js
// Edge Function pour Netlify (Deno runtime)

// Configuration Sanity
const SANITY_PROJECT_ID = 'fns9m6wr';
const SANITY_DATASET = 'production';
const SANITY_API_VERSION = '2024-01-01';

// Fonction pour récupérer les données d'un article depuis Sanity
async function fetchArticleFromSanity(slug) {
  try {
    const query = encodeURIComponent(`
      *[_type == "post" && slug.current == "${slug}"][0]{
        title,
        excerpt,
        description,
        mainImage {
          asset-> {
            url
          }
        },
        publishedAt,
        author-> {
          name
        }
      }
    `);
    
    const url = `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data/query/${SANITY_DATASET}?query=${query}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    return data.result;
  } catch (error) {
    console.error('Erreur Sanity:', error);
    return null;
  }
}

export default async (request, context) => {
  const url = new URL(request.url);
  const userAgent = request.headers.get('user-agent') || '';
  
  // Liste des bots de réseaux sociaux
  const socialBots = [
    'facebookexternalhit',
    'facebookcatalog',
    'linkedinbot',
    'whatsapp',
    'twitterbot',
    'slackbot',
    'discordbot',
    'telegrambot',
    'pinterest'
  ];
  
  // Vérifier si c'est un bot social
  const isSocialBot = socialBots.some(bot => 
    userAgent.toLowerCase().includes(bot)
  );
  
  // Si ce n'est pas un bot ET pas une page HTML, continuer normalement
  const response = await context.next();
  const contentType = response.headers.get('content-type') || '';
  
  if (!contentType.includes('text/html')) {
    return response;
  }
  
  // Pour les bots sociaux, on force les meta tags
  if (!isSocialBot) {
    return response;
  }
  
  const path = url.pathname;
  
  // Déterminer les meta tags selon la page
  let title = 'High Value Media - Coaching & Stratégie Digitale';
  let description = 'Développez votre potentiel avec High Value Media. Coaching personnalisé et stratégies digitales.';
  let image = 'https://highvalue.media/LOGO_HV_MEDIA.svg';
  
  // Pages spécifiques
  if (path === '/guides/maitrise-digitale' || path === '/guides/maitrise-digitale/') {
    title = 'Guide Maîtrise Digitale Complète - High Value Media';
    description = 'Découvrez comment reprendre le contrôle de votre vie numérique avec notre guide complet sur la maîtrise digitale.';
    image = 'https://26.staticbtf.eno.do/v1/57-default/3f8dd22f1c8fc2e00a6a725e2b8e2793/media.jpg';
  } else if (path === '/guides' || path === '/guides/') {
    title = 'Guides Pratiques - High Value Media';
    description = 'Découvrez nos guides pour maîtriser le digital et développer votre business.';
  } else if (path === '/articles' || path === '/articles/') {
    title = 'Articles & Insights - High Value Media';
    description = 'Articles, analyses et conseils pour entrepreneurs ambitieux.';
  } else if (path === '/coaching' || path === '/coaching/') {
    title = 'Coaching Personnalisé - High Value Media';
    description = 'Séances de coaching one-on-one avec Roger pour transformer votre business.';
  } else if (path === '/club' || path === '/club/') {
    title = 'Le Club High Value - Accès Exclusif';
    description = 'Rejoignez une communauté exclusive d\'entrepreneurs ambitieux.';
  }
  
  // Pour les articles dynamiques - RÉCUPÉRER DEPUIS SANITY
  if (path.startsWith('/article/')) {
    const slug = path.replace('/article/', '').replace('/', '');
    
    // Essayer de récupérer les données depuis Sanity
    const article = await fetchArticleFromSanity(slug);
    
    if (article) {
      title = `${article.title} - High Value Media`;
      description = article.excerpt || article.description || `Lisez notre article sur ${article.title}`;
      
      // Utiliser l'image de l'article si disponible
      if (article.mainImage?.asset?.url) {
        image = article.mainImage.asset.url;
        // Ajouter les paramètres d'optimisation Sanity si ce n'est pas déjà fait
        if (!image.includes('?')) {
          image += '?w=1200&h=630&fit=crop&auto=format';
        }
      }
    } else {
      // Fallback si l'article n'est pas trouvé
      const formattedSlug = slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      title = `${formattedSlug} - High Value Media`;
      description = `Lisez notre article sur ${formattedSlug.toLowerCase()} et découvrez nos insights exclusifs.`;
    }
  }
  
  // Pour les émissions
  if (path.startsWith('/emission/')) {
    const slug = path.replace('/emission/', '').replace('/', '');
    const formattedSlug = slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    title = `Émission : ${formattedSlug} - High Value Media`;
    description = `Regardez notre émission ${formattedSlug.toLowerCase()} avec des invités exclusifs.`;
  }
  
  // Récupérer le HTML
  const html = await response.text();
  
  // IMPORTANT: Nettoyer TOUS les meta tags existants avant d'ajouter les nouveaux
  let modifiedHtml = html;
  
  // Remplacer le title existant
  modifiedHtml = modifiedHtml.replace(
    /<title>.*?<\/title>/gi,
    `<title>${title}</title>`
  );
  
  // Si pas de title, l'ajouter
  if (!modifiedHtml.includes('<title>')) {
    modifiedHtml = modifiedHtml.replace(
      '</head>',
      `<title>${title}</title></head>`
    );
  }
  
  // Fonction pour remplacer ou ajouter un meta tag
  function updateMetaTag(html, attribute, value, content) {
    const regex = new RegExp(`<meta\\s+${attribute}="${value}"[^>]*>`, 'gi');
    const newTag = `<meta ${attribute}="${value}" content="${content}">`;
    
    if (regex.test(html)) {
      return html.replace(regex, newTag);
    } else {
      return html.replace('</head>', `${newTag}\n</head>`);
    }
  }
  
  // Mettre à jour tous les meta tags
  modifiedHtml = updateMetaTag(modifiedHtml, 'name', 'description', description);
  modifiedHtml = updateMetaTag(modifiedHtml, 'property', 'og:title', title);
  modifiedHtml = updateMetaTag(modifiedHtml, 'property', 'og:description', description);
  modifiedHtml = updateMetaTag(modifiedHtml, 'property', 'og:url', url.href);
  modifiedHtml = updateMetaTag(modifiedHtml, 'property', 'og:type', path.startsWith('/article/') ? 'article' : 'website');
  modifiedHtml = updateMetaTag(modifiedHtml, 'property', 'og:site_name', 'High Value Media');
  modifiedHtml = updateMetaTag(modifiedHtml, 'property', 'og:image', image);
  modifiedHtml = updateMetaTag(modifiedHtml, 'property', 'og:image:width', '1200');
  modifiedHtml = updateMetaTag(modifiedHtml, 'property', 'og:image:height', '630');
  modifiedHtml = updateMetaTag(modifiedHtml, 'property', 'og:locale', 'fr_FR');
  modifiedHtml = updateMetaTag(modifiedHtml, 'name', 'twitter:card', 'summary_large_image');
  modifiedHtml = updateMetaTag(modifiedHtml, 'name', 'twitter:title', title);
  modifiedHtml = updateMetaTag(modifiedHtml, 'name', 'twitter:description', description);
  modifiedHtml = updateMetaTag(modifiedHtml, 'name', 'twitter:image', image);
  
  // Ajouter le tag LinkedIn spécifique
  modifiedHtml = updateMetaTag(modifiedHtml, 'property', 'og:image:alt', title);
  
  // Retourner la réponse modifiée avec headers appropriés
  return new Response(modifiedHtml, {
    status: response.status,
    headers: {
      ...response.headers,
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'no-cache, no-store, must-revalidate',
      'x-robots-tag': 'all'
    }
  });
};

export const config = {
  path: "/*"
};
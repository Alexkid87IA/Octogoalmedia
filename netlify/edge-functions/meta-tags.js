// netlify/edge-functions/meta-tags.js
// Edge Function pour Netlify (Deno runtime)

// Configuration Sanity
const SANITY_PROJECT_ID = 'z9wsynas'; // Corrigé avec le bon project ID
const SANITY_DATASET = 'production';
const SANITY_API_VERSION = '2024-01-01';

// Fonction pour récupérer les données d'un article depuis Sanity
async function fetchArticleFromSanity(slug) {
  try {
    // Requête pour récupérer l'article avec tous les champs possibles
    const query = encodeURIComponent(`
      *[_type == "Article" && slug.current == "${slug}"][0]{
        title,
        excerpt,
        description,
        summary,
        "imageUrl": mainImage.asset->url,
        "imageDirect": mainImage.asset.url,
        "imageRef": mainImage.asset._ref,
        mainImage,
        image,
        coverImage,
        featuredImage,
        publishedAt,
        author-> {
          name
        },
        categories[]-> {
          title
        }
      }
    `);
    
    const url = `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data/query/${SANITY_DATASET}?query=${query}`;
    const response = await fetch(url);
    const data = await response.json();
    
    console.log(`Article trouvé pour ${slug}:`, data.result ? 'Oui' : 'Non');
    if (data.result) {
      console.log('Données image de l\'article:', {
        imageUrl: data.result.imageUrl,
        imageDirect: data.result.imageDirect,
        imageRef: data.result.imageRef,
        mainImage: data.result.mainImage,
        image: data.result.image
      });
    }
    return data.result;
  } catch (error) {
    console.error('Erreur Sanity:', error);
    return null;
  }
}

export default async (request, context) => {
  const url = new URL(request.url);
  const userAgent = request.headers.get('user-agent') || '';
  
  // Log pour debug
  console.log('User-Agent reçu:', userAgent);
  console.log('URL demandée:', url.pathname);
  
  // Liste des bots de réseaux sociaux
  const socialBots = [
    'facebookexternalhit',
    'facebookcatalog',
    'linkedinbot',
    'linkedin',
    'whatsapp',
    'twitterbot',
    'slackbot',
    'discordbot',
    'telegrambot',
    'pinterest',
    'skypeuripreview',
    'outbrain',
    'vkshare'
  ];
  
  // Vérifier si c'est un bot social
  const isSocialBot = socialBots.some(bot => 
    userAgent.toLowerCase().includes(bot)
  );
  
  console.log('Est un bot social?', isSocialBot);
  
  // Récupérer la réponse originale
  const response = await context.next();
  const contentType = response.headers.get('content-type') || '';
  
  // Si ce n'est pas du HTML, on ne modifie rien
  if (!contentType.includes('text/html')) {
    return response;
  }
  
  // Si ce n'est pas un bot social, on ne modifie rien
  if (!isSocialBot) {
    return response;
  }
  
  const path = url.pathname;
  
  // Déterminer les meta tags selon la page
  let title = 'High Value Media - Coaching & Stratégie Digitale';
  let description = 'Développez votre potentiel avec High Value Media. Coaching personnalisé et stratégies digitales.';
  let image = 'https://highvalue.media/LOGO_HV_MEDIA.svg';
  
  // Pages spécifiques statiques
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
    
    if (article && article.title) {
      // Utiliser les vraies données de Sanity
      title = `${article.title} - High Value Media`;
      
      // Chercher la description dans plusieurs champs possibles
      description = article.excerpt || 
                   article.description || 
                   article.summary ||
                   'Découvrez cet article exclusif sur High Value Media. Insights et stratégies pour développer votre potentiel.';
      
      // Nettoyer la description (enlever les balises HTML/Markdown éventuelles)
      description = description.replace(/<[^>]*>/g, '').substring(0, 160);
      
      // Gérer l'image - Essayer toutes les variantes possibles
      let articleImage = null;
      
      // Essayer différents champs d'image
      if (article.imageUrl) {
        articleImage = article.imageUrl;
      } else if (article.mainImage?.asset?.url) {
        articleImage = article.mainImage.asset.url;
      } else if (article.mainImage?.asset?._ref) {
        // Construire l'URL depuis la référence Sanity
        const ref = article.mainImage.asset._ref;
        // Format: image-{id}-{dimensions}-{format}
        const parts = ref.replace('image-', '').split('-');
        const id = parts[0];
        const dimensions = parts[1];
        const format = parts[2];
        articleImage = `https://cdn.sanity.io/images/${SANITY_PROJECT_ID}/${SANITY_DATASET}/${id}-${dimensions}.${format}`;
      }
      
      if (articleImage) {
        image = articleImage;
        // Ajouter les paramètres d'optimisation Sanity seulement si c'est une URL Sanity
        if (image.includes('cdn.sanity.io') && !image.includes('?')) {
          image += '?w=1200&h=630&fit=crop&auto=format';
        }
      } else {
        // Image par défaut si aucune image trouvée
        image = 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1200&h=630&fit=crop&q=80';
      }
      
      console.log(`Image finale pour ${slug}: ${image}`);
      
    } else {
      // Fallback si l'article n'est pas trouvé dans Sanity
      // Base de données locale pour les articles les plus importants
      const articleDatabase = {
        'tiktok-shop': {
          title: 'TikTok Shop : scroll, clique, achète - le e-commerce secoué',
          description: 'En à peine deux ans, l\'onglet Shop de TikTok a transformé un réflexe de swipe en tunnel d\'achat. Découvrez cette révolution du e-commerce.',
          image: 'https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?w=1200&h=630&fit=crop' // Image TikTok pertinente
        },
        'sleep-streaming': {
          title: 'Sleep Streaming : Gagner de l\'Argent en Dormant',
          description: 'Découvrez comment des créateurs gagnent jusqu\'à 15 000$ par mois en dormant devant leur caméra.',
          image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=1200&h=630&fit=crop'
        },
        's-inspirer-des-meilleurs-sans-se-trahir-la-methode': {
          title: 'S\'inspirer des Meilleurs Sans Se Trahir : La Méthode',
          description: 'Comment s\'inspirer des leaders tout en restant authentique. Guide pratique pour entrepreneurs.',
          image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&h=630&fit=crop'
        },
        'luis-soriano': {
          title: 'Luis Soriano : Stratégies et Insights pour Entrepreneurs',
          description: 'Article exclusif sur Luis Soriano. Découvrez ses stratégies pour réussir dans l\'entrepreneuriat moderne.',
          image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=1200&h=630&fit=crop'
        },
        'comment-devenir-riche': {
          title: 'Comment Devenir Riche en 2025 : Guide Complet',
          description: 'Les stratégies éprouvées des millionnaires pour construire sa richesse. Plan d\'action détaillé.',
          image: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=1200&h=630&fit=crop'
        },
        'productivite-extreme': {
          title: 'Productivité Extrême : La Méthode des Top Performers',
          description: 'Les techniques secrètes pour multiplier votre productivité par 10. Résultats garantis.',
          image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=1200&h=630&fit=crop'
        }
      };
      
      if (articleDatabase[slug]) {
        title = `${articleDatabase[slug].title} - High Value Media`;
        description = articleDatabase[slug].description;
        image = articleDatabase[slug].image;
      } else {
        // Fallback générique mais professionnel
        const formattedSlug = slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        title = `${formattedSlug} - High Value Media`;
        description = `Article exclusif : ${formattedSlug}. Stratégies et insights pour entrepreneurs ambitieux.`;
        image = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=630&fit=crop';
      }
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
  modifiedHtml = updateMetaTag(modifiedHtml, 'property', 'og:image:alt', title);
  
  // Twitter Card tags
  modifiedHtml = updateMetaTag(modifiedHtml, 'name', 'twitter:card', 'summary_large_image');
  modifiedHtml = updateMetaTag(modifiedHtml, 'name', 'twitter:title', title);
  modifiedHtml = updateMetaTag(modifiedHtml, 'name', 'twitter:description', description);
  modifiedHtml = updateMetaTag(modifiedHtml, 'name', 'twitter:image', image);
  
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
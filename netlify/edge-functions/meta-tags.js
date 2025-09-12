// netlify/edge-functions/meta-tags.js
// Edge Function pour Netlify (Deno runtime)

// Configuration Sanity - CORRIGÉE
const SANITY_PROJECT_ID = 'z9wsynas';
const SANITY_DATASET = 'production';
const SANITY_API_VERSION = '2024-01-01';

// Fonction pour récupérer les données d'un article depuis Sanity
async function fetchArticleFromSanity(slug) {
  try {
    // Requête corrigée avec "article" en minuscules
    const query = encodeURIComponent(`
      *[_type == "article" && slug.current == "${slug}"][0]{
        title,
        excerpt,
        description,
        summary,
        "imageUrl": mainImage.asset->url,
        "imageRef": mainImage.asset._ref,
        mainImage,
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
    
    console.log(`Fetching article from Sanity: ${url}`);
    
    const response = await fetch(url);
    const data = await response.json();
    
    console.log(`Article trouvé pour ${slug}:`, data.result ? 'Oui' : 'Non');
    
    if (data.result) {
      console.log('Données de l\'article:', {
        title: data.result.title,
        hasImage: !!data.result.imageUrl || !!data.result.imageRef,
        imageUrl: data.result.imageUrl,
        imageRef: data.result.imageRef
      });
    }
    
    return data.result;
  } catch (error) {
    console.error('Erreur Sanity:', error);
    return null;
  }
}

// Fonction pour construire l'URL d'image Sanity depuis une référence
function buildSanityImageUrl(ref) {
  if (!ref) return null;
  
  // Format attendu: image-{id}-{dimensions}-{format}
  const match = ref.match(/^image-([a-f0-9]+)-(\d+x\d+)-(\w+)$/);
  if (!match) {
    console.error('Format de référence image invalide:', ref);
    return null;
  }
  
  const [, id, dimensions, format] = match;
  
  // Convertir HEIF en JPEG pour compatibilité navigateur
  const finalFormat = (format === 'heif' || format === 'heic') ? 'jpg' : format;
  
  // Construire l'URL finale avec paramètres d'optimisation
  const imageUrl = `https://cdn.sanity.io/images/${SANITY_PROJECT_ID}/${SANITY_DATASET}/${id}-${dimensions}.${finalFormat}?w=1200&h=630&fit=crop&auto=format`;
  
  console.log(`Image URL construite: ${imageUrl}`);
  return imageUrl;
}

export default async (request, context) => {
  const url = new URL(request.url);
  const userAgent = request.headers.get('user-agent') || '';
  
  // Log pour debug
  console.log('User-Agent reçu:', userAgent);
  console.log('URL demandée:', url.pathname);
  
  // Liste étendue des bots de réseaux sociaux
  const socialBots = [
    'facebookexternalhit',
    'facebookcatalog',
    'linkedinbot',
    'linkedin',
    'whatsapp',
    'twitterbot',
    'x-bot',           // Nouveau bot Twitter/X
    'slackbot',
    'discordbot',
    'telegrambot',
    'pinterest',
    'skypeuripreview',
    'outbrain',
    'vkshare',
    'redditbot'
  ];
  
  // Vérifier si c'est un bot social (case insensitive)
  const isSocialBot = socialBots.some(bot => 
    userAgent.toLowerCase().includes(bot.toLowerCase())
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
  
  // Valeurs par défaut
  let title = 'High Value Media - Coaching & Stratégie Digitale';
  let description = 'Développez votre potentiel avec High Value Media. Coaching personnalisé et stratégies digitales innovantes.';
  let image = 'https://highvalue.media/LOGO_HV_MEDIA.svg';
  
  // Pages spécifiques statiques
  if (path === '/guides/maitrise-digitale' || path === '/guides/maitrise-digitale/') {
    title = 'Guide : Maîtrise Digitale Complète - High Value Media';
    description = 'Découvrez comment reprendre le contrôle de votre vie numérique avec notre guide complet sur la maîtrise digitale.';
    image = 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=1200&h=630&fit=crop&q=80';
  } else if (path === '/guides' || path === '/guides/') {
    title = 'Guides Pratiques - High Value Media';
    description = 'Découvrez nos guides pour maîtriser le digital et développer votre business en 2025.';
    image = 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1200&h=630&fit=crop&q=80';
  } else if (path === '/articles' || path === '/articles/') {
    title = 'Articles & Insights - High Value Media';
    description = 'Articles, analyses et conseils pour entrepreneurs ambitieux. Stratégies digitales et growth hacking.';
    image = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&h=630&fit=crop&q=80';
  } else if (path === '/coaching' || path === '/coaching/') {
    title = 'Coaching Personnalisé - High Value Media';
    description = 'Séances de coaching one-on-one avec Roger pour transformer votre business et atteindre vos objectifs.';
    image = 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1200&h=630&fit=crop&q=80';
  } else if (path === '/club' || path === '/club/') {
    title = 'Le Club High Value - Accès Exclusif';
    description = 'Rejoignez une communauté exclusive d\'entrepreneurs ambitieux. Networking, masterclasses et opportunités uniques.';
    image = 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=1200&h=630&fit=crop&q=80';
  }
  
  // Pour les articles dynamiques - RÉCUPÉRER DEPUIS SANITY
  if (path.startsWith('/article/')) {
    const slug = path.replace('/article/', '').replace('/', '');
    
    console.log(`Traitement de l'article: ${slug}`);
    
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
      
      // Nettoyer la description (enlever les balises HTML/Markdown)
      description = description
        .replace(/<[^>]*>/g, '')
        .replace(/\n/g, ' ')
        .trim()
        .substring(0, 160);
      
      // Gérer l'image avec toutes les variantes possibles
      let articleImage = null;
      
      // Priorité 1: URL directe
      if (article.imageUrl) {
        articleImage = article.imageUrl;
        console.log('Image trouvée: URL directe', articleImage);
      }
      // Priorité 2: Référence Sanity
      else if (article.imageRef || article.mainImage?.asset?._ref) {
        const ref = article.imageRef || article.mainImage.asset._ref;
        articleImage = buildSanityImageUrl(ref);
        console.log('Image trouvée: référence Sanity', ref);
      }
      // Priorité 3: Asset avec URL
      else if (article.mainImage?.asset?.url) {
        articleImage = article.mainImage.asset.url;
        console.log('Image trouvée: asset URL', articleImage);
      }
      
      // Utiliser l'image trouvée ou une image par défaut
      if (articleImage) {
        image = articleImage;
        // Ajouter les paramètres d'optimisation seulement pour les URLs Sanity sans paramètres
        if (image.includes('cdn.sanity.io') && !image.includes('?')) {
          image += '?w=1200&h=630&fit=crop&auto=format';
        }
      } else {
        // Image par défaut de haute qualité si aucune image trouvée
        console.log('Aucune image trouvée, utilisation de l\'image par défaut');
        image = 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1200&h=630&fit=crop&q=80';
      }
      
      console.log(`Meta tags finaux pour ${slug}:`, { title, description, image });
      
    } else {
      // Fallback si l'article n'est pas trouvé dans Sanity
      console.log(`Article ${slug} non trouvé dans Sanity, utilisation du fallback`);
      
      // Base de données locale pour les articles les plus importants
      const articleDatabase = {
        'tiktok-shop': {
          title: 'TikTok Shop : scroll, clique, achète - le e-commerce secoué',
          description: 'En à peine deux ans, l\'onglet Shop de TikTok a transformé un réflexe de swipe en tunnel d\'achat. Découvrez cette révolution.',
          image: 'https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?w=1200&h=630&fit=crop&q=80'
        },
        'sleep-streaming': {
          title: 'Sleep Streaming : Gagner de l\'Argent en Dormant',
          description: 'Découvrez comment des créateurs gagnent jusqu\'à 15 000$ par mois en dormant devant leur caméra. Le phénomène expliqué.',
          image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=1200&h=630&fit=crop&q=80'
        },
        'fenty-beauty': {
          title: 'Fenty Beauty : comment l\'inclusif a révolutionné la cosmétique',
          description: 'L\'histoire de la marque de Rihanna qui a redéfini les standards de beauté et créé un empire de 2.8 milliards.',
          image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1200&h=630&fit=crop&q=80'
        },
        'chris-nickic': {
          title: 'Chris Nickic : la course d\'un homme au-delà du chromosome et des limites',
          description: 'L\'histoire inspirante de Chris Nickic, premier athlète trisomique à terminer un Ironman. Une leçon de détermination.',
          image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=1200&h=630&fit=crop&q=80'
        },
        'start-up-anti-scale': {
          title: 'Start-up anti-scale : grandir moins pour créer plus',
          description: 'Pourquoi certaines startups choisissent de rester petites pour maximiser impact et innovation. Nouvelle philosophie business.',
          image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=1200&h=630&fit=crop&q=80'
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
        description = `Article exclusif : ${formattedSlug}. Stratégies et insights pour entrepreneurs ambitieux sur High Value Media.`;
        image = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=630&fit=crop&q=80';
      }
    }
  }
  
  // Pour les émissions
  if (path.startsWith('/emission/')) {
    const slug = path.replace('/emission/', '').replace('/', '');
    const formattedSlug = slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    title = `Émission : ${formattedSlug} - High Value Media`;
    description = `Regardez notre émission ${formattedSlug.toLowerCase()} avec des invités exclusifs et des insights uniques.`;
    image = 'https://images.unsplash.com/photo-1598743400863-0201c7e1445b?w=1200&h=630&fit=crop&q=80';
  }
  
  // Récupérer le HTML
  const html = await response.text();
  
  // Modifier le HTML avec les bonnes meta tags
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
      `  <title>${title}</title>\n</head>`
    );
  }
  
  // Fonction helper pour remplacer ou ajouter un meta tag
  function updateMetaTag(html, attribute, value, content) {
    const regex = new RegExp(`<meta\\s+${attribute}="${value}"[^>]*>`, 'gi');
    const newTag = `<meta ${attribute}="${value}" content="${content}">`;
    
    if (regex.test(html)) {
      return html.replace(regex, newTag);
    } else {
      // Ajouter avant la fermeture de head
      return html.replace('</head>', `  ${newTag}\n</head>`);
    }
  }
  
  // Mettre à jour tous les meta tags essentiels
  
  // Meta tags standards
  modifiedHtml = updateMetaTag(modifiedHtml, 'name', 'description', description);
  
  // Open Graph (Facebook)
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
  
  // Tags supplémentaires pour LinkedIn
  modifiedHtml = updateMetaTag(modifiedHtml, 'property', 'og:image:secure_url', image);
  
  // Twitter/X Card tags
  modifiedHtml = updateMetaTag(modifiedHtml, 'name', 'twitter:card', 'summary_large_image');
  modifiedHtml = updateMetaTag(modifiedHtml, 'name', 'twitter:title', title);
  modifiedHtml = updateMetaTag(modifiedHtml, 'name', 'twitter:description', description);
  modifiedHtml = updateMetaTag(modifiedHtml, 'name', 'twitter:image', image);
  modifiedHtml = updateMetaTag(modifiedHtml, 'name', 'twitter:image:alt', title);
  
  // Tags LinkedIn spécifiques
  modifiedHtml = updateMetaTag(modifiedHtml, 'name', 'author', 'Roger - High Value Media');
  
  // Retourner la réponse modifiée avec headers optimisés
  return new Response(modifiedHtml, {
    status: response.status,
    headers: {
      ...response.headers,
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'no-cache, no-store, must-revalidate',
      'x-robots-tag': 'all',
      'x-generated-by': 'netlify-edge-function'
    }
  });
};

// Configuration de l'Edge Function
export const config = {
  path: "/*"
};
import { sanityClient, previewClient } from './sanityClient';
import { SanityArticle, SanityDebate, SanityPodcast, SanityCaseStudy, SanitySuccessStory, SanityUniverse, SanityClubFeature, SanityClubPricing, SanityQuote, SanityVSPoll } from '../types/sanity';

// Cache pour les requêtes fréquentes
const cache: Record<string, { data: any; timestamp: number }> = {};
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes en millisecondes

/**
 * Fonction utilitaire pour récupérer des données avec cache
 * @param cacheKey Clé de cache unique
 * @param fetchFunction Fonction asynchrone qui récupère les données
 * @returns Les données, soit depuis le cache soit depuis la fonction de récupération
 */
async function getWithCache<T>(cacheKey: string, fetchFunction: () => Promise<T>): Promise<T> {
  const now = Date.now();
  const cachedItem = cache[cacheKey];
  
  // Si les données sont en cache et pas expirées, les retourner
  if (cachedItem && now - cachedItem.timestamp < CACHE_DURATION) {
    console.log(`Utilisation du cache pour ${cacheKey}`);
    return cachedItem.data as T;
  }
  
  // Sinon, récupérer les données et les mettre en cache
  try {
    const data = await fetchFunction();
    cache[cacheKey] = { data, timestamp: now };
    return data;
  } catch (error) {
    console.error(`Erreur lors de la récupération des données pour ${cacheKey}:`, error);
    throw error;
  }
}

/**
 * Vide le cache pour une clé spécifique ou tout le cache
 * @param cacheKey Clé de cache à vider (optionnel, si non fourni, vide tout le cache)
 */
export function clearCache(cacheKey?: string): void {
  if (cacheKey) {
    delete cache[cacheKey];
    console.log(`Cache vidé pour ${cacheKey}`);
  } else {
    Object.keys(cache).forEach(key => delete cache[key]);
    console.log('Cache entièrement vidé');
  }
}

// Récupérer tous les articles - VERSION CORRIGÉE AVEC IMAGES
export const getAllArticles = async (): Promise<SanityArticle[]> => {
  return getWithCache('allArticles', async () => {
    try {
      const query = `*[_type == "article"] | order(publishedAt desc) {
        _id,
        title,
        slug,
        contentType,
        mainImage {
          asset->{
            _ref,
            _type,
            url
          },
          hotspot,
          crop
        },
        excerpt,
        publishedAt,
        keyPoints,
        readingTime,
        duration,
        videoUrl,
        guest,
        isEssential,
        isTrending,
        isFeatured,
        stats,
        categories[]->{
          _id,
          title,
          slug
        },
        subcategories[]->{
          _id,
          title,
          slug,
          parentCategory->{
            _id,
            title,
            slug
          }
        },
        author->{
          _id,
          name,
          "imageUrl": image.asset->url,
          image {
            asset->{
              _ref,
              _type,
              url
            },
            hotspot,
            crop
          },
          bio
        }
      }`;
      
      const articles = await sanityClient.fetch(query);
      console.log(`Articles récupérés: ${articles?.length || 0}`);
      
      // Log pour debug : afficher les types de contenu présents
      if (articles && articles.length > 0) {
        const contentTypes = [...new Set(articles.map(a => a.contentType))];
        console.log('Types de contenu disponibles:', contentTypes);
        // Debug pour voir la structure de l'image
        console.log('Premier article mainImage:', articles[0].mainImage);
      }
      
      return articles || [];
    } catch (error) {
      console.error("Erreur lors de la récupération des articles:", error);
      return [];
    }
  });
};

// Récupérer un article par son slug (modifié pour supporter le preview)
export const getArticleBySlug = async (slug: string, preview = false): Promise<SanityArticle | null> => {
  // Logs de débogage détaillés
  console.log("🔍 getArticleBySlug appelé avec:", { slug, preview });
  
  // Si preview, utiliser le client preview sans cache
  if (preview) {
    try {
      // Log pour vérifier le client utilisé
      console.log("🔍 Utilisation du previewClient");
      console.log("📊 Configuration du previewClient:", {
        dataset: previewClient.config().dataset,
        perspective: previewClient.config().perspective,
        hasToken: !!previewClient.config().token
      });
      
      // Requête modifiée pour chercher aussi les brouillons
      const query = `*[_type == "article" && slug.current == $slug][0] {
        _id,
        _rev,
        _type,
        title,
        slug,
        contentType,
        mainImage {
          asset->{
            _ref,
            _type,
            url
          },
          hotspot,
          crop
        },
        body,
        excerpt,
        publishedAt,
        keyPoints,
        readingTime,
        duration,
        videoUrl,
        guest,
        isEssential,
        isTrending,
        isFeatured,
        stats,
        categories[]->{
          _id,
          title,
          slug
        },
        subcategories[]->{
          _id,
          title,
          slug,
          parentCategory->{
            _id,
            title,
            slug
          }
        },
        author->{
          _id,
          name,
          "imageUrl": image.asset->url,
          image {
            asset->{
              _ref,
              _type,
              url
            },
            hotspot,
            crop
          },
          bio
        }
      }`;
      
      console.log("🔍 Exécution de la requête preview pour slug:", slug);
      console.log("🔎 Requête GROQ:", query);
      
      const result = await previewClient.fetch(query, { slug });
      
      console.log("✅ Résultat de la requête preview:", {
        found: !!result,
        id: result?._id,
        title: result?.title,
        contentType: result?.contentType,
        keyPoints: result?.keyPoints,
        isPublished: result?._id && !result._id.startsWith('drafts.')
      });
      
      // Si pas de résultat, essayer de chercher spécifiquement les brouillons
      if (!result) {
        console.log("⚠️ Aucun article trouvé, recherche des brouillons...");
        
        const draftQuery = `*[_type == "article" && (_id match "drafts.*") && slug.current == $slug][0] {
          _id,
          _rev,
          _type,
          title,
          slug,
          contentType,
          mainImage {
            asset->{
              _ref,
              _type,
              url
            },
            hotspot,
            crop
          },
          body,
          excerpt,
          publishedAt,
          keyPoints,
          readingTime,
          duration,
          videoUrl,
          guest,
          isEssential,
          isTrending,
          isFeatured,
          stats,
          categories[]->{
            _id,
            title,
            slug
          },
          subcategories[]->{
            _id,
            title,
            slug,
            parentCategory->{
              _id,
              title,
              slug
            }
          },
          author->{
            _id,
            name,
            "imageUrl": image.asset->url,
            image {
              asset->{
                _ref,
                _type,
                url
              },
              hotspot,
              crop
            },
            bio
          }
        }`;
        
        console.log("🔎 Requête spécifique brouillons:", draftQuery);
        const draftResult = await previewClient.fetch(draftQuery, { slug });
        
        console.log("📋 Résultat recherche brouillons:", {
          found: !!draftResult,
          id: draftResult?._id,
          contentType: draftResult?.contentType,
          keyPoints: draftResult?.keyPoints
        });
        
        return draftResult;
      }
      
      return result;
    } catch (error) {
      console.error(`❌ Erreur lors de la récupération preview de l'article ${slug}:`, error);
      console.error("Détails de l'erreur:", error);
      return null;
    }
  }
  
  // Mode normal avec cache
  console.log("📚 Utilisation du mode normal (avec cache)");
  return getWithCache(`article_${slug}`, async () => {
    try {
      const query = `*[_type == "article" && slug.current == $slug][0] {
        _id,
        title,
        slug,
        contentType,
        mainImage {
          asset->{
            _ref,
            _type,
            url
          },
          hotspot,
          crop
        },
        body,
        excerpt,
        publishedAt,
        keyPoints,
        readingTime,
        duration,
        videoUrl,
        guest,
        isEssential,
        isTrending,
        isFeatured,
        stats,
        categories[]->{
          _id,
          title,
          slug
        },
        subcategories[]->{
          _id,
          title,
          slug,
          parentCategory->{
            _id,
            title,
            slug
          }
        },
        author->{
          _id,
          name,
          "imageUrl": image.asset->url,
          image {
            asset->{
              _ref,
              _type,
              url
            },
            hotspot,
            crop
          },
          bio
        }
      }`;
      
      const result = await sanityClient.fetch(query, { slug });
      console.log("📋 Article récupéré avec contentType:", result?.contentType);
      console.log("🎯 Hotspot data:", result?.mainImage?.hotspot);
      return result;
    } catch (error) {
      console.error(`Erreur lors de la récupération de l'article ${slug}:`, error);
      return null;
    }
  });
};

// Récupérer les articles par catégorie - VERSION CORRIGÉE AVEC IMAGES
export const getArticlesByCategory = async (categorySlug: string): Promise<SanityArticle[]> => {
  return getWithCache(`articles_category_${categorySlug}`, async () => {
    try {
      // D'abord, on trouve la catégorie pour avoir son _id
      const categoryQuery = `*[_type == "category" && slug.current == $categorySlug][0]._id`;
      const categoryId = await sanityClient.fetch(categoryQuery, { categorySlug });
      
      if (!categoryId) {
        console.log(`Catégorie non trouvée pour le slug: ${categorySlug}`);
        return [];
      }
      
      // Ensuite, on cherche les articles qui référencent cette catégorie
      const query = `*[_type == "article" && references($categoryId)] | order(publishedAt desc) {
        _id,
        title,
        slug,
        contentType,
        mainImage {
          asset->{
            _ref,
            _type,
            url
          },
          hotspot,
          crop
        },
        excerpt,
        publishedAt,
        keyPoints,
        readingTime,
        duration,
        videoUrl,
        guest,
        isEssential,
        isTrending,
        isFeatured,
        stats,
        categories[]->{
          _id,
          title,
          slug
        },
        subcategories[]->{
          _id,
          title,
          slug,
          parentCategory->{
            _id,
            title,
            slug
          }
        }
      }`;
      
      const articles = await sanityClient.fetch(query, { categoryId });
      console.log(`Articles trouvés pour ${categorySlug}: ${articles.length}`);
      
      return articles;
    } catch (error) {
      console.error(`Erreur lors de la récupération des articles de la catégorie ${categorySlug}:`, error);
      return [];
    }
  });
};

// Récupérer une catégorie par son slug
export const getCategoryBySlug = async (slug: string) => {
  return getWithCache(`category_${slug}`, async () => {
    try {
      const query = `*[_type == "category" && slug.current == $slug][0] {
        _id,
        title,
        slug,
        description
      }`;
      
      return await sanityClient.fetch(query, { slug });
    } catch (error) {
      console.error(`Erreur lors de la récupération de la catégorie ${slug}:`, error);
      return null;
    }
  });
};

// Récupérer les Flash (anciennement amuses-bouches) - VERSION OCTOGOAL
export const getFlashContent = async (limit = 5): Promise<any[]> => {
  return getWithCache(`flash_${limit}`, async () => {
    try {
      // Chercher les articles avec contentType "flash"
      const query = `*[_type == "article" && contentType == "flash"] | order(publishedAt desc)[0...$limit] {
        _id,
        title,
        slug,
        mainImage {
          asset->{
            _ref,
            _type,
            url
          },
          hotspot,
          crop
        },
        "description": excerpt,
        "coverImage": mainImage,
        excerpt,
        publishedAt,
        keyPoints,
        "duration": coalesce(duration, readingTime, "3 min"),
        "videoUrl": videoUrl
      }`;
      
      const results = await sanityClient.fetch(query, { limit });
      console.log(`Flash récupérés: ${results?.length || 0}`);
      return results || [];
    } catch (error) {
      console.error("Erreur lors de la récupération des Flash:", error);
      return [];
    }
  });
};

// Fonction legacy pour compatibilité (redirige vers getFlashContent)
export const getAmuseBouches = async (limit = 5): Promise<any[]> => {
  return getFlashContent(limit);
};

// Récupérer la citation la plus récente
export const getLatestQuote = async (): Promise<SanityQuote | null> => {
  return getWithCache('latestQuote', async () => {
    try {
      const query = `*[_type == "quote"] | order(publishedAt desc)[0] {
        _id,
        text,
        author,
        publishedAt
      }`;
      
      return await sanityClient.fetch(query);
    } catch (error) {
      console.error("Erreur lors de la récupération de la citation:", error);
      return null;
    }
  });
};

// Récupérer le débat à la une
export const getFeaturedDebate = async (): Promise<SanityDebate | null> => {
  return getWithCache('featuredDebate', async () => {
    try {
      const query = `*[_type == "debate" && isActive == true] | order(publishedAt desc)[0] {
        _id,
        "title": question,
        description,
        "image": forPerson.image,
        slug,
        "opinions": [
          {
            "position": "Pour",
            "author": {
              "name": forPerson.name,
              "role": forPerson.role,
              "image": forPerson.image
            },
            "arguments": [forPerson.argument],
            "votes": coalesce(stats.votesFor, 0)
          },
          {
            "position": "Contre",
            "author": {
              "name": againstPerson.name,
              "role": againstPerson.role,
              "image": againstPerson.image
            },
            "arguments": [againstPerson.argument],
            "votes": coalesce(stats.votesAgainst, 0)
          }
        ],
        "moderator": {
          "name": "Octogoal",
          "role": "Modérateur",
          "image": forPerson.image
        },
        "stats": {
          "totalVotes": coalesce(stats.votesFor, 0) + coalesce(stats.votesAgainst, 0),
          "comments": coalesce(stats.comments, 0),
          "shares": "1.2K"
        }
      }`;
      
      return await sanityClient.fetch(query);
    } catch (error) {
      console.error("Erreur lors de la récupération du débat à la une:", error);
      return null;
    }
  });
};

// Récupérer le VS Poll à la une
export const getFeaturedVSPoll = async (): Promise<SanityVSPoll | null> => {
  return getWithCache('featuredVSPoll', async () => {
    try {
      const query = `*[_type == "vsPoll" && featured == true && active == true] | order(publishedAt desc)[0] {
        _id,
        title,
        question,
        slug,
        option1 {
          name,
          subtitle,
          image {
            asset->{
              _ref,
              _type,
              url
            },
            hotspot,
            crop
          },
          color,
          votes
        },
        option2 {
          name,
          subtitle,
          image {
            asset->{
              _ref,
              _type,
              url
            },
            hotspot,
            crop
          },
          color,
          votes
        },
        context,
        featured,
        active,
        publishedAt,
        endsAt
      }`;

      return await sanityClient.fetch(query);
    } catch (error) {
      console.error("Erreur lors de la récupération du VS Poll à la une:", error);
      return null;
    }
  });
};

// Récupérer les univers éditoriaux
export const getUniverses = async (): Promise<SanityUniverse[]> => {
  return getWithCache('universes', async () => {
    try {
      const query = `*[_type == "universe"] | order(order asc) {
        _id,
        title,
        description,
        image,
        slug,
        order
      }`;
      
      return await sanityClient.fetch(query);
    } catch (error) {
      console.error("Erreur lors de la récupération des univers:", error);
      return [];
    }
  });
};

// Récupérer les fonctionnalités du club
export const getClubFeatures = async (): Promise<SanityClubFeature[]> => {
  return getWithCache('clubFeatures', async () => {
    try {
      const query = `*[_type == "clubFeature"] | order(order asc) {
        _id,
        title,
        description,
        icon,
        order
      }`;
      
      return await sanityClient.fetch(query);
    } catch (error) {
      console.error("Erreur lors de la récupération des fonctionnalités du club:", error);
      return [];
    }
  });
};

// Récupérer les tarifs du club
export const getClubPricing = async (): Promise<SanityClubPricing[]> => {
  return getWithCache('clubPricing', async () => {
    try {
      const query = `*[_type == "clubPricing"] | order(price asc) {
        _id,
        price,
        currency,
        period,
        features,
        isActive
      }`;
      
      return await sanityClient.fetch(query);
    } catch (error) {
      console.error("Erreur lors de la récupération des tarifs du club:", error);
      return [];
    }
  });
};

// ============= TYPES DE CONTENU OCTOGOAL =============
// Mapping des types de contenu pour Octogoal Media
// actu     → 📰 News foot classiques
// emission → 🎬 Réactions, débats, lives
// flash    → ⚡ Contenu court, réaction rapide
// analyse  → 📊 Décryptage tactique, stats
// portrait → 👤 Focus joueur ou personnalité
// meme     → 😂 Contenus humoristiques
// top      → 📋 Classements, top 10...

// Récupérer les contenus par type - VERSION OCTOGOAL
export const getContentItems = async (contentType: string, limit = 5): Promise<any[]> => {
  return getWithCache(`contentItems_${contentType}_${limit}`, async () => {
    try {
      // Mapping des types de section vers les valeurs de contentType dans Sanity
      const typeMapping: Record<string, string> = {
        'actu': 'actu',
        'emission': 'emission',
        'flash': 'flash',
        'analyse': 'analyse',
        'portrait': 'portrait',
        'meme': 'meme',
        'top': 'top'
      };
      
      const sanityContentType = typeMapping[contentType];
      
      if (!sanityContentType) {
        console.log(`Type de contenu non mappé: ${contentType}`);
        return [];
      }
      
      const query = `*[_type == "article" && contentType == $sanityContentType] | order(publishedAt desc)[0...$limit] {
        _id,
        title,
        slug,
        contentType,
        mainImage {
          asset->{
            _ref,
            _type,
            url
          },
          hotspot,
          crop
        },
        excerpt,
        publishedAt,
        keyPoints,
        readingTime,
        duration,
        videoUrl,
        guest,
        isEssential,
        isTrending,
        isFeatured,
        stats,
        categories[]->{
          _id,
          title,
          slug
        },
        subcategories[]->{
          _id,
          title,
          slug
        }
      }`;
      
      const results = await sanityClient.fetch(query, { sanityContentType, limit });
      console.log(`Articles trouvés pour ${contentType} (${sanityContentType}): ${results?.length || 0}`);
      
      return results || [];
    } catch (error) {
      console.error(`Erreur lors de la récupération des contenus de type ${contentType}:`, error);
      return [];
    }
  });
};

// ============= NOUVELLES FONCTIONS POUR LES SOUS-CATÉGORIES =============

// Récupérer les articles par sous-catégorie - VERSION CORRIGÉE AVEC IMAGES
export const getArticlesBySubcategory = async (subcategorySlug: string): Promise<SanityArticle[]> => {
  return getWithCache(`articles_subcategory_${subcategorySlug}`, async () => {
    try {
      // D'abord, on trouve la sous-catégorie pour avoir son _id
      const subcategoryQuery = `*[_type == "subcategory" && slug.current == $subcategorySlug][0]._id`;
      const subcategoryId = await sanityClient.fetch(subcategoryQuery, { subcategorySlug });
      
      if (!subcategoryId) {
        console.log(`Sous-catégorie non trouvée pour le slug: ${subcategorySlug}`);
        return [];
      }
      
      // Ensuite, on cherche les articles qui référencent cette sous-catégorie
      const query = `*[_type == "article" && references($subcategoryId)] | order(publishedAt desc) {
        _id,
        title,
        slug,
        contentType,
        mainImage {
          asset->{
            _ref,
            _type,
            url
          },
          hotspot,
          crop
        },
        excerpt,
        publishedAt,
        keyPoints,
        readingTime,
        duration,
        videoUrl,
        guest,
        isTrending,
        isFeatured,
        isEssential,
        stats,
        categories[]->{
          _id,
          title,
          slug
        },
        subcategories[]->{
          _id,
          title,
          slug,
          parentCategory->{
            _id,
            title,
            slug
          }
        }
      }`;
      
      const articles = await sanityClient.fetch(query, { subcategoryId });
      console.log(`Articles trouvés pour ${subcategorySlug}: ${articles.length}`);
      
      return articles;
    } catch (error) {
      console.error(`Erreur lors de la récupération des articles de la sous-catégorie ${subcategorySlug}:`, error);
      return [];
    }
  });
};

// Récupérer les sous-catégories groupées par catégorie parente
export const getSubcategoriesGrouped = async (): Promise<any> => {
  return getWithCache('subcategoriesGrouped', async () => {
    try {
      const query = `*[_type == "category"] | order(order asc) {
        _id,
        title,
        slug,
        "subcategories": *[_type == "subcategory" && references(^._id)] | order(order asc) {
          _id,
          title,
          slug,
          description,
          articleCount,
          isActive
        }
      }`;
      
      return await sanityClient.fetch(query);
    } catch (error) {
      console.error("Erreur lors de la récupération des sous-catégories groupées:", error);
      return [];
    }
  });
};

// Récupérer une sous-catégorie par son slug
export const getSubcategoryBySlug = async (slug: string) => {
  return getWithCache(`subcategory_${slug}`, async () => {
    try {
      const query = `*[_type == "subcategory" && slug.current == $slug][0] {
        _id,
        title,
        slug,
        description,
        parentCategory->{
          _id,
          title,
          slug
        }
      }`;
      
      return await sanityClient.fetch(query, { slug });
    } catch (error) {
      console.error(`Erreur lors de la récupération de la sous-catégorie ${slug}:`, error);
      return null;
    }
  });
};

// ============= FONCTIONS POUR LES ÉMISSIONS (QUI SONT DES ARTICLES) =============

// Récupérer toutes les émissions (articles de type émission)
export const getAllEmissions = async (): Promise<any[]> => {
  return getWithCache('allEmissions', async () => {
    try {
      // Chercher les ARTICLES avec contentType = 'emission'
      const query = `*[_type == "article" && contentType == "emission"] | order(publishedAt desc) {
        _id,
        title,
        "description": excerpt,
        "thumbnail": mainImage.asset->url,
        "slug": slug.current,
        "duration": duration,
        publishedAt,
        "featured": isFeatured,
        "listens": coalesce(stats.views, 0),
        "likes": coalesce(stats.likes, 0),
        "videoUrlExternal": videoUrl,
        "category": categories[0]->title,
        "guest": guest
      }`;
      
      const emissions = await sanityClient.fetch(query);
      console.log(`Émissions récupérées: ${emissions?.length || 0}`);
      
      return emissions || [];
    } catch (error) {
      console.error("Erreur lors de la récupération des émissions:", error);
      return [];
    }
  });
};

// Récupérer l'émission featured/à la une
export const getFeaturedEmission = async (): Promise<any | null> => {
  return getWithCache('featuredEmission', async () => {
    try {
      const query = `*[_type == "article" && contentType == "emission" && isFeatured == true][0] {
        _id,
        title,
        "description": excerpt,
        "thumbnail": mainImage.asset->url,
        "slug": slug.current,
        "duration": duration,
        publishedAt,
        "featured": isFeatured,
        "listens": coalesce(stats.views, 0),
        "likes": coalesce(stats.likes, 0),
        "videoUrlExternal": videoUrl,
        "category": categories[0]->title,
        "guest": guest
      }`;
      
      const emission = await sanityClient.fetch(query);
      
      // Si pas d'émission featured, prendre la plus récente
      if (!emission) {
        const fallbackQuery = `*[_type == "article" && contentType == "emission"] | order(publishedAt desc)[0] {
          _id,
          title,
          "description": excerpt,
          "thumbnail": mainImage.asset->url,
          "slug": slug.current,
          "duration": duration,
          publishedAt,
          "featured": isFeatured,
          "listens": coalesce(stats.views, 0),
          "likes": coalesce(stats.likes, 0),
          "videoUrlExternal": videoUrl,
          "category": categories[0]->title,
          "guest": guest
        }`;
        
        return await sanityClient.fetch(fallbackQuery);
      }
      
      return emission;
    } catch (error) {
      console.error("Erreur lors de la récupération de l'émission featured:", error);
      return null;
    }
  });
};

// Récupérer les émissions par catégorie
export const getEmissionsByCategory = async (category: string): Promise<any[]> => {
  return getWithCache(`emissions_category_${category}`, async () => {
    try {
      const query = `*[_type == "article" && contentType == "emission" && categories[]->title match $category] | order(publishedAt desc) {
        _id,
        title,
        "description": excerpt,
        "thumbnail": mainImage.asset->url,
        "slug": slug.current,
        "duration": duration,
        publishedAt,
        "featured": isFeatured,
        "listens": coalesce(stats.views, 0),
        "likes": coalesce(stats.likes, 0),
        "videoUrlExternal": videoUrl,
        "category": categories[0]->title,
        "guest": guest
      }`;
      
      const emissions = await sanityClient.fetch(query, { category });
      console.log(`Émissions trouvées pour la catégorie ${category}: ${emissions?.length || 0}`);
      
      if (!emissions || !Array.isArray(emissions)) {
        return [];
      }
      
      return emissions;
    } catch (error) {
      console.error(`Erreur lors de la récupération des émissions de la catégorie ${category}:`, error);
      return [];
    }
  });
};

// ============= FONCTIONS SPÉCIFIQUES OCTOGOAL =============

// Récupérer les analyses (matchs, tactique)
export const getAnalyses = async (limit = 5): Promise<any[]> => {
  return getWithCache(`analyses_${limit}`, async () => {
    try {
      const query = `*[_type == "article" && contentType == "analyse"] | order(publishedAt desc)[0...$limit] {
        _id,
        title,
        slug,
        mainImage {
          asset->{
            _ref,
            _type,
            url
          },
          hotspot,
          crop
        },
        excerpt,
        publishedAt,
        matchInfo,
        keyPoints,
        readingTime,
        categories[]->{
          _id,
          title,
          slug
        }
      }`;
      
      const results = await sanityClient.fetch(query, { limit });
      console.log(`Analyses récupérées: ${results?.length || 0}`);
      return results || [];
    } catch (error) {
      console.error("Erreur lors de la récupération des analyses:", error);
      return [];
    }
  });
};

// Récupérer les portraits (joueurs, personnalités)
export const getPortraits = async (limit = 5): Promise<any[]> => {
  return getWithCache(`portraits_${limit}`, async () => {
    try {
      const query = `*[_type == "article" && contentType == "portrait"] | order(publishedAt desc)[0...$limit] {
        _id,
        title,
        slug,
        mainImage {
          asset->{
            _ref,
            _type,
            url
          },
          hotspot,
          crop
        },
        excerpt,
        publishedAt,
        playerName,
        playerClub,
        playerPosition,
        keyPoints,
        readingTime,
        categories[]->{
          _id,
          title,
          slug
        }
      }`;
      
      const results = await sanityClient.fetch(query, { limit });
      console.log(`Portraits récupérés: ${results?.length || 0}`);
      return results || [];
    } catch (error) {
      console.error("Erreur lors de la récupération des portraits:", error);
      return [];
    }
  });
};

// Récupérer les mèmes
export const getMemes = async (limit = 10): Promise<any[]> => {
  return getWithCache(`memes_${limit}`, async () => {
    try {
      const query = `*[_type == "article" && contentType == "meme"] | order(publishedAt desc)[0...$limit] {
        _id,
        title,
        slug,
        mainImage {
          asset->{
            _ref,
            _type,
            url
          },
          hotspot,
          crop
        },
        excerpt,
        publishedAt,
        videoUrl,
        stats
      }`;
      
      const results = await sanityClient.fetch(query, { limit });
      console.log(`Mèmes récupérés: ${results?.length || 0}`);
      return results || [];
    } catch (error) {
      console.error("Erreur lors de la récupération des mèmes:", error);
      return [];
    }
  });
};

// Récupérer les tops/listes
export const getTops = async (limit = 5): Promise<any[]> => {
  return getWithCache(`tops_${limit}`, async () => {
    try {
      const query = `*[_type == "article" && contentType == "top"] | order(publishedAt desc)[0...$limit] {
        _id,
        title,
        slug,
        mainImage {
          asset->{
            _ref,
            _type,
            url
          },
          hotspot,
          crop
        },
        excerpt,
        publishedAt,
        listItems,
        keyPoints,
        readingTime,
        categories[]->{
          _id,
          title,
          slug
        }
      }`;
      
      const results = await sanityClient.fetch(query, { limit });
      console.log(`Tops/Listes récupérés: ${results?.length || 0}`);
      return results || [];
    } catch (error) {
      console.error("Erreur lors de la récupération des tops:", error);
      return [];
    }
  });
};

// Récupérer les actus
export const getActus = async (limit = 10): Promise<any[]> => {
  return getWithCache(`actus_${limit}`, async () => {
    try {
      const query = `*[_type == "article" && contentType == "actu"] | order(publishedAt desc)[0...$limit] {
        _id,
        title,
        slug,
        mainImage {
          asset->{
            _ref,
            _type,
            url
          },
          hotspot,
          crop
        },
        excerpt,
        publishedAt,
        keyPoints,
        readingTime,
        isTrending,
        isFeatured,
        isEssential,
        categories[]->{
          _id,
          title,
          slug
        },
        subcategories[]->{
          _id,
          title,
          slug
        }
      }`;

      const results = await sanityClient.fetch(query, { limit });
      console.log(`Actus récupérées: ${results?.length || 0}`);
      return results || [];
    } catch (error) {
      console.error("Erreur lors de la récupération des actus:", error);
      return [];
    }
  });
};

// ============= FONCTIONS POUR L'ÉMISSION OCTOGOAL (MOMO) =============

// Récupérer toutes les émissions Octogoal (format long)
export const getOctogoalEmissions = async (limit = 50): Promise<any[]> => {
  return getWithCache(`octogoalEmissions_${limit}`, async () => {
    try {
      const query = `*[_type == "emission"] | order(publishedAt desc)[0...$limit] {
        _id,
        title,
        "slug": slug.current,
        episodeNumber,
        youtubeUrl,
        "thumbnail": thumbnail.asset->url,
        duration,
        description,
        publishedAt,
        themes
      }`;

      const results = await sanityClient.fetch(query, { limit });
      console.log(`Émissions Octogoal récupérées: ${results?.length || 0}`);
      return results || [];
    } catch (error) {
      console.error("Erreur lors de la récupération des émissions Octogoal:", error);
      return [];
    }
  });
};

// Récupérer la dernière émission Octogoal
export const getLatestOctogoalEmission = async (): Promise<any | null> => {
  return getWithCache('latestOctogoalEmission', async () => {
    try {
      const query = `*[_type == "emission"] | order(publishedAt desc)[0] {
        _id,
        title,
        "slug": slug.current,
        episodeNumber,
        youtubeUrl,
        "thumbnail": thumbnail.asset->url,
        duration,
        description,
        publishedAt,
        themes
      }`;

      const result = await sanityClient.fetch(query);
      console.log(`Dernière émission Octogoal:`, result?.title || 'Aucune');
      return result;
    } catch (error) {
      console.error("Erreur lors de la récupération de la dernière émission:", error);
      return null;
    }
  });
};

// Récupérer les extraits (shorts/clips)
export const getOctogoalExtraits = async (limit = 20): Promise<any[]> => {
  return getWithCache(`octogoalExtraits_${limit}`, async () => {
    try {
      const query = `*[_type == "extrait"] | order(publishedAt desc)[0...$limit] {
        _id,
        title,
        youtubeShortUrl,
        "thumbnail": thumbnail.asset->url,
        duration,
        publishedAt,
        emission->{
          _id,
          title,
          episodeNumber
        }
      }`;

      const results = await sanityClient.fetch(query, { limit });
      console.log(`Extraits Octogoal récupérés: ${results?.length || 0}`);
      return results || [];
    } catch (error) {
      console.error("Erreur lors de la récupération des extraits:", error);
      return [];
    }
  });
};
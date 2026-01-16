import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { defaultSEO, routeSEO } from '../../config/seo.config';

// Type pour les images Sanity ou URL string
interface SanityImageAsset {
  asset?: {
    url?: string;
  };
}

type ImageProp = string | SanityImageAsset | null | undefined;

interface SEOProps {
  title?: string;
  description?: string;
  image?: ImageProp;
  article?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  keywords?: string;
  category?: string;
}

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  image,
  article = false,
  publishedTime,
  modifiedTime,
  author,
  keywords,
  category
}) => {
  const location = useLocation();
  const currentRoute = routeSEO[location.pathname] || defaultSEO;

  // Extraire l'URL de l'image si c'est un objet Sanity
  const getImageUrl = (img: ImageProp): string => {
    if (!img) return currentRoute.image;
    if (typeof img === 'string') return img;
    if (img.asset?.url) return img.asset.url;
    return currentRoute.image;
  };

  const seo = {
    title: title || currentRoute.title,
    description: description || currentRoute.description,
    image: getImageUrl(image),
    url: `https://octogoal.media${location.pathname}`
  };

  // JSON-LD structured data pour les articles
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": seo.title,
    "description": seo.description,
    "image": [seo.image],
    "url": seo.url,
    "datePublished": publishedTime,
    "dateModified": modifiedTime || publishedTime,
    "author": {
      "@type": "Person",
      "name": author || "Octogoal",
      "url": "https://octogoal.media"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Octogoal",
      "logo": {
        "@type": "ImageObject",
        "url": "https://octogoal.media/LOGO_OCTOGOAL.png",
        "width": 200,
        "height": 200
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": seo.url
    },
    ...(category && { "articleSection": category }),
    ...(keywords && { "keywords": keywords })
  };

  // JSON-LD pour le site web
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Octogoal",
    "url": "https://octogoal.media",
    "description": "Le média football nouvelle génération",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://octogoal.media/recherche?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  // JSON-LD pour l'organisation
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Octogoal",
    "url": "https://octogoal.media",
    "logo": "https://octogoal.media/LOGO_OCTOGOAL.png",
    "sameAs": [
      "https://www.youtube.com/@octogoal",
      "https://www.instagram.com/octogoal",
      "https://twitter.com/octogoal",
      "https://discord.gg/octogoal"
    ]
  };

  // Breadcrumb JSON-LD
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Accueil",
        "item": "https://octogoal.media"
      },
      ...(article ? [{
        "@type": "ListItem",
        "position": 2,
        "name": category || "Articles",
        "item": `https://octogoal.media/articles`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": seo.title,
        "item": seo.url
      }] : [])
    ]
  };

  return (
    <Helmet>
      {/* Basic */}
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      <link rel="canonical" href={seo.url} />
      {keywords && <meta name="keywords" content={keywords} />}

      {/* Open Graph */}
      <meta property="og:url" content={seo.url} />
      <meta property="og:title" content={seo.title} />
      <meta property="og:description" content={seo.description} />
      <meta property="og:image" content={seo.image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:type" content={article ? 'article' : 'website'} />
      <meta property="og:site_name" content="Octogoal" />
      <meta property="og:locale" content="fr_FR" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@octogoal" />
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:description" content={seo.description} />
      <meta name="twitter:image" content={seo.image} />

      {/* Article specific */}
      {article && publishedTime && (
        <>
          <meta property="article:published_time" content={publishedTime} />
          {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
          {author && <meta property="article:author" content={author} />}
          {category && <meta property="article:section" content={category} />}
        </>
      )}

      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(article ? articleJsonLd : websiteJsonLd)}
      </script>

      {/* Organization JSON-LD (toujours présent) */}
      <script type="application/ld+json">
        {JSON.stringify(organizationJsonLd)}
      </script>

      {/* Breadcrumb JSON-LD */}
      {article && (
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbJsonLd)}
        </script>
      )}
    </Helmet>
  );
};

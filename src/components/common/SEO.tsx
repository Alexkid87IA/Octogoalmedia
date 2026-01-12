import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { defaultSEO, routeSEO } from '../../config/seo.config';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  article?: boolean;
  publishedTime?: string;
  author?: string;
}

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  image,
  article = false,
  publishedTime,
  author
}) => {
  const location = useLocation();
  const currentRoute = routeSEO[location.pathname] || defaultSEO;

  const seo = {
    title: title || currentRoute.title,
    description: description || currentRoute.description,
    image: image || currentRoute.image,
    url: `https://octogoal.media${location.pathname}`
  };

  // JSON-LD structured data
  const jsonLd = article ? {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": seo.title,
    "description": seo.description,
    "image": seo.image,
    "url": seo.url,
    "datePublished": publishedTime,
    "author": {
      "@type": "Person",
      "name": author || "Octogoal"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Octogoal",
      "logo": {
        "@type": "ImageObject",
        "url": "https://octogoal.media/LOGO_OCTOGOAL.png"
      }
    }
  } : {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Octogoal",
    "url": "https://octogoal.media",
    "description": seo.description
  };

  return (
    <Helmet>
      {/* Basic */}
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      <link rel="canonical" href={seo.url} />

      {/* Open Graph */}
      <meta property="og:url" content={seo.url} />
      <meta property="og:title" content={seo.title} />
      <meta property="og:description" content={seo.description} />
      <meta property="og:image" content={seo.image} />
      <meta property="og:type" content={article ? 'article' : 'website'} />
      <meta property="og:site_name" content="Octogoal" />
      <meta property="og:locale" content="fr_FR" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:description" content={seo.description} />
      <meta name="twitter:image" content={seo.image} />

      {/* Article specific */}
      {article && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}

      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(jsonLd)}
      </script>
    </Helmet>
  );
};
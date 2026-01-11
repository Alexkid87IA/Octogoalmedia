import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { defaultSEO, routeSEO } from '../../config/seo.config';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  article?: boolean;
}

export const SEO: React.FC<SEOProps> = ({ 
  title, 
  description, 
  image,
  article = false 
}) => {
  const location = useLocation();
  const currentRoute = routeSEO[location.pathname] || defaultSEO;

  const seo = {
    title: title || currentRoute.title,
    description: description || currentRoute.description,
    image: image || currentRoute.image,
    url: `https://octogoal.media${location.pathname}`
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

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:description" content={seo.description} />
      <meta name="twitter:image" content={seo.image} />
    </Helmet>
  );
};
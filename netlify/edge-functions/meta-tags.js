// netlify/edge-functions/meta-tags.js
// Edge Function pour Netlify (Deno runtime)

export default async (request, context) => {
  // Récupérer la réponse originale
  const response = await context.next();
  
  // Ne traiter que les pages HTML
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('text/html')) {
    return response;
  }
  
  // Récupérer l'URL
  const url = new URL(request.url);
  const path = url.pathname;
  
  // Déterminer les meta tags selon la page
  let title = 'High Value Media - Coaching & Stratégie Digitale';
  let description = 'Développez votre potentiel avec High Value Media. Coaching personnalisé et stratégies digitales.';
  
  // Pages spécifiques
  if (path === '/guides/maitrise-digitale' || path === '/guides/maitrise-digitale/') {
    title = 'Guide : Maîtrise Digitale Complète - High Value Media';
    description = 'Apprenez à maîtriser tous les aspects du digital pour transformer votre business.';
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
  
  // Pour les articles dynamiques
  if (path.startsWith('/article/')) {
    const slug = path.replace('/article/', '').replace('/', '');
    title = `Article : ${slug.replace(/-/g, ' ')} - High Value Media`;
    description = `Lisez notre article sur ${slug.replace(/-/g, ' ')} et découvrez nos insights exclusifs.`;
  }
  
  // Récupérer le HTML
  const html = await response.text();
  
  // Remplacer le title et ajouter les meta tags
  let modifiedHtml = html.replace(
    /<title>.*?<\/title>/,
    `<title>${title}</title>`
  );
  
  // Ajouter/remplacer les meta tags Open Graph
  const metaTags = `
    <meta name="description" content="${description}">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta property="og:url" content="${url.href}">
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="High Value Media">
    <meta property="og:image" content="https://highvalue.media/LOGO_HV_MEDIA.svg">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${title}">
    <meta name="twitter:description" content="${description}">
    <meta name="twitter:image" content="https://highvalue.media/LOGO_HV_MEDIA.svg">
  `;
  
  // Injecter les meta tags juste après <head>
  modifiedHtml = modifiedHtml.replace(
    '<head>',
    `<head>${metaTags}`
  );
  
  // Retourner la réponse modifiée
  return new Response(modifiedHtml, {
    status: response.status,
    headers: response.headers
  });
};

export const config = {
  path: "/*"
};
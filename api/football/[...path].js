// api/football/[...path].js
// Vercel Serverless Function - Proxy pour API-Football

export default async function handler(req, res) {
  // Récupérer le chemin dynamique
  const { path } = req.query;
  const apiPath = Array.isArray(path) ? path.join('/') : path || '';

  // Construire l'URL API-Football
  const apiUrl = `https://v3.football.api-sports.io/${apiPath}`;

  // Clé API depuis les variables d'environnement
  const apiKey = process.env.API_FOOTBALL_KEY || process.env.VITE_API_FOOTBALL_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'x-rapidapi-key': apiKey,
        'x-rapidapi-host': 'v3.football.api-sports.io',
      },
    });

    const data = await response.json();

    // Headers CORS et cache
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=60');

    return res.status(200).json(data);
  } catch (error) {
    console.error('API Football Error:', error);
    return res.status(500).json({
      error: 'Failed to fetch from API-Football',
      message: error.message
    });
  }
}

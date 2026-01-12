// netlify/functions/api-football.js
// Proxy pour API-Football - évite les problèmes CORS

exports.handler = async (event) => {
  // Récupérer le chemin après /api/football
  const path = event.path.replace('/.netlify/functions/api-football', '').replace('/api/football', '');

  // Construire l'URL API-Football
  const apiUrl = `https://v3.football.api-sports.io${path}`;

  // Clé API depuis les variables d'environnement
  const apiKey = process.env.VITE_API_FOOTBALL_KEY || process.env.API_FOOTBALL_KEY;

  if (!apiKey) {
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: 'API key not configured' }),
    };
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

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=60', // Cache 1 minute
      },
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error('API Football Error:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: 'Failed to fetch from API-Football', message: error.message }),
    };
  }
};

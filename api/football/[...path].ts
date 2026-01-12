import type { VercelRequest, VercelResponse } from '@vercel/node';

const API_KEY = 'da33787ca20dc37d8986e538ef30f941';
const API_HOST = 'https://v3.football.api-sports.io';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Récupérer le chemin de l'API
  const { path } = req.query;
  const apiPath = Array.isArray(path) ? path.join('/') : path || '';

  // Construire l'URL de l'API
  const queryString = new URLSearchParams(req.query as Record<string, string>);
  queryString.delete('path'); // Supprimer le paramètre path

  const apiUrl = `${API_HOST}/${apiPath}?${queryString.toString()}`;

  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'x-apisports-key': API_KEY,
      },
    });

    const data = await response.json();

    // Renvoyer la réponse avec les headers CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');

    return res.status(response.status).json(data);
  } catch (error) {
    console.error('API Football Error:', error);
    return res.status(500).json({ error: 'Failed to fetch from API Football' });
  }
}

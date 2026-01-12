import type { VercelRequest, VercelResponse } from '@vercel/node';

const API_KEY = 'da33787ca20dc37d8986e538ef30f941';
const API_HOST = 'https://v3.football.api-sports.io';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Récupérer le chemin depuis le query param 'path' (set by rewrite)
  const pathParam = req.query.path;
  const apiPath = Array.isArray(pathParam) ? pathParam.join('/') : pathParam || '';

  // Construire les query params sans le path
  const queryParams = new URLSearchParams();
  for (const [key, value] of Object.entries(req.query)) {
    if (key !== 'path' && typeof value === 'string') {
      queryParams.append(key, value);
    }
  }

  const apiUrl = `${API_HOST}/${apiPath}${queryParams.toString() ? '?' + queryParams.toString() : ''}`;

  console.log('[Vercel API] Fetching:', apiUrl);

  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'x-apisports-key': API_KEY,
        'x-rapidapi-host': 'v3.football.api-sports.io',
      },
    });

    const data = await response.json();

    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');

    return res.status(response.status).json(data);
  } catch (error) {
    console.error('[Vercel API] Error:', error);
    return res.status(500).json({ error: 'Failed to fetch from API Football', details: String(error) });
  }
}

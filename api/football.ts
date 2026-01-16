import type { VercelRequest, VercelResponse } from '@vercel/node';

// API key from environment variable (set in Vercel dashboard)
const API_KEY = process.env.API_FOOTBALL_KEY;
const API_HOST = 'https://v3.football.api-sports.io';

// Allowed origins for CORS
const ALLOWED_ORIGINS = [
  'https://octogoal.media',
  'https://www.octogoal.media',
  'https://octogoalmedia.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000',
];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Check API key configuration
  if (!API_KEY) {
    console.error('[Vercel API] API_FOOTBALL_KEY environment variable is not set');
    return res.status(500).json({ error: 'API configuration error' });
  }

  // CORS headers - restrict to allowed origins
  const origin = req.headers.origin || '';
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

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

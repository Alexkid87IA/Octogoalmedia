// Script pour importer les émissions et extraits dans Sanity
// Exécuter avec: npx sanity exec ./src/schemas/import-emissions-data.js --with-user-token

import { createClient } from '@sanity/client';

const client = createClient({
  projectId: '5rn8u6ed',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_TOKEN, // Nécessaire pour écrire
  useCdn: false
});

// ============= ÉMISSIONS (Videos longues) =============
// Épisodes 6, 5, 4, 3 (les 2 premiers ne sont pas fournis)
const emissions = [
  {
    _type: 'emission',
    title: 'Émission Octogoal #6',
    slug: { _type: 'slug', current: 'emission-octogoal-6' },
    episodeNumber: 6,
    youtubeUrl: 'https://www.youtube.com/watch?v=m85LBJ75Lwk',
    description: 'Dernière émission Octogoal',
    publishedAt: new Date().toISOString()
  },
  {
    _type: 'emission',
    title: 'Émission Octogoal #5',
    slug: { _type: 'slug', current: 'emission-octogoal-5' },
    episodeNumber: 5,
    youtubeUrl: 'https://www.youtube.com/watch?v=qip4oKBARak',
    description: 'Émission Octogoal',
    publishedAt: new Date(Date.now() - 86400000).toISOString() // -1 jour
  },
  {
    _type: 'emission',
    title: 'Émission Octogoal #4',
    slug: { _type: 'slug', current: 'emission-octogoal-4' },
    episodeNumber: 4,
    youtubeUrl: 'https://www.youtube.com/watch?v=aIStLalPrSg',
    description: 'Émission Octogoal',
    publishedAt: new Date(Date.now() - 172800000).toISOString() // -2 jours
  },
  {
    _type: 'emission',
    title: 'Émission Octogoal #3',
    slug: { _type: 'slug', current: 'emission-octogoal-3' },
    episodeNumber: 3,
    youtubeUrl: 'https://www.youtube.com/watch?v=N2sntkVGvY0',
    description: 'Émission Octogoal',
    publishedAt: new Date(Date.now() - 259200000).toISOString() // -3 jours
  }
];

// ============= EXTRAITS / SHORTS =============
const extraits = [
  {
    _type: 'extrait',
    title: 'Extrait #1',
    youtubeShortUrl: 'https://www.youtube.com/shorts/C1tAxrJ4yQ8',
    publishedAt: new Date().toISOString()
  },
  {
    _type: 'extrait',
    title: 'Extrait #2',
    youtubeShortUrl: 'https://www.youtube.com/shorts/UG37HFn-8ow',
    publishedAt: new Date(Date.now() - 3600000).toISOString()
  },
  {
    _type: 'extrait',
    title: 'Extrait #3',
    youtubeShortUrl: 'https://www.youtube.com/shorts/7tJ0X_PVScg',
    publishedAt: new Date(Date.now() - 7200000).toISOString()
  },
  {
    _type: 'extrait',
    title: 'Extrait #4',
    youtubeShortUrl: 'https://www.youtube.com/shorts/MluTyAdV-G0',
    publishedAt: new Date(Date.now() - 10800000).toISOString()
  },
  {
    _type: 'extrait',
    title: 'Extrait #5',
    youtubeShortUrl: 'https://www.youtube.com/shorts/PeMgOyOBnDE',
    publishedAt: new Date(Date.now() - 14400000).toISOString()
  },
  {
    _type: 'extrait',
    title: 'Extrait #6',
    youtubeShortUrl: 'https://www.youtube.com/shorts/Vt6Lj4ZJP1U',
    publishedAt: new Date(Date.now() - 18000000).toISOString()
  },
  {
    _type: 'extrait',
    title: 'Extrait #7',
    youtubeShortUrl: 'https://www.youtube.com/shorts/UOIPBm9QtHo',
    publishedAt: new Date(Date.now() - 21600000).toISOString()
  },
  {
    _type: 'extrait',
    title: 'Extrait #8',
    youtubeShortUrl: 'https://www.youtube.com/shorts/7AXzxSy9tc8',
    publishedAt: new Date(Date.now() - 25200000).toISOString()
  },
  {
    _type: 'extrait',
    title: 'Extrait #9',
    youtubeShortUrl: 'https://www.youtube.com/shorts/7sgVhCsN2f4',
    publishedAt: new Date(Date.now() - 28800000).toISOString()
  }
];

async function importData() {
  console.log('🚀 Début de l\'import des émissions et extraits...\n');

  // Import des émissions
  console.log('📺 Import des émissions...');
  for (const emission of emissions) {
    try {
      const result = await client.create(emission);
      console.log(`  ✅ Créé: ${emission.title} (${result._id})`);
    } catch (error) {
      console.error(`  ❌ Erreur pour ${emission.title}:`, error.message);
    }
  }

  // Import des extraits
  console.log('\n🎬 Import des extraits...');
  for (const extrait of extraits) {
    try {
      const result = await client.create(extrait);
      console.log(`  ✅ Créé: ${extrait.title} (${result._id})`);
    } catch (error) {
      console.error(`  ❌ Erreur pour ${extrait.title}:`, error.message);
    }
  }

  console.log('\n✨ Import terminé!');
}

importData();

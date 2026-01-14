# Integration YouTube - Page Emissions Octogoal

## Objectif

Permettre d'afficher les videos YouTube (emissions longues et extraits/shorts) sur le site Octogoal Media.

---

## Structure des donnees dans Sanity

### 1. Emissions (Videos longues)

Type Sanity: `emission`

```javascript
{
  _type: 'emission',
  title: 'Emission Octogoal #1',           // Titre de l'emission
  slug: { current: 'emission-octogoal-1' }, // URL slug
  episodeNumber: 1,                         // Numero d'episode
  youtubeUrl: 'https://www.youtube.com/watch?v=XXXXX', // URL YouTube complete
  description: 'Description de l\'emission', // Description courte
  publishedAt: '2024-01-15T12:00:00Z'       // Date de publication ISO
}
```

### 2. Extraits (Shorts/Clips)

Type Sanity: `extrait`

```javascript
{
  _type: 'extrait',
  title: 'Extrait #1',                      // Titre du short
  youtubeShortUrl: 'https://www.youtube.com/shorts/XXXXX', // URL YouTube Short
  publishedAt: '2024-01-15T12:00:00Z'       // Date de publication ISO
}
```

---

## Comment ajouter des videos

### Option 1: Via Sanity Studio (Recommande)

1. Aller sur Sanity Studio: https://octogoal.sanity.studio/
2. Dans le menu, choisir "Emission" ou "Extrait"
3. Cliquer sur "+ Create"
4. Remplir les champs:
   - **Pour une emission**: titre, numero d'episode, URL YouTube, description
   - **Pour un extrait**: titre, URL YouTube Short
5. Publier

### Option 2: Via Script d'import

Un script d'import existe deja:
```
cms/src/schemas/import-emissions-data.js
```

Pour l'utiliser:
```bash
cd /chemin/vers/Octogoalmedia/cms
SANITY_TOKEN=votre_token npx sanity exec ./src/schemas/import-emissions-data.js --with-user-token
```

---

## Videos actuelles a importer

### Emissions (4)

| # | Titre | URL YouTube |
|---|-------|-------------|
| 1 | Emission Octogoal #1 | https://www.youtube.com/watch?v=m85LBJ75Lwk |
| 2 | Emission Octogoal #2 | https://www.youtube.com/watch?v=qip4oKBARak |
| 3 | Emission Octogoal #3 | https://www.youtube.com/watch?v=aIStLalPrSg |
| 4 | Emission Octogoal #4 | https://www.youtube.com/watch?v=N2sntkVGvY0 |

### Extraits/Shorts (9)

| # | URL YouTube Short |
|---|-------------------|
| 1 | https://www.youtube.com/shorts/C1tAxrJ4yQ8 |
| 2 | https://www.youtube.com/shorts/UG37HFn-8ow |
| 3 | https://www.youtube.com/shorts/7tJ0X_PVScg |
| 4 | https://www.youtube.com/shorts/MluTyAdV-G0 |
| 5 | https://www.youtube.com/shorts/PeMgOyOBnDE |
| 6 | https://www.youtube.com/shorts/Vt6Lj4ZJP1U |
| 7 | https://www.youtube.com/shorts/UOIPBm9QtHo |
| 8 | https://www.youtube.com/shorts/7AXzxSy9tc8 |
| 9 | https://www.youtube.com/shorts/7sgVhCsN2f4 |

---

## API disponibles (Frontend)

Le frontend utilise ces fonctions pour recuperer les videos:

```typescript
import {
  getOctogoalEmissions,    // Toutes les emissions
  getLatestOctogoalEmission, // Derniere emission
  getOctogoalExtraits      // Tous les extraits
} from '../utils/sanityAPI';

// Exemples d'utilisation
const emissions = await getOctogoalEmissions(10); // 10 dernieres emissions
const extraits = await getOctogoalExtraits(20);   // 20 derniers extraits
```

---

## Affichage sur le site

### Homepage

Un widget "Videos Octogoal" est affiche sur la homepage entre l'article a la une et les articles populaires:
- 1 grande carte pour la derniere emission
- 6 miniatures pour les shorts
- 2 cartes secondaires pour les emissions precedentes

### Page Emissions (/emissions)

Page dediee avec:
- Emission a la une en hero
- Grille de toutes les emissions
- Section extraits/shorts

---

## Notes techniques

- Les miniatures YouTube sont generees automatiquement depuis l'URL
- Format: `https://img.youtube.com/vi/{VIDEO_ID}/hqdefault.jpg`
- Les videos s'ouvrent dans YouTube (nouvel onglet)
- Le cache Sanity est de 5 minutes

---

## Contact

Pour toute question technique, consulter la documentation du projet ou contacter l'equipe dev.

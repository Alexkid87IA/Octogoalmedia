# Guide de Configuration CMS - Octogoal

## Vue d'ensemble

Ce document liste toutes les catégories, sous-catégories et types de contenus à créer dans Sanity CMS pour que le site fonctionne parfaitement.

---

## 1. CATÉGORIES PRINCIPALES

Créer ces catégories dans Sanity (`category` document type) :

| Titre | Slug | Description |
|-------|------|-------------|
| Actus | `actus` | Toutes les actualités foot |
| Joueurs | `joueurs` | Contenus sur les joueurs |
| Formats Octogoal | `formats-octogoal` | Nos formats originaux |
| Mèmes | `memes` | Contenus humoristiques |
| Vidéos | `videos` | Contenus vidéo |

---

## 2. SOUS-CATÉGORIES À CRÉER

### 2.1 Sous-catégories ACTUS (parent: `actus`)

| Titre | Slug | Route | Description |
|-------|------|-------|-------------|
| Mercato | `mercato` | `/rubrique/actus/mercato` | Transferts et rumeurs mercato |
| Rumeurs | `rumeurs` | `/rubrique/actus/rumeurs` | Rumeurs de transferts |
| Officialisations | `officialisations` | `/rubrique/actus/officialisations` | Transferts officiels |
| Ligue 1 | `ligue-1` | `/rubrique/actus/ligue-1` | Actus Ligue 1 |
| Premier League | `premier-league` | `/rubrique/actus/premier-league` | Actus Premier League |
| La Liga | `liga` | `/rubrique/actus/liga` | Actus Liga espagnole |
| Serie A | `serie-a` | `/rubrique/actus/serie-a` | Actus Serie A |
| Bundesliga | `bundesliga` | `/rubrique/actus/bundesliga` | Actus Bundesliga |

### 2.2 Sous-catégories JOUEURS (parent: `joueurs`)

| Titre | Slug | Route | Description |
|-------|------|-------|-------------|
| Tops joueurs | `tops-joueurs` | `/rubrique/joueurs/tops-joueurs` | Classements et tops des joueurs |
| Fiches joueurs | `fiches-joueurs` | `/rubrique/joueurs/fiches-joueurs` | Analyses détaillées de joueurs |
| Joueurs sous-cotés | `joueurs-sous-cotes` | `/rubrique/joueurs/joueurs-sous-cotes` | Joueurs méconnus à suivre |
| Pépites | `pepites` | `/rubrique/joueurs/pepites` | Jeunes talents prometteurs |
| Joueurs légendaires | `joueurs-legendaires` | `/rubrique/joueurs/joueurs-legendaires` | Portraits de légendes |
| Grandes carrières | `carrieres` | `/rubrique/joueurs/carrieres` | Rétrospectives de carrières |

### 2.3 Sous-catégories FORMATS OCTOGOAL (parent: `formats-octogoal`)

| Titre | Slug | Route | Couleur (gradient) | Description |
|-------|------|-------|-------------------|-------------|
| Tops et listes | `tops-listes` | `/rubrique/formats-octogoal/tops-listes` | `from-pink-500 to-rose-600` | Top 10, classements, listes |
| Moments viraux | `moments-viraux` | `/rubrique/formats-octogoal/moments-viraux` | `from-orange-500 to-red-500` | Moments fous, buzz foot |
| Humour et punchlines | `humour-punchlines` | `/rubrique/formats-octogoal/humour-punchlines` | `from-yellow-400 to-orange-500` | Contenus humoristiques |
| Débats et réactions | `debats-reactions` | `/rubrique/formats-octogoal/debats-reactions` | `from-purple-500 to-pink-500` | Analyses et opinions |
| Le joueur du jour | `joueur-du-jour` | `/rubrique/formats-octogoal/joueur-du-jour` | `from-green-400 to-emerald-500` | Mise en avant quotidienne |
| Culture foot | `culture-foot` | `/rubrique/formats-octogoal/culture-foot` | `from-blue-500 to-indigo-600` | Histoire, anecdotes, culture |

---

## 3. STRUCTURE DES ARTICLES

Chaque article dans Sanity doit avoir :

```javascript
{
  // Champs obligatoires
  title: "Titre de l'article",
  slug: { current: "slug-de-larticle" },
  mainImage: { /* image Sanity */ },
  excerpt: "Résumé court (150-200 caractères)",
  publishedAt: "2024-01-12T10:00:00Z",

  // Catégorie principale (OBLIGATOIRE pour le routage)
  categories: [
    { _ref: "id-de-la-categorie" }
  ],

  // Sous-catégorie (OBLIGATOIRE pour les pages de sous-catégorie)
  subcategories: [
    { _ref: "id-de-la-sous-categorie" }
  ],

  // Champs optionnels
  author: { _ref: "id-auteur" },
  readingTime: "5 min",
  featured: true,          // Pour la une
  isTrending: true,        // Pour les tendances
  body: [/* Portable Text */],

  // Pour les contenus vidéo
  videoUrl: "https://youtube.com/...",
  duration: "12:34"
}
```

---

## 4. DONNÉES DYNAMIQUES (API-Football)

Ces données viennent automatiquement de l'API, pas besoin de les créer dans le CMS :

### 4.1 Classements
- Ligue 1 (ID: 61)
- Premier League (ID: 39)
- La Liga (ID: 140)
- Serie A (ID: 135)
- Bundesliga (ID: 78)

### 4.2 Clubs (exemples d'IDs)
| Club | API ID | Route |
|------|--------|-------|
| PSG | 85 | `/classements/club/85` |
| Marseille | 81 | `/classements/club/81` |
| Lyon | 80 | `/classements/club/80` |
| Lille | 79 | `/classements/club/79` |
| Monaco | 91 | `/classements/club/91` |
| Real Madrid | 541 | `/classements/club/541` |
| Barcelone | 529 | `/classements/club/529` |
| Man City | 50 | `/classements/club/50` |
| Bayern | 157 | `/classements/club/157` |
| Liverpool | 40 | `/classements/club/40` |
| Juventus | 496 | `/classements/club/496` |
| AC Milan | 489 | `/classements/club/489` |
| Inter Milan | 505 | `/classements/club/505` |

### 4.3 Joueurs
Les fiches joueurs (`/player/:id`) utilisent l'API-Football automatiquement.

---

## 5. ÉMISSIONS (Document type: `emission`)

Structure pour les émissions YouTube :

```javascript
{
  title: "Titre de l'émission",
  slug: "slug-emission",
  description: "Description de l'épisode",
  thumbnail: "https://img.youtube.com/vi/VIDEO_ID/maxresdefault.jpg",
  youtubeUrl: "https://www.youtube.com/watch?v=VIDEO_ID",
  duration: "1h23",
  episodeNumber: 42,
  publishedAt: "2024-01-12T20:00:00Z",
  featured: true,
  themes: ["PSG", "Mercato", "Ligue 1"]
}
```

---

## 6. CHECKLIST DE CRÉATION DE CONTENU

### Pour chaque ARTICLE, vérifier :
- [ ] Catégorie principale assignée
- [ ] Sous-catégorie assignée (si applicable)
- [ ] Image principale uploadée (ratio 16:9 recommandé)
- [ ] Excerpt rédigé (150-200 caractères)
- [ ] Temps de lecture estimé
- [ ] Date de publication définie

### Pour la PAGE D'ACCUEIL :
- [ ] Au moins 1 article avec `featured: true` (À la une)
- [ ] Au moins 6 articles récents pour les tendances
- [ ] Au moins 10 articles pour Flash Infos

### Pour la PAGE FORMATS (`/formats`) :
- [ ] Au moins 3 articles par sous-catégorie :
  - [ ] Tops et listes
  - [ ] Moments viraux
  - [ ] Humour et punchlines
  - [ ] Débats et réactions
  - [ ] Le joueur du jour
  - [ ] Culture foot

### Pour la PAGE JOUEURS (`/joueurs`) :
- [ ] Articles dans chaque sous-catégorie joueurs
- [ ] Contenus "Tops joueurs" pour le podium
- [ ] Contenus "Pépites" pour la sidebar

---

## 7. REQUÊTES GROQ UTILISÉES

### Articles par catégorie
```groq
*[_type == "article" && references(*[_type == "category" && slug.current == $categorySlug]._id)] | order(publishedAt desc)
```

### Articles par sous-catégorie
```groq
*[_type == "article" && references(*[_type == "subcategory" && slug.current == $subcategorySlug]._id)] | order(publishedAt desc)
```

### Articles à la une
```groq
*[_type == "article" && featured == true] | order(publishedAt desc)[0...5]
```

### Articles tendances
```groq
*[_type == "article" && isTrending == true] | order(trendingOrder asc, publishedAt desc)[0...10]
```

### Articles récents
```groq
*[_type == "article"] | order(publishedAt desc)[0...20]
```

---

## 8. MAPPING CATÉGORIE → ROUTE

| URL | Catégorie CMS | Sous-catégorie CMS |
|-----|---------------|-------------------|
| `/rubrique/actus` | actus | - |
| `/rubrique/actus/mercato` | actus | mercato |
| `/rubrique/actus/ligue-1` | actus | ligue-1 |
| `/rubrique/joueurs` | joueurs | - |
| `/rubrique/joueurs/tops-joueurs` | joueurs | tops-joueurs |
| `/rubrique/joueurs/pepites` | joueurs | pepites |
| `/rubrique/formats-octogoal` | formats-octogoal | - |
| `/rubrique/formats-octogoal/tops-listes` | formats-octogoal | tops-listes |
| `/rubrique/formats-octogoal/culture-foot` | formats-octogoal | culture-foot |
| `/rubrique/memes` | memes | - |

---

## 9. SCHÉMAS SANITY RECOMMANDÉS

### 9.1 Schema Category
```javascript
export default {
  name: 'category',
  title: 'Catégorie',
  type: 'document',
  fields: [
    { name: 'title', title: 'Titre', type: 'string' },
    { name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title' } },
    { name: 'description', title: 'Description', type: 'text' },
    { name: 'color', title: 'Couleur', type: 'string' },
    { name: 'order', title: 'Ordre', type: 'number' }
  ]
}
```

### 9.2 Schema Subcategory
```javascript
export default {
  name: 'subcategory',
  title: 'Sous-catégorie',
  type: 'document',
  fields: [
    { name: 'title', title: 'Titre', type: 'string' },
    { name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title' } },
    { name: 'description', title: 'Description', type: 'text' },
    {
      name: 'parentCategory',
      title: 'Catégorie parente',
      type: 'reference',
      to: [{ type: 'category' }]
    },
    { name: 'color', title: 'Couleur/Gradient', type: 'string' },
    { name: 'isActive', title: 'Active', type: 'boolean', initialValue: true }
  ]
}
```

### 9.3 Schema Article (champs essentiels)
```javascript
export default {
  name: 'article',
  title: 'Article',
  type: 'document',
  fields: [
    { name: 'title', title: 'Titre', type: 'string', validation: Rule => Rule.required() },
    { name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title' } },
    { name: 'mainImage', title: 'Image principale', type: 'image', options: { hotspot: true } },
    { name: 'excerpt', title: 'Extrait', type: 'text', rows: 3 },
    { name: 'body', title: 'Contenu', type: 'blockContent' },
    { name: 'publishedAt', title: 'Date de publication', type: 'datetime' },
    {
      name: 'categories',
      title: 'Catégories',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'category' }] }]
    },
    {
      name: 'subcategories',
      title: 'Sous-catégories',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'subcategory' }] }]
    },
    { name: 'author', title: 'Auteur', type: 'reference', to: [{ type: 'author' }] },
    { name: 'readingTime', title: 'Temps de lecture', type: 'string' },
    { name: 'featured', title: 'À la une', type: 'boolean' },
    { name: 'isTrending', title: 'Tendance', type: 'boolean' },
    { name: 'videoUrl', title: 'URL Vidéo', type: 'url' }
  ]
}
```

---

## 10. ORDRE DE PRIORITÉ DE CRÉATION

1. **URGENT** - Catégories principales (5)
2. **URGENT** - Sous-catégories Actus (8)
3. **URGENT** - Sous-catégories Formats Octogoal (6)
4. **IMPORTANT** - Sous-catégories Joueurs (6)
5. **IMPORTANT** - Articles featured pour la homepage (minimum 5)
6. **NORMAL** - Articles par sous-catégorie (minimum 3 chacune)
7. **NORMAL** - Émissions YouTube

---

## 11. RÉSUMÉ RAPIDE

### Catégories à créer : 5
- actus, joueurs, formats-octogoal, memes, videos

### Sous-catégories à créer : 20
- Actus : 8 (mercato, rumeurs, officialisations, ligue-1, premier-league, liga, serie-a, bundesliga)
- Joueurs : 6 (tops-joueurs, fiches-joueurs, joueurs-sous-cotes, pepites, joueurs-legendaires, carrieres)
- Formats : 6 (tops-listes, moments-viraux, humour-punchlines, debats-reactions, joueur-du-jour, culture-foot)

### Articles minimum recommandés : 60
- 5 articles featured (homepage)
- 3 articles par sous-catégorie (20 × 3 = 60)

---

*Document généré le 12 janvier 2026 - Octogoal Media*

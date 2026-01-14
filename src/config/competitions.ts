// src/config/competitions.ts
// Configuration centralisée de toutes les compétitions Octogoal

// =============================================
// TYPES
// =============================================

export type CompetitionCategory =
  | 'top'
  | 'europe'
  | 'france'
  | 'international'
  | 'other_leagues'
  | 'national_cups';

export type CompetitionType = 'league' | 'cup' | 'tournament';

export interface Competition {
  id: number;
  name: string;
  shortName: string;
  country: string;
  flag: string;
  category: CompetitionCategory;
  type: CompetitionType; // Type de compétition: league (championnat), cup (coupe nationale), tournament (tournoi européen/international)
  priority: number; // Plus bas = plus prioritaire
  color: string; // Gradient TailwindCSS
  totalMatchdays: number;
  isActive: boolean; // Pour les compétitions saisonnières (Euro, CAN, etc.)
}

// =============================================
// TOUTES LES COMPÉTITIONS
// =============================================

export const COMPETITIONS: Record<number, Competition> = {
  // === COUPES D'EUROPE ===
  2: {
    id: 2,
    name: 'Champions League',
    shortName: 'UCL',
    country: 'Europe',
    flag: '🏆',
    category: 'europe',
    type: 'tournament',
    priority: 1,
    color: 'from-blue-900 to-indigo-900',
    totalMatchdays: 8,
    isActive: true,
  },
  3: {
    id: 3,
    name: 'Europa League',
    shortName: 'UEL',
    country: 'Europe',
    flag: '🏆',
    category: 'europe',
    type: 'tournament',
    priority: 2,
    color: 'from-orange-500 to-orange-700',
    totalMatchdays: 8,
    isActive: true,
  },
  848: {
    id: 848,
    name: 'Conference League',
    shortName: 'UECL',
    country: 'Europe',
    flag: '🏆',
    category: 'europe',
    type: 'tournament',
    priority: 3,
    color: 'from-green-600 to-green-800',
    totalMatchdays: 8,
    isActive: true,
  },

  // === TOP 5 EUROPÉENS ===
  61: {
    id: 61,
    name: 'Ligue 1',
    shortName: 'L1',
    country: 'France',
    flag: '🇫🇷',
    category: 'top',
    type: 'league',
    priority: 10,
    color: 'from-blue-600 to-blue-800',
    totalMatchdays: 34,
    isActive: true,
  },
  39: {
    id: 39,
    name: 'Premier League',
    shortName: 'PL',
    country: 'Angleterre',
    flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    category: 'top',
    type: 'league',
    priority: 11,
    color: 'from-purple-600 to-purple-800',
    totalMatchdays: 38,
    isActive: true,
  },
  140: {
    id: 140,
    name: 'La Liga',
    shortName: 'Liga',
    country: 'Espagne',
    flag: '🇪🇸',
    category: 'top',
    type: 'league',
    priority: 12,
    color: 'from-red-600 to-orange-600',
    totalMatchdays: 38,
    isActive: true,
  },
  135: {
    id: 135,
    name: 'Serie A',
    shortName: 'SA',
    country: 'Italie',
    flag: '🇮🇹',
    category: 'top',
    type: 'league',
    priority: 13,
    color: 'from-green-600 to-green-800',
    totalMatchdays: 38,
    isActive: true,
  },
  78: {
    id: 78,
    name: 'Bundesliga',
    shortName: 'BL',
    country: 'Allemagne',
    flag: '🇩🇪',
    category: 'top',
    type: 'league',
    priority: 14,
    color: 'from-red-600 to-yellow-500',
    totalMatchdays: 34,
    isActive: true,
  },

  // === FRANCE ===
  62: {
    id: 62,
    name: 'Ligue 2',
    shortName: 'L2',
    country: 'France',
    flag: '🇫🇷',
    category: 'france',
    type: 'league',
    priority: 20,
    color: 'from-blue-500 to-blue-700',
    totalMatchdays: 34,
    isActive: true,
  },
  66: {
    id: 66,
    name: 'Coupe de France',
    shortName: 'CDF',
    country: 'France',
    flag: '🇫🇷',
    category: 'france',
    type: 'cup',
    priority: 21,
    color: 'from-blue-700 to-red-600',
    totalMatchdays: 10,
    isActive: true,
  },

  // === COMPÉTITIONS INTERNATIONALES ===
  1: {
    id: 1,
    name: 'Coupe du Monde',
    shortName: 'WC',
    country: 'Monde',
    flag: '🌍',
    category: 'international',
    priority: 0, // Priorité maximale quand active
    color: 'from-yellow-500 to-yellow-700',
    totalMatchdays: 64,
    isActive: false, // À activer lors de la compétition
  },
  4: {
    id: 4,
    name: 'Euro',
    shortName: 'EURO',
    country: 'Europe',
    flag: '🇪🇺',
    category: 'international',
    priority: 0,
    color: 'from-blue-600 to-blue-900',
    totalMatchdays: 51,
    isActive: false,
  },
  6: {
    id: 6,
    name: 'Coupe d\'Afrique des Nations',
    shortName: 'CAN',
    country: 'Afrique',
    flag: '🌍',
    category: 'international',
    priority: 0,
    color: 'from-green-600 to-yellow-500',
    totalMatchdays: 52,
    isActive: true, // CAN 2025 en cours
  },
  9: {
    id: 9,
    name: 'Copa America',
    shortName: 'Copa',
    country: 'Amérique du Sud',
    flag: '🌎',
    category: 'international',
    priority: 0,
    color: 'from-yellow-500 to-green-600',
    totalMatchdays: 32,
    isActive: false,
  },
  5: {
    id: 5,
    name: 'Ligue des Nations UEFA',
    shortName: 'UNL',
    country: 'Europe',
    flag: '🏆',
    category: 'international',
    priority: 5,
    color: 'from-indigo-600 to-indigo-800',
    totalMatchdays: 6,
    isActive: true,
  },

  // === AUTRES CHAMPIONNATS ===
  94: {
    id: 94,
    name: 'Liga Portugal',
    shortName: 'LPT',
    country: 'Portugal',
    flag: '🇵🇹',
    category: 'other_leagues',
    priority: 30,
    color: 'from-green-600 to-red-600',
    totalMatchdays: 34,
    isActive: true,
  },
  88: {
    id: 88,
    name: 'Eredivisie',
    shortName: 'ERE',
    country: 'Pays-Bas',
    flag: '🇳🇱',
    category: 'other_leagues',
    priority: 31,
    color: 'from-orange-500 to-orange-700',
    totalMatchdays: 34,
    isActive: true,
  },
  144: {
    id: 144,
    name: 'Jupiler Pro League',
    shortName: 'JPL',
    country: 'Belgique',
    flag: '🇧🇪',
    category: 'other_leagues',
    priority: 32,
    color: 'from-yellow-500 to-red-600',
    totalMatchdays: 34,
    isActive: true,
  },
  203: {
    id: 203,
    name: 'Süper Lig',
    shortName: 'SL',
    country: 'Turquie',
    flag: '🇹🇷',
    category: 'other_leagues',
    priority: 33,
    color: 'from-red-600 to-red-800',
    totalMatchdays: 38,
    isActive: true,
  },
  307: {
    id: 307,
    name: 'Saudi Pro League',
    shortName: 'SPL',
    country: 'Arabie Saoudite',
    flag: '🇸🇦',
    category: 'other_leagues',
    priority: 34,
    color: 'from-green-700 to-green-900',
    totalMatchdays: 34,
    isActive: true,
  },

  // === SUPERCOUPES ===
  556: {
    id: 556,
    name: 'Supercoupe d\'Espagne',
    shortName: 'SCE',
    country: 'Espagne',
    flag: '🇪🇸',
    category: 'national_cups',
    priority: 35,
    color: 'from-red-600 to-yellow-500',
    totalMatchdays: 4,
    isActive: true,
  },
  529: {
    id: 529,
    name: 'Supercoupe d\'Allemagne',
    shortName: 'DFL',
    country: 'Allemagne',
    flag: '🇩🇪',
    category: 'national_cups',
    priority: 36,
    color: 'from-black to-red-600',
    totalMatchdays: 1,
    isActive: true,
  },
  528: {
    id: 528,
    name: 'Community Shield',
    shortName: 'CS',
    country: 'Angleterre',
    flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    category: 'national_cups',
    priority: 37,
    color: 'from-red-600 to-blue-600',
    totalMatchdays: 1,
    isActive: true,
  },
  547: {
    id: 547,
    name: 'Supercoppa Italiana',
    shortName: 'SCI',
    country: 'Italie',
    flag: '🇮🇹',
    category: 'national_cups',
    priority: 38,
    color: 'from-green-600 to-red-600',
    totalMatchdays: 1,
    isActive: true,
  },
  526: {
    id: 526,
    name: 'Trophée des Champions',
    shortName: 'TDC',
    country: 'France',
    flag: '🇫🇷',
    category: 'france',
    priority: 22,
    color: 'from-blue-600 to-red-500',
    totalMatchdays: 1,
    isActive: true,
  },

  // === COUPES NATIONALES ===
  45: {
    id: 45,
    name: 'FA Cup',
    shortName: 'FAC',
    country: 'Angleterre',
    flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    category: 'national_cups',
    priority: 40,
    color: 'from-red-600 to-red-800',
    totalMatchdays: 8,
    isActive: true,
  },
  48: {
    id: 48,
    name: 'League Cup',
    shortName: 'EFL',
    country: 'Angleterre',
    flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    category: 'national_cups',
    priority: 41,
    color: 'from-green-500 to-green-700',
    totalMatchdays: 7,
    isActive: true,
  },
  143: {
    id: 143,
    name: 'Copa del Rey',
    shortName: 'CDR',
    country: 'Espagne',
    flag: '🇪🇸',
    category: 'national_cups',
    priority: 42,
    color: 'from-red-700 to-yellow-600',
    totalMatchdays: 7,
    isActive: true,
  },
  137: {
    id: 137,
    name: 'Coppa Italia',
    shortName: 'CI',
    country: 'Italie',
    flag: '🇮🇹',
    category: 'national_cups',
    priority: 43,
    color: 'from-green-700 to-red-600',
    totalMatchdays: 8,
    isActive: true,
  },
  81: {
    id: 81,
    name: 'DFB Pokal',
    shortName: 'DFB',
    country: 'Allemagne',
    flag: '🇩🇪',
    category: 'national_cups',
    priority: 44,
    color: 'from-black to-red-600',
    totalMatchdays: 6,
    isActive: true,
  },
};

// =============================================
// CATÉGORIES
// =============================================

export const CATEGORIES: Record<CompetitionCategory, { name: string; icon: string; description: string }> = {
  top: {
    name: 'Top Championnats',
    icon: '⭐',
    description: 'Les 5 grands championnats européens',
  },
  europe: {
    name: 'Coupes d\'Europe',
    icon: '🏆',
    description: 'Champions League, Europa League, Conference League',
  },
  france: {
    name: 'France',
    icon: '🇫🇷',
    description: 'Ligue 1, Ligue 2, Coupe de France',
  },
  international: {
    name: 'Internationales',
    icon: '🌍',
    description: 'Coupe du Monde, Euro, CAN, Copa America',
  },
  other_leagues: {
    name: 'Autres Championnats',
    icon: '⚽',
    description: 'Portugal, Pays-Bas, Belgique, Turquie, Arabie Saoudite',
  },
  national_cups: {
    name: 'Coupes Nationales',
    icon: '🏅',
    description: 'FA Cup, Copa del Rey, Coppa Italia, DFB Pokal',
  },
};

// =============================================
// FONCTIONS HELPERS
// =============================================

/**
 * Récupère une compétition par son ID
 */
export function getCompetition(id: number): Competition | undefined {
  return COMPETITIONS[id];
}

/**
 * Récupère toutes les compétitions d'une catégorie
 */
export function getCompetitionsByCategory(category: CompetitionCategory): Competition[] {
  return Object.values(COMPETITIONS)
    .filter(c => c.category === category && c.isActive)
    .sort((a, b) => a.priority - b.priority);
}

/**
 * Récupère les compétitions "TOP" (affichées en priorité)
 * Inclut les compétitions internationales actives (CAN, Coupe du Monde, etc.)
 */
export function getTopCompetitions(): Competition[] {
  // Compétitions internationales actives (priorité 0)
  const internationalActive = Object.values(COMPETITIONS)
    .filter(c => c.category === 'international' && c.isActive && c.priority === 0);

  // Compétitions TOP standards
  const topIds = [2, 3, 61, 39, 140, 135, 78]; // UCL, UEL, L1, PL, Liga, SA, BL
  const topComps = topIds
    .map(id => COMPETITIONS[id])
    .filter(c => c && c.isActive);

  return [...internationalActive, ...topComps].sort((a, b) => a.priority - b.priority);
}

/**
 * Récupère les compétitions pour le MatchTicker (homepage)
 * Priorité: matchs en direct > matchs du jour > prochains matchs
 */
export function getMatchTickerCompetitions(): Competition[] {
  // Compétitions internationales actives + TOP + Europe pour le ticker
  const tickerIds = [6, 2, 3, 61, 39, 140, 135, 78, 848, 5]; // CAN + Coupes EU + Top 5 + UNL
  return tickerIds
    .map(id => COMPETITIONS[id])
    .filter(c => c && c.isActive);
}

/**
 * Récupère les compétitions pour les classements
 */
export function getStandingsCompetitions(): Competition[] {
  // Championnats avec classements (pas les coupes)
  const standingsIds = [61, 39, 140, 135, 78, 62, 94, 88, 144, 203, 307];
  return standingsIds
    .map(id => COMPETITIONS[id])
    .filter(c => c && c.isActive)
    .sort((a, b) => a.priority - b.priority);
}

/**
 * Récupère les compétitions France
 */
export function getFranceCompetitions(): Competition[] {
  return [COMPETITIONS[61], COMPETITIONS[62], COMPETITIONS[66]].filter(c => c && c.isActive);
}

/**
 * Récupère les compétitions internationales actives
 */
export function getInternationalCompetitions(): Competition[] {
  return Object.values(COMPETITIONS)
    .filter(c => c.category === 'international' && c.isActive)
    .sort((a, b) => a.priority - b.priority);
}

/**
 * Récupère toutes les compétitions actives triées par priorité
 */
export function getAllActiveCompetitions(): Competition[] {
  return Object.values(COMPETITIONS)
    .filter(c => c.isActive)
    .sort((a, b) => a.priority - b.priority);
}

/**
 * Récupère les IDs des compétitions d'une catégorie
 */
export function getCompetitionIds(category?: CompetitionCategory): number[] {
  if (!category) {
    return Object.values(COMPETITIONS)
      .filter(c => c.isActive)
      .map(c => c.id);
  }
  return getCompetitionsByCategory(category).map(c => c.id);
}

/**
 * Récupère les IDs des compétitions TOP (inclut les compétitions internationales actives)
 */
export function getTopCompetitionIds(): number[] {
  const baseIds = [2, 3, 61, 39, 140, 135, 78];

  // Ajouter les compétitions internationales actives en premier
  const internationalActive = Object.values(COMPETITIONS)
    .filter(c => c.category === 'international' && c.isActive && c.priority === 0)
    .map(c => c.id);

  return [...internationalActive, ...baseIds];
}

/**
 * Récupère les IDs des compétitions MAJEURES pour le ticker des résultats
 * - Top 5 championnats européens
 * - Coupes d'Europe (UCL, UEL, UECL)
 * - Compétitions internationales (CAN, Euro, Coupe du Monde, Copa America, Nations League)
 */
export function getMajorCompetitionIds(): number[] {
  // Top 5 championnats
  const top5 = [61, 39, 140, 135, 78]; // L1, PL, Liga, Serie A, Bundesliga

  // Coupes d'Europe
  const europeanCups = [2, 3, 848]; // UCL, UEL, UECL

  // Compétitions internationales actives
  const internationalActive = Object.values(COMPETITIONS)
    .filter(c => c.category === 'international' && c.isActive)
    .map(c => c.id);

  return [...internationalActive, ...europeanCups, ...top5];
}

/**
 * Vérifie si une compétition est dans le TOP
 */
export function isTopCompetition(id: number): boolean {
  return getTopCompetitionIds().includes(id);
}

/**
 * Récupère l'ordre d'affichage des compétitions pour la page matchs
 */
export function getMatchesDisplayOrder(): number[] {
  return [
    // Compétitions internationales en cours (priorité maximale)
    6,    // CAN (en cours)
    1,    // Coupe du Monde
    4,    // Euro

    // Coupes d'Europe
    2,    // Champions League
    3,    // Europa League
    848,  // Conference League

    // Top 5 championnats
    61,   // Ligue 1
    39,   // Premier League
    140,  // La Liga
    135,  // Serie A
    78,   // Bundesliga

    // France
    62,   // Ligue 2
    66,   // Coupe de France
    526,  // Trophée des Champions

    // Supercoupes et coupes nationales
    556,  // Supercoupe d'Espagne
    547,  // Supercoppa Italiana
    529,  // Supercoupe d'Allemagne
    528,  // Community Shield
    45,   // FA Cup
    48,   // League Cup
    143,  // Copa del Rey
    137,  // Coppa Italia
    81,   // DFB Pokal

    // Autres championnats
    94,   // Liga Portugal
    88,   // Eredivisie
    144,  // Jupiler League
    203,  // Süper Lig
    307,  // Saudi Pro League

    // Autres compétitions internationales
    5,    // Ligue des Nations
    9,    // Copa America
  ];
}

/**
 * Récupère tous les IDs des compétitions actives (pour le ticker résultats)
 */
export function getAllActiveCompetitionIds(): number[] {
  return Object.values(COMPETITIONS)
    .filter(c => c.isActive)
    .sort((a, b) => a.priority - b.priority)
    .map(c => c.id);
}

/**
 * Trie les matchs par compétition selon l'ordre d'affichage
 */
export function sortMatchesByCompetitionOrder(matches: any[]): any[] {
  const order = getMatchesDisplayOrder();
  return [...matches].sort((a, b) => {
    const orderA = order.indexOf(a.competition?.id) ?? 999;
    const orderB = order.indexOf(b.competition?.id) ?? 999;
    return orderA - orderB;
  });
}

/**
 * Groupe les matchs par compétition
 */
export function groupMatchesByCompetition(matches: any[]): Record<number, any[]> {
  const grouped: Record<number, any[]> = {};

  matches.forEach(match => {
    const compId = match.competition?.id;
    if (compId) {
      if (!grouped[compId]) {
        grouped[compId] = [];
      }
      grouped[compId].push(match);
    }
  });

  return grouped;
}

/**
 * Récupère les compétitions présentes dans une liste de matchs
 */
export function getCompetitionsFromMatches(matches: any[]): Competition[] {
  const compIds = new Set<number>();
  matches.forEach(match => {
    if (match.competition?.id) {
      compIds.add(match.competition.id);
    }
  });

  return Array.from(compIds)
    .map(id => COMPETITIONS[id])
    .filter(c => c)
    .sort((a, b) => {
      const order = getMatchesDisplayOrder();
      return order.indexOf(a.id) - order.indexOf(b.id);
    });
}

// =============================================
// EXPORTS LEGACY (compatibilité)
// =============================================

// Pour compatibilité avec l'ancien code
export const LEAGUES = {
  LIGUE_1: '61',
  PREMIER_LEAGUE: '39',
  LA_LIGA: '140',
  SERIE_A: '135',
  BUNDESLIGA: '78',
  CHAMPIONS_LEAGUE: '2',
  EUROPA_LEAGUE: '3',
  CONFERENCE_LEAGUE: '848',
  LIGUE_2: '62',
  COUPE_DE_FRANCE: '66',
} as const;

export const LEAGUE_INFO: Record<string, { name: string; flag: string; color: string; totalMatchdays: number }> = {};

// Remplir LEAGUE_INFO depuis COMPETITIONS
Object.values(COMPETITIONS).forEach(comp => {
  LEAGUE_INFO[String(comp.id)] = {
    name: comp.name,
    flag: comp.flag,
    color: comp.color,
    totalMatchdays: comp.totalMatchdays,
  };
});

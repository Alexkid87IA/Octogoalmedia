// Configuration de la navigation Octogoal
// Modifier ce fichier pour changer les menus sans toucher aux composants

export interface NavLink {
  label: string;
  path: string;
}

export interface NavColumn {
  title: string;
  links: NavLink[];
}

export interface NavItem {
  label: string;
  path: string;
  hasDropdown: boolean;
  columns?: NavColumn[];
}

// ============================================
// ÉLÉMENTS MIS EN AVANT (Match Center + Émissions)
// ============================================

export const highlightedItems = {
  matchCenter: {
    label: 'Match Center',
    path: '/matchs',
    icon: 'zap', // icône pour le composant
    description: 'Résultats en direct',
  },
  emissions: {
    label: 'Émissions',
    path: '/emissions',
    icon: 'play',
    description: 'Nos vidéos',
  },
};

// ============================================
// STRUCTURE DE NAVIGATION PRINCIPALE
// ============================================

export const mainNavItems: NavItem[] = [
  {
    label: 'Actus',
    path: '/rubrique/actus',
    hasDropdown: true,
    columns: [
      {
        title: 'Transferts',
        links: [
          { label: 'Mercato', path: '/rubrique/actus/mercato' },
          { label: 'Rumeurs', path: '/rubrique/actus/rumeurs' },
          { label: 'Officialisations', path: '/rubrique/actus/officialisations' },
        ],
      },
      {
        title: 'Championnats',
        links: [
          { label: 'Ligue 1', path: '/rubrique/actus/ligue-1' },
          { label: 'Premier League', path: '/rubrique/actus/premier-league' },
          { label: 'La Liga', path: '/rubrique/actus/liga' },
          { label: 'Serie A', path: '/rubrique/actus/serie-a' },
          { label: 'Bundesliga', path: '/rubrique/actus/bundesliga' },
        ],
      },
      {
        title: 'Contenus',
        links: [
          { label: 'Mèmes', path: '/rubrique/memes' },
          { label: 'Culture foot', path: '/rubrique/formats-octogoal/culture-foot' },
          { label: 'Moments viraux', path: '/rubrique/formats-octogoal/moments-viraux' },
        ],
      },
    ],
  },
  {
    label: 'Clubs',
    path: '/clubs',
    hasDropdown: true,
    columns: [
      {
        title: 'France',
        links: [
          { label: 'PSG', path: '/classements/club/85' },
          { label: 'Marseille', path: '/classements/club/81' },
          { label: 'Lyon', path: '/classements/club/80' },
          { label: 'Lille', path: '/classements/club/79' },
          { label: 'Monaco', path: '/classements/club/91' },
        ],
      },
      {
        title: 'Europe',
        links: [
          { label: 'Real Madrid', path: '/classements/club/541' },
          { label: 'Barcelone', path: '/classements/club/529' },
          { label: 'Juventus', path: '/classements/club/496' },
          { label: 'AC Milan', path: '/classements/club/489' },
          { label: 'Inter Milan', path: '/classements/club/505' },
        ],
      },
      {
        title: 'Top Clubs',
        links: [
          { label: 'Manchester City', path: '/classements/club/50' },
          { label: 'Bayern Munich', path: '/classements/club/157' },
          { label: 'Liverpool', path: '/classements/club/40' },
        ],
      },
    ],
  },
  {
    label: 'Joueurs',
    path: '/joueurs',
    hasDropdown: true,
    columns: [
      {
        title: 'Classements Europe',
        links: [
          { label: 'Meilleurs buteurs', path: '/classements/europe?tab=scorers' },
          { label: 'Meilleurs passeurs', path: '/classements/europe?tab=assists' },
          { label: 'Meilleures notes', path: '/classements/europe?tab=ratings' },
          { label: 'Top contributeurs', path: '/classements/europe?tab=contributors' },
        ],
      },
      {
        title: 'Par position',
        links: [
          { label: 'Attaquants', path: '/joueurs?position=attacker' },
          { label: 'Milieux', path: '/joueurs?position=midfielder' },
          { label: 'Défenseurs', path: '/joueurs?position=defender' },
          { label: 'Gardiens', path: '/joueurs?position=goalkeeper' },
        ],
      },
      {
        title: 'Par ligue',
        links: [
          { label: 'Ligue 1', path: '/joueurs?league=61' },
          { label: 'Premier League', path: '/joueurs?league=39' },
          { label: 'La Liga', path: '/joueurs?league=140' },
          { label: 'Serie A', path: '/joueurs?league=135' },
        ],
      },
    ],
  },
  {
    label: 'Formats',
    path: '/formats',
    hasDropdown: true,
    columns: [
      {
        title: 'Entertainment',
        links: [
          { label: 'Tops et listes', path: '/rubrique/formats-octogoal/tops-listes' },
          { label: 'Moments viraux', path: '/rubrique/formats-octogoal/moments-viraux' },
          { label: 'Humour', path: '/rubrique/formats-octogoal/humour-punchlines' },
        ],
      },
      {
        title: 'Analyses',
        links: [
          { label: 'Débats', path: '/rubrique/formats-octogoal/debats-reactions' },
          { label: 'Le joueur du jour', path: '/rubrique/formats-octogoal/joueur-du-jour' },
        ],
      },
      {
        title: 'Culture',
        links: [
          { label: 'Culture foot', path: '/rubrique/formats-octogoal/culture-foot' },
        ],
      },
    ],
  },
  {
    label: 'Classements',
    path: '/classements',
    hasDropdown: false,
  },
];

// ============================================
// LEGACY - matchCenterConfig (pour compatibilité)
// Utiliser highlightedItems à la place
// ============================================

export const matchCenterConfig = highlightedItems.matchCenter;

// ============================================
// CTA BUTTON (facilement modifiable)
// ============================================

export const ctaConfig = {
  label: 'Discord',
  path: 'https://discord.gg/octogoal', // À remplacer par le vrai lien
  external: true,
};

// ============================================
// LIENS SOCIAUX (pour le footer ou autres)
// ============================================

export const socialLinks = {
  discord: 'https://discord.gg/octogoal',
  tiktok: 'https://tiktok.com/@octogoal',
  x: 'https://x.com/octogoal',
  facebook: 'https://facebook.com/octogoal',
  youtube: 'https://youtube.com/@octogoal',
  instagram: 'https://instagram.com/octogoal',
};

// Liste ordonnée pour l'affichage
export const socialLinksList = [
  { name: 'Discord', url: socialLinks.discord, icon: 'discord' },
  { name: 'TikTok', url: socialLinks.tiktok, icon: 'tiktok' },
  { name: 'X', url: socialLinks.x, icon: 'x' },
  { name: 'Facebook', url: socialLinks.facebook, icon: 'facebook' },
  { name: 'YouTube', url: socialLinks.youtube, icon: 'youtube' },
  { name: 'Instagram', url: socialLinks.instagram, icon: 'instagram' },
];

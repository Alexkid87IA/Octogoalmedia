/**
 * Types partagés pour les données Sanity
 * Ce fichier centralise toutes les interfaces TypeScript pour les données provenant de Sanity CMS
 */

// Type de base pour les références Sanity
export interface SanityReference {
  _ref: string;
  _type: "reference";
}

// Type de base pour les slugs Sanity
export interface SanitySlug {
  _type: "slug";
  current: string;
}

// Type de base pour les images Sanity
export interface SanityImage {
  _type: "image";
  asset: SanityReference;
  crop?: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
  hotspot?: {
    x: number;
    y: number;
    height: number;
    width: number;
  };
  alt?: string;
  caption?: string;     // Légende de l'image
  url?: string;         // URL directe (parfois utilisée)
}

// Type pour les catégories
export interface SanityCategory {
  _id: string;
  title: string;
  description?: string;
  slug: SanitySlug;
  color?: string;       // Couleur de la catégorie (pour les badges)
  icon?: string;        // Icône de la catégorie
  order?: number;       // Ordre d'affichage
}

// Type pour les sous-catégories
export interface SanitySubcategory {
  _id: string;
  title: string;
  slug: SanitySlug;
  description?: string;
  parentCategory?: {
    _id: string;
    title: string;
    slug: SanitySlug;
  };
  articleCount?: number;  // Nombre d'articles dans cette sous-catégorie
  isActive?: boolean;     // Si la sous-catégorie est active
}

// Type pour les auteurs
export interface SanityAuthor {
  _id: string;
  name: string;
  bio?: string;
  image?: SanityImage;
  slug?: SanitySlug;    // Pour les pages d'auteur
  role?: string;        // Rôle de l'auteur
}

// Type pour les articles
export interface SanityArticle {
  _id: string;
  title: string;
  slug: SanitySlug;
  mainImage?: SanityImage;
  excerpt?: string;
  body?: any;                           // Corps de l'article en format Portable Text
  content?: any;                        // Alternative à body
  publishedAt?: string;
  categories?: SanityCategory[];
  subcategories?: SanitySubcategory[];  // Sous-catégories
  author?: SanityAuthor;
  readingTime?: string;                 // Temps de lecture (ex: "5 min")
  featured?: boolean;                   // Si l'article est à la une
  isFeatured?: boolean;                 // Alternative (Sanity utilise parfois ce nom)
  isTrending?: boolean;                 // Si l'article est tendance
  trendingOrder?: number;               // Ordre dans les tendances
  keyPoints?: string[];                 // Points clés de l'article
  contentType?: string;                 // Type de contenu (article, emission, etc.)
  videoUrl?: string;                    // URL vidéo externe
  duration?: string;                    // Durée (pour podcasts/vidéos)
  guest?: string;                       // Invité (pour podcasts)
  stats?: {                            // Statistiques
    views?: number;
    likes?: number;
    comments?: number;
  };
}

// Type pour les débats
export interface SanityDebate {
  _id: string;
  title: string;
  description?: string;
  image?: SanityImage;
  slug: SanitySlug;
  opinions?: SanityOpinion[];
  moderator?: SanityAuthor;
  stats?: {
    for: number;
    against: number;
    neutral: number;
    totalVotes?: number;
    comments?: number;
    shares?: string;
  };
  isActive?: boolean;    // Si le débat est actif
  featured?: boolean;    // Si le débat est à la une
}

// Type pour les opinions dans les débats
export interface SanityOpinion {
  _key: string;
  author: {
    name: string;
    title?: string;
    role?: string;
    image?: SanityImage;
  };
  position: 'for' | 'against' | 'neutral' | 'Pour' | 'Contre';
  text?: string;
  arguments?: string[];
  votes?: number;
}

// Type pour les VS Polls (sondages VS)
export interface SanityVSPollOption {
  name: string;
  subtitle?: string;
  image: SanityImage;
  color?: string;
  votes: number;
}

export interface SanityVSPoll {
  _id: string;
  title: string;
  question: string;
  slug: SanitySlug;
  option1: SanityVSPollOption;
  option2: SanityVSPollOption;
  context?: string;
  featured: boolean;
  active: boolean;
  publishedAt?: string;
  endsAt?: string;
}

// Type pour les univers éditoriaux
export interface SanityUniverse {
  _id: string;
  title: string;
  subtitle?: string;     // Sous-titre
  description: string;
  image?: SanityImage;
  slug: SanitySlug;
  order?: number;
  icon?: string;        // Nom de l'icône
  color?: string;       // Couleur thématique
  gradient?: string;    // Gradient CSS
}

// Type pour les podcasts
export interface SanityPodcast {
  _id: string;
  title: string;
  mainImage?: SanityImage;
  thumbnail?: string;          // URL directe de la miniature
  excerpt?: string;
  description?: string;         // Description plus longue
  slug: SanitySlug;
  audioUrl?: string;
  videoUrl?: string;           // URL vidéo
  duration?: number | string;  // Durée en secondes ou format texte
  publishedAt?: string;
  guest?: string;              // Nom de l'invité
  category?: string;           // Catégorie du podcast
  episodeNumber?: number;      // Numéro d'épisode
  featured?: boolean;          // Si le podcast est à la une
  listens?: number;           // Nombre d'écoutes
  likes?: number;             // Nombre de likes
}

// Type pour les études de cas
export interface SanityCaseStudy {
  _id: string;
  title: string;
  mainImage?: SanityImage;
  excerpt?: string;
  slug: SanitySlug;
  company?: string;
  industry?: string;
  challenge?: string;     // Défi à relever
  solution?: string;      // Solution apportée
  results?: string[];     // Résultats obtenus
  publishedAt?: string;
  metrics?: {            // Métriques de succès
    label: string;
    value: string;
  }[];
}

// Type pour les success stories
export interface SanitySuccessStory {
  _id: string;
  title: string;
  subtitle?: string;
  mainImage?: SanityImage;
  excerpt?: string;
  content?: string;       // Contenu complet
  slug: SanitySlug;
  person?: string;        // Nom de la personne
  achievement?: string;   // Réalisation principale
  publishedAt?: string;
  author?: SanityAuthor;
  metrics?: {            // Métriques de succès
    label: string;
    value: string;
  }[];
}

// Type pour les fonctionnalités du club
export interface SanityClubFeature {
  _id: string;
  title: string;
  description: string;
  icon?: string;
  order?: number;
  available?: boolean;    // Si la fonctionnalité est disponible
  gradient?: string;      // Gradient pour l'affichage
}

// Type pour les tarifs du club
export interface SanityClubPricing {
  _id: string;
  title?: string;         // Nom du plan
  price: number;
  currency: string;
  period: 'month' | 'year' | 'monthly' | 'yearly' | 'one-time';
  features: string[];
  isActive: boolean;
  highlighted?: boolean;  // Si le plan est mis en avant
  buttonText?: string;    // Texte du bouton CTA
  discount?: number;      // Pourcentage de réduction
}

// Type pour les citations
export interface SanityQuote {
  _id: string;
  text: string;
  author: string;
  role?: string;         // Rôle de l'auteur
  avatar?: string;       // Initiales ou image
  publishedAt?: string;
}

// Type pour les amuse-bouches (contenus courts)
export interface SanityAmuseBouche {
  _id: string;
  title: string;
  slug: SanitySlug;
  mainImage?: SanityImage;
  coverImage?: SanityImage;   // Alternative à mainImage
  description?: string;
  excerpt?: string;
  duration?: string;           // Durée de lecture/visionnage
  videoUrl?: string;          // URL vidéo si applicable
  publishedAt?: string;
  contentType?: string;       // Type de contenu court
}

// Type pour les émissions Octogoal (Momo)
export interface SanityEmission {
  _id: string;
  title: string;
  description?: string;
  thumbnail?: string;         // URL de la miniature
  slug: string;              // Slug simple ou SanitySlug
  episodeNumber?: number;     // Numéro de l'épisode
  youtubeUrl?: string;        // URL YouTube de la vidéo complète
  duration?: string;          // Durée au format "1h23" ou "58min"
  publishedAt?: string;
  featured?: boolean;
  views?: number;
  likes?: number;
  themes?: string[];          // Thèmes abordés dans l'émission
}

// Type pour les extraits (shorts/clips)
export interface SanityExtrait {
  _id: string;
  title: string;
  youtubeShortUrl?: string;   // Lien YouTube Shorts ou lien classique
  thumbnail?: string;         // Miniature verticale
  duration?: string;          // Durée au format "0:58"
  emission?: SanityReference; // Référence vers l'émission source
  publishedAt?: string;
}

// ============================================
// TYPES CMS v2.1 - Joueurs, Clubs, Homepage
// ============================================

// Type pour les joueurs (fiche simplifiée v2.1)
export interface SanityPlayer {
  _id: string;
  name: string;
  apiFootballId: number;        // ID pour récupérer les stats via API-Football
  // Contenu éditorial Octogoal
  customBio?: string;           // Présentation Octogoal
  playingStyle?: string;        // Description du style de jeu
  strengths?: string[];         // Points forts (max 5)
  weaknesses?: string[];        // Points faibles (max 5)
  funFacts?: string[];          // Anecdotes amusantes
  famousQuotes?: string[];      // Citations célèbres
  octogoalVerdict?: string;     // Notre verdict final
  // Flags éditoriaux
  isPepite?: boolean;           // Pépite / jeune talent
  isLegend?: boolean;           // Joueur légendaire
  isFeatured?: boolean;         // Mis en avant
  // Liens
  relatedArticles?: SanityArticle[];
  tags?: SanityTag[];
}

// Type pour les clubs (fiche simplifiée v2.1)
export interface SanityClub {
  _id: string;
  name: string;
  apiFootballId: number;        // ID pour récupérer les stats via API-Football
  slug: SanitySlug;
  // Flags éditoriaux
  isTopClub?: boolean;          // Club majeur européen
  isFeatured?: boolean;         // Mis en avant
  // Contenu éditorial Octogoal
  customBio?: string;           // Présentation Octogoal
  history?: string;             // Résumé de l'histoire
  rivalries?: string[];         // Rivalités (El Clasico, etc.)
  funFacts?: string[];          // Anecdotes exclusives
  octogoalVerdict?: string;     // Notre avis sur le club
  // Liens
  relatedArticles?: SanityArticle[];
  tags?: SanityTag[];
}

// Type pour les liens joueurs dans articles
export interface PlayerLink {
  _key?: string;
  player: {
    _id: string;
    name: string;
    apiFootballId: number;
  };
}

// Type pour les liens clubs dans articles
export interface ClubLink {
  _key?: string;
  club: {
    _id: string;
    name: string;
    apiFootballId: number;
    slug: SanitySlug;
  };
}

// Type pour les infos de match dans articles
export interface MatchInfo {
  homeTeam?: {
    _id: string;
    name: string;
    apiFootballId: number;
  };
  awayTeam?: {
    _id: string;
    name: string;
    apiFootballId: number;
  };
  score?: string;
  competition?: string;
  matchDate?: string;
}

// Type pour les tags (étendu v2.1)
export interface SanityTag {
  _id: string;
  title: string;
  slug: SanitySlug;
  tagType?: 'player' | 'club' | 'competition' | 'country' | 'theme';
  color?: string;
  image?: SanityImage;
  linkedPlayer?: SanityReference;
  linkedClub?: SanityReference;
  isTrending?: boolean;
}

// ============================================
// TYPES HOMEPAGE v2.1
// ============================================

// Configuration du Hero
export interface HomepageHero {
  heroArticle?: SanityArticle;
  heroStyle?: 'fullwidth' | 'split' | 'grid' | 'slider';
  heroSecondaryArticles?: SanityArticle[];
  showHeroVideo?: boolean;
}

// Breaking News
export interface BreakingNews {
  isActive: boolean;
  text: string;
  linkedArticle?: SanityArticle;
  style: 'red' | 'orange' | 'blue' | 'green';
  expiresAt?: string;
}

// Ticker défilant
export interface NewsTicker {
  isActive: boolean;
  items: Array<{
    _key?: string;
    emoji?: string;
    text: string;
    link?: string;
  }>;
  speed?: 'slow' | 'normal' | 'fast';
}

// Section personnalisable
export interface HomepageSection {
  _key?: string;
  title: string;
  sectionType: 'category' | 'subcategory' | 'manual' | 'players' | 'clubs' | 'emissions';
  category?: SanityCategory;
  subcategory?: SanitySubcategory;
  manualItems?: SanityArticle[];
  manualPlayers?: SanityPlayer[];
  manualClubs?: SanityClub[];
  itemCount?: number;
  layout?: 'grid-3' | 'grid-4' | 'list' | 'carousel' | 'featured-grid';
  backgroundColor?: string;
  showMoreLink?: boolean;
  order?: number;
}

// Widget sidebar
export interface SidebarWidget {
  _key?: string;
  title: string;
  widgetType: 'standings' | 'pepites' | 'player-of-day' | 'matches' | 'upcoming-matches' | 'newsletter' | 'social' | 'ad';
  leagueId?: number;          // Pour standings
  featuredPlayer?: SanityPlayer;
  order?: number;
}

// Popup promotionnel
export interface PromoPopup {
  isActive: boolean;
  title: string;
  content?: string;
  buttonText?: string;
  buttonLink?: string;
  delaySeconds?: number;
  showOnce?: boolean;
}

// Type complet Homepage
export interface SanityHomepage {
  _id: string;
  _type: 'homepage';
  // Hero
  heroArticle?: SanityArticle;
  heroStyle?: 'fullwidth' | 'split' | 'grid' | 'slider';
  heroSecondaryArticles?: SanityArticle[];
  showHeroVideo?: boolean;
  // Tendances
  trendingTitle?: string;
  trendingMode?: 'manual' | 'auto' | 'most-viewed' | 'recent';
  trendingArticles?: SanityArticle[];
  trendingCount?: number;
  trendingStyle?: 'numbered-list' | 'grid' | 'carousel';
  // Sections
  sections?: HomepageSection[];
  // Sidebar
  sidebarSections?: SidebarWidget[];
  // Alertes
  breakingNews?: BreakingNews;
  ticker?: NewsTicker;
  promoPopup?: PromoPopup;
}

// ============================================
// TYPES BLOCS ÉDITEUR v2.1
// ============================================

// Bloc Callout/Alerte
export interface CalloutBlock {
  _type: 'callout';
  _key?: string;
  type: 'info' | 'warning' | 'success' | 'breaking' | 'stat' | 'quote';
  title?: string;
  content: string;
}

// Bloc Citation stylée
export interface StyledQuoteBlock {
  _type: 'styledQuote';
  _key?: string;
  quote: string;
  author?: string;
  role?: string;
  image?: SanityImage;
  source?: string;
  date?: string;
  style?: 'classic' | 'with-background' | 'large' | 'bordered';
}

// Statistique individuelle
export interface StatItem {
  _key?: string;
  value: string;
  label: string;
  icon?: string;
  trend?: 'up' | 'down' | 'neutral';
}

// Bloc Stats Card
export interface StatsCardBlock {
  _type: 'statsCard';
  _key?: string;
  title?: string;
  stats: StatItem[];
  layout?: 'row' | 'grid-2x2' | 'grid-3x2' | 'list';
  source?: string;
  theme?: 'light' | 'dark' | 'octogoal' | 'club';
}

// Joueur pour comparaison
export interface ComparisonPlayer {
  name: string;
  image?: SanityImage;
  club?: string;
  playerRef?: SanityReference;
}

// Stat de comparaison
export interface ComparisonStat {
  _key?: string;
  label: string;
  value1: string | number;
  value2: string | number;
  advantage?: 'player1' | 'player2' | 'equal';
}

// Bloc Comparaison joueurs
export interface PlayerComparisonBlock {
  _type: 'playerComparison';
  _key?: string;
  title?: string;
  player1: ComparisonPlayer;
  player2: ComparisonPlayer;
  stats: ComparisonStat[];
  verdict?: {
    winner?: 'player1' | 'player2' | 'draw';
    comment?: string;
  };
  season?: string;
}

// Image de galerie
export interface GalleryImage {
  _key?: string;
  image: SanityImage;
  caption?: string;
}

// Bloc Galerie d'images
export interface ImageGalleryBlock {
  _type: 'imageGallery';
  _key?: string;
  title?: string;
  images: GalleryImage[];
  layout?: 'carousel' | 'grid-2' | 'grid-3' | 'masonry';
  showCaptions?: boolean;
  lightbox?: boolean;
}

// Bloc Bouton CTA
export interface CtaButtonBlock {
  _type: 'ctaButton';
  _key?: string;
  text: string;
  linkType: 'url' | 'article' | 'player' | 'club';
  url?: string;
  linkedArticle?: SanityReference;
  linkedPlayer?: SanityReference;
  linkedClub?: SanityReference;
  style?: 'primary' | 'secondary' | 'ghost' | 'gradient';
  size?: 'small' | 'normal' | 'large' | 'full-width';
  icon?: 'arrow' | 'play' | 'read' | 'football' | 'link' | 'none';
  openInNewTab?: boolean;
}

// Bloc Spoiler
export interface SpoilerBlock {
  _type: 'spoiler';
  _key?: string;
  type: 'pronostic' | 'result' | 'spoiler' | 'answer' | 'read-more';
  title: string;
  content: string;
  buttonText?: string;
}

// Item d'accordéon
export interface AccordionItem {
  _key?: string;
  question: string;
  answer: string;
}

// Bloc Accordéon/FAQ
export interface AccordionBlock {
  _type: 'accordion';
  _key?: string;
  title?: string;
  items: AccordionItem[];
  allowMultiple?: boolean;
  style?: 'simple' | 'bordered' | 'cards' | 'numbered';
}

// Cellule de tableau
export interface TableCell {
  _key?: string;
  content: string;
  isHeader?: boolean;
  align?: 'left' | 'center' | 'right';
}

// Ligne de tableau
export interface TableRow {
  _key?: string;
  cells: TableCell[];
}

// Bloc Tableau
export interface TableBlock {
  _type: 'table';
  _key?: string;
  title?: string;
  rows: TableRow[];
  hasHeader?: boolean;
  striped?: boolean;
  bordered?: boolean;
}

// Union de tous les types de blocs
export type EditorBlock =
  | CalloutBlock
  | StyledQuoteBlock
  | StatsCardBlock
  | PlayerComparisonBlock
  | ImageGalleryBlock
  | CtaButtonBlock
  | SpoilerBlock
  | AccordionBlock
  | TableBlock;
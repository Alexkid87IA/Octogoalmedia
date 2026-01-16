// src/types/article.types.ts

import { PortableTextContent } from './sanity';

// Type pour le hotspot d'image Sanity
export interface SanityImageHotspot {
  x: number; // Valeur entre 0 et 1
  y: number; // Valeur entre 0 et 1
  height: number;
  width: number;
}

// Type pour le crop d'image Sanity
export interface SanityImageCrop {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

// Type pour l'image Sanity avec hotspot
export interface SanityImage {
  asset: {
    _ref: string;
    _type?: string;
  };
  hotspot?: SanityImageHotspot;
  crop?: SanityImageCrop;
}

// Types pour les données Sanity
export interface SanityArticle {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt?: string;
  body?: PortableTextContent;
  content?: PortableTextContent;
  mainImage?: SanityImage; // Utilise le nouveau type avec hotspot
  mainImageUrl?: string;   // URL directe de l'image (fallback)
  publishedAt?: string;
  author?: {
    _id?: string;
    name: string;
    image?: SanityImage;
    imageUrl?: string;
    bio?: string;
    role?: string;
  };
  categories?: Array<{
    _id: string;
    title: string;
    slug: { current: string };
  }>;
  subcategories?: Array<{
    _id: string;
    title: string;
    slug: { current: string };
    parentCategory?: {
      _id: string;
      title: string;
      slug: { current: string };
    };
  }>;
  tags?: Array<{
    _id?: string;
    title: string;
    slug: { current: string };
  }>;
  readingTime?: number | string;
  views?: number;
  likes?: number;
  keyPoints?: string[];
  videoUrl?: string;
  // Champs v2.1
  contentType?: 'actu' | 'emission' | 'flash' | 'analyse' | 'portrait' | 'meme' | 'top';
  isFeatured?: boolean;
  isTrending?: boolean;
  isEssential?: boolean;
  duration?: string;
  guest?: string;
  stats?: {
    views?: number;
    likes?: number;
    comments?: number;
  };
  // Liens joueurs/clubs v2.1
  linkedPlayers?: Array<{
    _key?: string;
    player: {
      _id: string;
      name: string;
      apiFootballId: number;
    };
  }>;
  linkedClubs?: Array<{
    _key?: string;
    club: {
      _id: string;
      name: string;
      apiFootballId: number;
      slug: { current: string };
    };
  }>;
  // Infos match v2.1 (pour analyses)
  matchInfo?: {
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
  };
}

// Type pour les couleurs de verticale
export interface VerticalColors {
  gradient: string;
  bgGradient: string;
  primary: string;
  secondary: string;
  bgLight: string;
  bgMedium: string;
  borderColor: string;
  textColor: string;
}

// Type pour les headings de la table des matières
export interface TableOfContentsHeading {
  id: string;
  text: string;
  subheadings: Array<{
    id: string;
    text: string;
  }>;
}

// Type pour les liens de partage
export interface ShareLink {
  name: string;
  icon: React.FC<{ size?: number; className?: string }>;
  color: string;
  url: string;
}
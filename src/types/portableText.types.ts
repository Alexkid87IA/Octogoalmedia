/**
 * Types pour les composants Portable Text
 * Utilisés par @portabletext/react
 */

import { ReactNode } from 'react';

// =============================================
// TYPES DE BASE PORTABLE TEXT
// =============================================

export interface PortableTextMark {
  _key?: string;
  _type: string;
  href?: string;
}

export interface PortableTextSpan {
  _type: 'span';
  _key?: string;
  text: string;
  marks?: string[];
}

export interface PortableTextBlockValue {
  _type: 'block';
  _key?: string;
  style?: string;
  listItem?: string;
  level?: number;
  markDefs?: PortableTextMark[];
  children?: PortableTextSpan[];
}

// =============================================
// PROPS POUR LES COMPOSANTS PORTABLE TEXT
// =============================================

/** Props pour les composants de bloc (h1, h2, h3, h4, normal, blockquote) */
export interface PortableTextBlockProps {
  children?: ReactNode;
  value?: PortableTextBlockValue;
}

/** Props pour les composants de liste */
export interface PortableTextListProps {
  children?: ReactNode;
}

/** Props pour les items de liste */
export interface PortableTextListItemProps {
  children?: ReactNode;
  index?: number;
}

/** Props pour les marques inline (strong, em, code, link) */
export interface PortableTextMarkProps {
  children?: ReactNode;
  value?: {
    _type?: string;
    _key?: string;
    href?: string;
  };
}

// =============================================
// TYPES POUR LES BLOCS PERSONNALISÉS
// =============================================

/** Props pour le bloc image */
export interface ImageBlockValue {
  _type: 'image';
  _key?: string;
  asset?: {
    _ref: string;
    _type: 'reference';
  };
  alt?: string;
  caption?: string;
  hotspot?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  crop?: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
}

export interface ImageBlockProps {
  value: ImageBlockValue;
}

/** Props pour le bloc code */
export interface CodeBlockValue {
  _type: 'code';
  _key?: string;
  code: string;
  language?: string;
  filename?: string;
}

export interface CodeBlockProps {
  value: CodeBlockValue;
}

/** Props pour les embeds (instagram, youtube, twitter) */
export interface EmbedBlockValue {
  _type: string;
  _key?: string;
  url?: string;
  caption?: string;
}

export interface EmbedBlockProps {
  value: EmbedBlockValue;
}

// =============================================
// BLOCS ÉDITEUR PERSONNALISÉS
// =============================================

/** Callout Block */
export interface CalloutBlockValue {
  _type: 'callout';
  _key?: string;
  type: 'info' | 'warning' | 'success' | 'breaking' | 'stat' | 'quote';
  title?: string;
  content: string;
}

/** Styled Quote Block */
export interface StyledQuoteBlockValue {
  _type: 'styledQuote';
  _key?: string;
  quote: string;
  author?: string;
  role?: string;
  image?: ImageBlockValue;
  source?: string;
  date?: string;
  style?: 'classic' | 'with-background' | 'large' | 'bordered';
}

/** Stats Card Block */
export interface StatsCardBlockValue {
  _type: 'statsCard';
  _key?: string;
  title?: string;
  stats: Array<{
    _key?: string;
    value: string;
    label: string;
    icon?: string;
    trend?: 'up' | 'down' | 'neutral';
  }>;
  layout?: 'row' | 'grid-2x2' | 'grid-3x2' | 'list';
  source?: string;
  theme?: 'light' | 'dark' | 'octogoal' | 'club';
}

/** Player Comparison Block */
export interface PlayerComparisonBlockValue {
  _type: 'playerComparison';
  _key?: string;
  title?: string;
  player1: {
    name: string;
    image?: ImageBlockValue;
    club?: string;
  };
  player2: {
    name: string;
    image?: ImageBlockValue;
    club?: string;
  };
  stats: Array<{
    _key?: string;
    label: string;
    value1: string | number;
    value2: string | number;
    advantage?: 'player1' | 'player2' | 'equal';
  }>;
  verdict?: {
    winner?: 'player1' | 'player2' | 'draw';
    comment?: string;
  };
  season?: string;
}

/** Image Gallery Block */
export interface ImageGalleryBlockValue {
  _type: 'imageGallery';
  _key?: string;
  title?: string;
  images: Array<{
    _key?: string;
    image: ImageBlockValue;
    caption?: string;
  }>;
  layout?: 'carousel' | 'grid-2' | 'grid-3' | 'masonry';
  showCaptions?: boolean;
  lightbox?: boolean;
}

/** CTA Button Block */
export interface CtaButtonBlockValue {
  _type: 'ctaButton';
  _key?: string;
  text: string;
  linkType: 'url' | 'article' | 'player' | 'club';
  url?: string;
  style?: 'primary' | 'secondary' | 'ghost' | 'gradient';
  size?: 'small' | 'normal' | 'large' | 'full-width';
  icon?: 'arrow' | 'play' | 'read' | 'football' | 'link' | 'none';
  openInNewTab?: boolean;
}

/** Spoiler Block */
export interface SpoilerBlockValue {
  _type: 'spoiler';
  _key?: string;
  type: 'pronostic' | 'result' | 'spoiler' | 'answer' | 'read-more';
  title: string;
  content: string;
  buttonText?: string;
}

/** Accordion Block */
export interface AccordionBlockValue {
  _type: 'accordion';
  _key?: string;
  title?: string;
  items: Array<{
    _key?: string;
    question: string;
    answer: string;
  }>;
  allowMultiple?: boolean;
  style?: 'simple' | 'bordered' | 'cards' | 'numbered';
}

/** Data Table Block */
export interface DataTableBlockValue {
  _type: 'dataTable';
  _key?: string;
  title?: string;
  rows: Array<{
    _key?: string;
    cells: Array<{
      _key?: string;
      content: string;
      isHeader?: boolean;
      align?: 'left' | 'center' | 'right';
    }>;
  }>;
  hasHeader?: boolean;
  striped?: boolean;
  bordered?: boolean;
}

/** Team Lineup Block */
export interface TeamLineupBlockValue {
  _type: 'teamLineup';
  _key?: string;
  teamName?: string;
  formation?: string;
  players?: Array<{
    _key?: string;
    name: string;
    number?: number;
    position?: string;
  }>;
}

/** Football Quiz Block */
export interface FootballQuizBlockValue {
  _type: 'footballQuiz';
  _key?: string;
  question: string;
  options: Array<{
    _key?: string;
    text: string;
    isCorrect?: boolean;
  }>;
  explanation?: string;
  image?: ImageBlockValue;
}

/** Mercato Rumor Block */
export interface MercatoRumorBlockValue {
  _type: 'mercatoRumor';
  _key?: string;
  playerName: string;
  playerPhoto?: ImageBlockValue;
  currentClub?: string;
  targetClub?: string;
  transferFee?: string;
  probability?: number;
  source?: string;
  comment?: string;
}

/** Quick Poll Block */
export interface QuickPollBlockValue {
  _type: 'quickPoll';
  _key?: string;
  question: string;
  options: Array<{
    _key?: string;
    text: string;
    votes?: number;
  }>;
  image?: ImageBlockValue;
}

/** Top List Block */
export interface TopListBlockValue {
  _type: 'topList';
  _key?: string;
  title: string;
  items: Array<{
    _key?: string;
    rank: number;
    title: string;
    description?: string;
    image?: ImageBlockValue;
  }>;
}

// =============================================
// PROPS GÉNÉRIQUES POUR LES BLOCS PERSONNALISÉS
// =============================================

export interface CustomBlockProps<T> {
  value: T;
}

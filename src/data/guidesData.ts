// src/data/guidesData.ts

export interface Guide {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  excerpt: string;
  readingTime: number;
  category: string;
  featured: boolean;
  coverImage?: string;
  status: 'published' | 'coming-soon' | 'draft';
  author: string;
  publishedDate?: string;
  tags: string[];
  color: {
    primary: string;
    gradient: string;
  };
}

export const guides: Guide[] = [
  {
    id: 1,
    slug: 'maitrise-digitale',
    title: 'Guide de Survie Digitale',
    subtitle: 'Reprendre le contrôle de vos écrans et réseaux sociaux',
    description: 'Un manuel de guerre cognitive pour transformer vos pires ennemis numériques en armes de développement personnel.',
    excerpt: 'Vous passez 7 heures par jour sur vos écrans. 95% de ce temps est du pur gaspillage cognitif. Ce guide vous apprend à reprendre le contrôle en 30 jours.',
    readingTime: 25,
    category: 'Productivité',
    featured: true,
    status: 'published',
    author: 'Octogoal Team',
    publishedDate: '2025-01-10',
    tags: ['Digital Detox', 'Productivité', 'FOMO', 'Réseaux sociaux', 'Mental'],
    color: {
      primary: '#a855f7',
      gradient: 'from-purple-500 to-violet-500'
    }
  },
  {
    id: 2,
    slug: 'mindset-entrepreneur',
    title: 'Mindset Entrepreneur',
    subtitle: 'Développer une mentalité de gagnant',
    description: 'Les principes mentaux qui séparent les entrepreneurs à succès du reste.',
    excerpt: 'Découvrez les 7 piliers du mindset entrepreneurial qui transforment les idées en empires.',
    readingTime: 30,
    category: 'Mental',
    featured: false,
    status: 'coming-soon',
    author: 'Octogoal Team',
    tags: ['Mindset', 'Entrepreneur', 'Mental', 'Success'],
    color: {
      primary: '#f59e0b',
      gradient: 'from-amber-500 to-orange-500'
    }
  },
  {
    id: 3,
    slug: 'personal-branding',
    title: 'Personal Branding',
    subtitle: 'Construire votre marque personnelle',
    description: 'Comment créer et monétiser votre influence en ligne.',
    excerpt: 'Le guide complet pour transformer votre expertise en autorité reconnue.',
    readingTime: 35,
    category: 'Business',
    featured: false,
    status: 'coming-soon',
    author: 'Octogoal Team',
    tags: ['Personal Branding', 'Influence', 'Business', 'Marketing'],
    color: {
      primary: '#3b82f6',
      gradient: 'from-blue-500 to-cyan-500'
    }
  },
  {
    id: 4,
    slug: 'octogoal-lifestyle',
    title: 'Octogoal Lifestyle',
    subtitle: 'L\'art de vivre à haute valeur',
    description: 'Les habitudes et routines des personnes à haute valeur ajoutée.',
    excerpt: 'Transformez votre quotidien avec les stratégies des 1% les plus performants.',
    readingTime: 40,
    category: 'Lifestyle',
    featured: false,
    status: 'coming-soon',
    author: 'Octogoal Team',
    tags: ['Lifestyle', 'Habitudes', 'Performance', 'Success'],
    color: {
      primary: '#10b981',
      gradient: 'from-emerald-500 to-teal-500'
    }
  }
];

export const getGuideBySlug = (slug: string): Guide | undefined => {
  return guides.find(guide => guide.slug === slug);
};

export const getPublishedGuides = (): Guide[] => {
  return guides.filter(guide => guide.status === 'published');
};

export const getFeaturedGuides = (): Guide[] => {
  return guides.filter(guide => guide.featured);
};

export const getGuidesByCategory = (category: string): Guide[] => {
  return guides.filter(guide => guide.category === category);
};
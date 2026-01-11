// Données pour l'importation dans Sanity CMS
// Ce fichier contient les données mockées extraites des composants React
// formatées pour correspondre aux schémas Sanity

// Données des univers éditoriaux (EditorialSection)
export const universesData = [
  {
    _type: 'universe',
    title: "Story",
    subtitle: "Pour t'inspirer",
    description: "Des histoires authentiques qui redéfinissent le possible",
    image: {
      _type: 'image',
      url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80"
    },
    logo: {
      _type: 'image',
      url: "/src/assets/logos/LOGO_HV STORY.svg"
    },
    slug: {
      _type: 'slug',
      current: "recits"
    },
    gradient: "from-amber-500 to-orange-500",
    order: 1
  },
  {
    _type: 'universe',
    title: "Business",
    subtitle: "Pour faire du chiffre",
    description: "Les stratégies qui font la différence",
    image: {
      _type: 'image',
      url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80"
    },
    logo: {
      _type: 'image',
      url: "/src/assets/logos/LOGO_HV BUSINESS.svg"
    },
    slug: {
      _type: 'slug',
      current: "business"
    },
    gradient: "from-blue-500 to-cyan-500",
    order: 2
  },
  {
    _type: 'universe',
    title: "Mental",
    subtitle: "Pour ta tête",
    description: "Développe une psychologie de champion",
    image: {
      _type: 'image',
      url: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80"
    },
    logo: {
      _type: 'image',
      url: "/src/assets/logos/LOGO_HV PSYCHO.svg"
    },
    slug: {
      _type: 'slug',
      current: "mental"
    },
    gradient: "from-purple-500 to-violet-500",
    order: 3
  },
  {
    _type: 'universe',
    title: "Society",
    subtitle: "Pour ta culture",
    description: "Comprendre les mutations de notre époque",
    image: {
      _type: 'image',
      url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80"
    },
    logo: {
      _type: 'image',
      url: "/src/assets/logos/LOGO_HV SOCIETY.svg"
    },
    slug: {
      _type: 'slug',
      current: "society"
    },
    gradient: "from-emerald-500 to-teal-500",
    order: 4
  }
];

// Données des fonctionnalités du club (ClubSection)
export const clubFeaturesData = [
  {
    _type: 'clubFeature',
    title: "Live hebdomadaire",
    description: "Sessions en direct avec des experts et entrepreneurs à succès",
    icon: "Calendar",
    order: 1
  },
  {
    _type: 'clubFeature',
    title: "Mindset & Stratégie",
    description: "Développez votre psychologie de champion et votre vision business",
    icon: "Brain",
    order: 2
  },
  {
    _type: 'clubFeature',
    title: "Veille exclusive",
    description: "Analyses approfondies et insights stratégiques",
    icon: "Shield",
    order: 3
  },
  {
    _type: 'clubFeature',
    title: "Réseau privilégié",
    description: "Connexions avec des passionnés et experts du sport",
    icon: "Users",
    order: 4
  }
];

// Données de tarification du club (ClubSection)
export const clubPricingData = [
  {
    _type: 'clubPricing',
    price: 19.90,
    period: 'month',
    isPromotion: true,
    promotionLabel: "Offre de lancement limitée",
    regularPrice: 39.90,
    limitDescription: "Pour les 100 premiers membres uniquement",
    isActive: true
  },
  {
    _type: 'clubPricing',
    price: 39.90,
    period: 'month',
    isPromotion: false,
    isActive: false
  }
];

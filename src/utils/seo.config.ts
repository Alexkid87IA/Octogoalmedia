interface SEOConfig {
  title: string;
  description: string;
  image: string;
}

export const staticSEO: Record<string, SEOConfig> = {
  home: {
    title: "Octogoal - Sport, Clash et Divertissement",
    description: "Octogoal, votre média sport, clash et divertissement. Actualités football, analyses et contenus exclusifs.",
    image: "https://octogoal.media/LOGO_OCTOGOAL.png"
  },
  podcasts: {
    title: "Podcasts - Octogoal",
    description: "Tous les podcasts Octogoal : débats, analyses et discussions autour du football et du sport.",
    image: "https://octogoal.media/LOGO_OCTOGOAL.png"
  },
  emissions: {
    title: "Émissions - Octogoal",
    description: "Les émissions Octogoal : réactions, débats et contenus vidéo sur l'actu foot.",
    image: "https://octogoal.media/LOGO_OCTOGOAL.png"
  },
  rogerSaid: {
    title: "Éditos - Octogoal",
    description: "Les prises de position et éditos de la rédaction Octogoal.",
    image: "https://octogoal.media/LOGO_OCTOGOAL.png"
  },
  recommendations: {
    title: "Recommandations - Octogoal",
    description: "Découvrez les recommandations de la rédaction Octogoal.",
    image: "https://octogoal.media/LOGO_OCTOGOAL.png"
  }
};

export const getSEOForCategory = (category: string): SEOConfig => {
  const categories: Record<string, SEOConfig> = {
    actus: {
      title: "Actus Football - Octogoal",
      description: "Toute l'actualité du football : transferts, matchs, résultats et analyses sur Octogoal.",
      image: "https://octogoal.media/LOGO_OCTOGOAL.png"
    },
    matchs: {
      title: "Matchs - Octogoal",
      description: "Suivez tous les matchs en direct, résultats et analyses sur Octogoal.",
      image: "https://octogoal.media/LOGO_OCTOGOAL.png"
    },
    clubs: {
      title: "Clubs - Octogoal",
      description: "Toute l'actu des clubs de football : PSG, OM, Real Madrid, Barça et plus encore.",
      image: "https://octogoal.media/LOGO_OCTOGOAL.png"
    },
    joueurs: {
      title: "Joueurs - Octogoal",
      description: "Portraits, stats et analyses des meilleurs joueurs de football.",
      image: "https://octogoal.media/LOGO_OCTOGOAL.png"
    }
  };

  return categories[category] || categories.actus;
};

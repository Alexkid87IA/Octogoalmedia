interface SEOConfig {
  title: string;
  description: string;
  image: string;
}

interface RouteConfig {
  [key: string]: SEOConfig;
}

export const defaultSEO: SEOConfig = {
  title: "Octogoal - Sport, Clash et Divertissement",
  description: "Octogoal, votre média sport, clash et divertissement. Actualités football, analyses et contenus exclusifs.",
  image: "https://octogoal.media/LOGO_OCTOGOAL.png"
};

export const routeSEO: RouteConfig = {
  "/": defaultSEO,
  "/articles": {
    title: "Articles - Octogoal",
    description: "Tous les articles Octogoal : actus foot, analyses et divertissement.",
    image: defaultSEO.image
  },
  "/rubrique/actus": {
    title: "Actus Football - Octogoal",
    description: "Toute l'actualité du football sur Octogoal.",
    image: defaultSEO.image
  },
  "/rubrique/matchs": {
    title: "Matchs - Octogoal",
    description: "Suivez tous les matchs et résultats sur Octogoal.",
    image: defaultSEO.image
  },
  "/rubrique/clubs": {
    title: "Clubs - Octogoal",
    description: "L'actu de tous les clubs de football sur Octogoal.",
    image: defaultSEO.image
  },
  "/rubrique/joueurs": {
    title: "Joueurs - Octogoal",
    description: "Portraits et analyses des joueurs de football.",
    image: defaultSEO.image
  },
  "/podcasts": {
    title: "Podcasts - Octogoal",
    description: "Les podcasts Octogoal : débats et analyses football.",
    image: defaultSEO.image
  },
  "/emissions": {
    title: "Émissions - Octogoal",
    description: "Les émissions Octogoal : réactions et débats sur l'actu foot.",
    image: defaultSEO.image
  },
  "/football": {
    title: "Football - Classements et Résultats - Octogoal",
    description: "Classements, résultats et stats des grands championnats sur Octogoal.",
    image: defaultSEO.image
  },
  "/club": {
    title: "Le Club Octogoal",
    description: "Rejoignez le Club Octogoal pour des contenus exclusifs.",
    image: defaultSEO.image
  },
  "/about": {
    title: "À propos - Octogoal",
    description: "Découvrez Octogoal, votre média sport, clash et divertissement.",
    image: defaultSEO.image
  }
};

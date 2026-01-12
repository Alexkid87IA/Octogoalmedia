// Configuration SEO optimisée pour Google et Google Discover
// Titres: 50-60 caractères max | Descriptions: 150-160 caractères max

interface SEOConfig {
  title: string;
  description: string;
  image: string;
  keywords?: string[];
}

interface RouteConfig {
  [key: string]: SEOConfig;
}

// Image par défaut pour Open Graph (1200x630px recommandé)
const DEFAULT_OG_IMAGE = "https://octogoal.media/og-image.svg";
const LOGO_IMAGE = "https://octogoal.media/LOGO_OCTOGOAL.png";

export const defaultSEO: SEOConfig = {
  title: "Octogoal - Actu Foot, Transferts et Analyses en Direct",
  description: "Suivez toute l'actualité football en direct : transferts, résultats, analyses tactiques et contenus exclusifs. Le média foot nouvelle génération.",
  image: DEFAULT_OG_IMAGE,
  keywords: ["football", "actu foot", "transferts", "ligue 1", "premier league", "mercato"]
};

export const routeSEO: RouteConfig = {
  // ============================================
  // PAGES PRINCIPALES
  // ============================================
  "/": defaultSEO,

  "/articles": {
    title: "Tous les Articles Football - Actus et Analyses | Octogoal",
    description: "Découvrez tous nos articles : actus transferts, analyses tactiques, portraits de joueurs et contenus exclusifs sur le football mondial.",
    image: DEFAULT_OG_IMAGE
  },

  "/matchs": {
    title: "Matchs en Direct - Résultats et Scores Live | Octogoal",
    description: "Suivez tous les matchs de football en direct : scores live, compositions, stats et analyses. Ligue 1, Premier League, Liga, Serie A, Bundesliga.",
    image: DEFAULT_OG_IMAGE
  },

  "/paris": {
    title: "Paris Sportifs Football - Cotes Winamax en Direct | Octogoal",
    description: "Consultez les meilleures cotes Winamax pour vos paris football. Pronostics, analyses et cotes en temps réel sur tous les grands matchs.",
    image: DEFAULT_OG_IMAGE
  },

  "/classements": {
    title: "Classements Football - Ligue 1, Premier League, Liga | Octogoal",
    description: "Tous les classements des championnats européens en direct. Ligue 1, Premier League, La Liga, Serie A, Bundesliga : points, buts, différence.",
    image: DEFAULT_OG_IMAGE
  },

  "/classements/europe": {
    title: "Classement UEFA - Coefficient et Ranking Européen | Octogoal",
    description: "Classement UEFA des clubs et pays européens. Coefficient, points, historique et évolution du ranking pour la Ligue des Champions et Europa League.",
    image: DEFAULT_OG_IMAGE
  },

  "/clubs": {
    title: "Clubs de Football - Actus, Effectifs et Stats | Octogoal",
    description: "Toute l'actualité des grands clubs européens : PSG, Real Madrid, Barcelone, Manchester, Bayern... Effectifs, transferts et performances.",
    image: DEFAULT_OG_IMAGE
  },

  "/joueurs": {
    title: "Joueurs de Football - Stars, Stats et Transferts | Octogoal",
    description: "Portraits des plus grands joueurs : Mbappé, Haaland, Bellingham, Vinicius... Stats, performances, salaires et actualité transferts.",
    image: DEFAULT_OG_IMAGE
  },

  "/podcasts": {
    title: "Podcasts Football - Débats et Analyses | Octogoal",
    description: "Écoutez nos podcasts football : débats mercato, analyses tactiques, réactions matchs et discussions avec des experts du ballon rond.",
    image: DEFAULT_OG_IMAGE
  },

  "/emissions": {
    title: "Émissions Football - Vidéos et Réactions | Octogoal",
    description: "Regardez nos émissions : débriefs de matchs, analyses mercato, clashs et réactions à chaud sur l'actualité football.",
    image: DEFAULT_OG_IMAGE
  },

  "/formats": {
    title: "Formats Octogoal - Tops, Débats et Contenus Exclusifs",
    description: "Découvrez nos formats originaux : tops joueurs, débats tactiques, comparatifs et contenus exclusifs que vous ne trouverez nulle part ailleurs.",
    image: DEFAULT_OG_IMAGE
  },

  "/about": {
    title: "À Propos d'Octogoal - Le Média Foot Nouvelle Génération",
    description: "Découvrez Octogoal, le média football créé par des passionnés pour des passionnés. Notre mission : vous offrir le meilleur contenu foot.",
    image: LOGO_IMAGE
  },

  "/mission": {
    title: "Notre Mission - Réinventer le Média Football | Octogoal",
    description: "Chez Octogoal, on croit qu'un média foot peut être différent : authentique, passionné et proche de sa communauté. Découvrez notre vision.",
    image: LOGO_IMAGE
  },

  // ============================================
  // CATÉGORIE: ACTUS
  // ============================================
  "/rubrique/actus": {
    title: "Actus Football - Toute l'Info Foot en Direct | Octogoal",
    description: "L'actualité football en temps réel : transferts, résultats, déclarations et buzz. Ne ratez rien de ce qui fait vibrer le monde du foot.",
    image: DEFAULT_OG_IMAGE
  },

  "/rubrique/actus/mercato": {
    title: "Mercato Football - Transferts et Rumeurs en Direct | Octogoal",
    description: "Suivez le mercato en direct : transferts officiels, rumeurs, négociations et indiscrétions. Toutes les infos sur les mouvements de joueurs.",
    image: DEFAULT_OG_IMAGE
  },

  "/rubrique/actus/rumeurs": {
    title: "Rumeurs Transferts - Les Bruits de Couloir Foot | Octogoal",
    description: "Les dernières rumeurs mercato : qui pourrait signer où ? Indiscrétions, sources fiables et analyse des probabilités de transferts.",
    image: DEFAULT_OG_IMAGE
  },

  "/rubrique/actus/officialisations": {
    title: "Transferts Officiels - Signatures et Annonces | Octogoal",
    description: "Tous les transferts officiels confirmés : nouvelles signatures, prêts, résiliations. Les annonces des clubs en temps réel.",
    image: DEFAULT_OG_IMAGE
  },

  "/rubrique/actus/ligue-1": {
    title: "Actu Ligue 1 - PSG, OM, OL et Championnat de France | Octogoal",
    description: "Toute l'actualité de la Ligue 1 : PSG, Marseille, Lyon, Monaco... Résultats, transferts, polémiques et analyses du championnat français.",
    image: DEFAULT_OG_IMAGE
  },

  "/rubrique/actus/premier-league": {
    title: "Actu Premier League - Manchester, Arsenal, Liverpool | Octogoal",
    description: "L'actualité Premier League : Man City, Arsenal, Liverpool, Chelsea, Man United... Résultats, transferts et analyses du championnat anglais.",
    image: DEFAULT_OG_IMAGE
  },

  "/rubrique/actus/liga": {
    title: "Actu Liga - Real Madrid, Barcelone, Atlético | Octogoal",
    description: "Toute l'actualité de La Liga : Real Madrid, FC Barcelone, Atlético... Résultats, Clasico, transferts et analyses du championnat espagnol.",
    image: DEFAULT_OG_IMAGE
  },

  "/rubrique/actus/serie-a": {
    title: "Actu Serie A - Inter, Milan, Juventus, Naples | Octogoal",
    description: "L'actualité Serie A : Inter Milan, AC Milan, Juventus, Napoli... Résultats, transferts et analyses du championnat italien (Calcio).",
    image: DEFAULT_OG_IMAGE
  },

  "/rubrique/actus/bundesliga": {
    title: "Actu Bundesliga - Bayern Munich, Dortmund, Leipzig | Octogoal",
    description: "Toute l'actualité de la Bundesliga : Bayern Munich, Dortmund, Leipzig, Leverkusen... Résultats, transferts et analyses du championnat allemand.",
    image: DEFAULT_OG_IMAGE
  },

  // ============================================
  // CATÉGORIE: MATCHS
  // ============================================
  "/rubrique/matchs": {
    title: "Matchs Football - Analyses et Résultats en Direct | Octogoal",
    description: "Analyses tactiques, notes de joueurs et résultats de tous les matchs. Compositions, stats et débriefs détaillés des rencontres.",
    image: DEFAULT_OG_IMAGE
  },

  // ============================================
  // CATÉGORIE: CLUBS
  // ============================================
  "/rubrique/clubs": {
    title: "Clubs Football - PSG, Real, Barça, Liverpool | Octogoal",
    description: "L'actu des plus grands clubs : PSG, Real Madrid, Barcelone, Manchester, Liverpool, Bayern... Transferts, résultats et coulisses.",
    image: DEFAULT_OG_IMAGE
  },

  // ============================================
  // CATÉGORIE: JOUEURS
  // ============================================
  "/rubrique/joueurs": {
    title: "Joueurs Stars - Mbappé, Haaland, Bellingham | Octogoal",
    description: "Portraits et analyses des stars du foot : Mbappé, Haaland, Bellingham, Vinicius, Messi, Ronaldo... Stats, performances et actualité.",
    image: DEFAULT_OG_IMAGE
  },

  // ============================================
  // CATÉGORIE: FORMATS OCTOGOAL
  // ============================================
  "/rubrique/formats-octogoal": {
    title: "Formats Octogoal - Contenus Foot Exclusifs et Originaux",
    description: "Nos formats signatures : tops joueurs, comparatifs, débats et analyses qu'on ne trouve que sur Octogoal. Du contenu foot différent.",
    image: DEFAULT_OG_IMAGE
  },

  "/rubrique/formats-octogoal/culture-foot": {
    title: "Culture Foot - Histoire, Légendes et Anecdotes | Octogoal",
    description: "Plongez dans la culture football : histoires légendaires, anecdotes incroyables, records et moments qui ont marqué l'histoire du foot.",
    image: DEFAULT_OG_IMAGE
  },

  "/rubrique/formats-octogoal/moments-viraux": {
    title: "Moments Viraux Football - Buzz et Insolites | Octogoal",
    description: "Les moments qui ont cassé Internet : célébrations folles, fails mémorables, déclarations choc et buzz du monde du football.",
    image: DEFAULT_OG_IMAGE
  },

  // ============================================
  // CATÉGORIE: MÈMES
  // ============================================
  "/rubrique/memes": {
    title: "Mèmes Football - Humour et Images Virales | Octogoal",
    description: "Les meilleurs mèmes foot du moment : humour, détournements et images virales. Le côté fun du football qu'on adore.",
    image: DEFAULT_OG_IMAGE
  },

  // ============================================
  // PAGES SPÉCIALES
  // ============================================
  "/football": {
    title: "Football - Stats, Classements et Buteurs | Octogoal",
    description: "Toutes les stats football : classements des championnats, meilleurs buteurs, passeurs et performances des équipes européennes.",
    image: DEFAULT_OG_IMAGE
  }
};

// Fonction pour générer dynamiquement le SEO d'une page article
export function generateArticleSEO(article: {
  title: string;
  excerpt?: string;
  mainImage?: string;
  author?: string;
  publishedAt?: string;
}): SEOConfig & { publishedTime?: string; author?: string } {
  return {
    title: `${article.title} | Octogoal`,
    description: article.excerpt || `Découvrez "${article.title}" sur Octogoal, votre média football.`,
    image: article.mainImage || DEFAULT_OG_IMAGE,
    publishedTime: article.publishedAt,
    author: article.author
  };
}

// Fonction pour générer le SEO d'une page joueur
export function generatePlayerSEO(player: {
  name: string;
  team?: string;
  position?: string;
}): SEOConfig {
  const teamInfo = player.team ? ` (${player.team})` : '';
  return {
    title: `${player.name}${teamInfo} - Stats et Actu | Octogoal`,
    description: `Tout sur ${player.name} : statistiques, performances, transferts et actualités. Suivez la carrière de ${player.name} sur Octogoal.`,
    image: DEFAULT_OG_IMAGE
  };
}

// Fonction pour générer le SEO d'une page club
export function generateClubSEO(club: {
  name: string;
  league?: string;
}): SEOConfig {
  const leagueInfo = club.league ? ` - ${club.league}` : '';
  return {
    title: `${club.name}${leagueInfo} - Actu et Effectif | Octogoal`,
    description: `Toute l'actualité de ${club.name} : transferts, résultats, effectif complet et analyses. Suivez votre club sur Octogoal.`,
    image: DEFAULT_OG_IMAGE
  };
}

// Fonction pour générer le SEO d'une page match
export function generateMatchSEO(match: {
  homeTeam: string;
  awayTeam: string;
  competition?: string;
  date?: string;
}): SEOConfig {
  const competition = match.competition ? ` - ${match.competition}` : '';
  return {
    title: `${match.homeTeam} vs ${match.awayTeam}${competition} | Octogoal`,
    description: `Suivez ${match.homeTeam} - ${match.awayTeam} en direct : composition, stats, score live et analyse du match.`,
    image: DEFAULT_OG_IMAGE
  };
}

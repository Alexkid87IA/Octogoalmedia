// src/data/guides/digitalDetoxContent.ts

export interface GuideSection {
  id: string;
  title: string;
  subtitle?: string;
  content: {
    intro?: string;
    paragraphs?: string[];
    subsections?: {
      title: string;
      content: string[];
      list?: string[];
      highlight?: string;
    }[];
    keyPoints?: string[];
    actionItems?: string[];
    quote?: {
      text: string;
      author: string;
    };
  };
}

export const digitalDetoxContent: GuideSection[] = [
  {
    id: 'intro',
    title: 'Introduction',
    subtitle: 'La Vérité sur Notre Addiction Digitale',
    content: {
      intro: "Vous passez 7 heures par jour sur vos écrans. 95% de ce temps est du pur gaspillage cognitif. Pendant que vous scrollez sans but, votre cerveau se fait pirater par des algorithmes conçus pour vous rendre addict.",
      paragraphs: [
        "Les réseaux sociaux et les écrans ne sont pas intrinsèquement mauvais. Ce sont des outils puissants qui peuvent enrichir nos vies, nous connecter à des communautés inspirantes et nous donner accès à une infinité de connaissances. Le problème survient quand nous perdons le contrôle, quand nous devenons les produits plutôt que les utilisateurs.",
        "Une connexion non maîtrisée aux écrans peut littéralement détruire votre capacité d'attention, votre créativité, vos relations et votre bien-être mental. Les algorithmes sont conçus pour capturer votre attention, pas pour améliorer votre vie. Il est temps de reprendre le pouvoir."
      ]
    }
  },
  {
    id: 'comprendre',
    title: 'Comprendre l\'Ennemi',
    subtitle: 'La Mécanique de l\'Addiction',
    content: {
      subsections: [
        {
          title: 'Le Piège de la Dopamine Artificielle',
          content: [
            "Chaque notification, chaque like, chaque nouveau contenu déclenche une micro-dose de dopamine dans votre cerveau. Les plateformes exploitent ce mécanisme naturel de récompense pour créer une dépendance comportementale.",
            "Vous n'êtes plus en train de choisir de scroller - votre cerveau est littéralement reprogrammé pour en redemander.",
            "Le feed généraliste est particulièrement toxique. Il bombarde votre cerveau avec des contenus disparates : politique, divertissement, drame, publicité, tout mélangé dans un chaos cognitif. Votre cerveau passe d'une émotion à l'autre sans jamais avoir le temps de traiter ou d'intégrer l'information. C'est l'équivalent mental de manger de la junk food toute la journée."
          ]
        },
        {
          title: 'Le Coût Caché du Doomscrolling',
          content: [
            "Le doomscrolling - cette habitude de faire défiler sans fin des contenus négatifs ou anxiogènes - n'est pas qu'une perte de temps. Il reprogramme littéralement votre cerveau pour chercher le négatif, augmente votre niveau de stress cortisol et diminue votre capacité à vous concentrer sur des tâches complexes."
          ],
          list: [
            "Diminution de la capacité d'attention profonde",
            "Augmentation de l'anxiété et de la dépression",
            "Perturbation du sommeil",
            "Détérioration des relations réelles",
            "Perte de créativité et de productivité",
            "Sentiment constant d'insatisfaction"
          ]
        }
      ]
    }
  },
  {
    id: 'strategie',
    title: 'La Stratégie de Reconquête',
    subtitle: 'Transformer les Réseaux en Outils',
    content: {
      subsections: [
        {
          title: 'Principe Fondamental : L\'Intentionnalité Radicale',
          content: [
            "Au lieu de bannir complètement les réseaux sociaux, nous allons les transformer en outils au service de vos objectifs. Chaque compte, chaque application, chaque moment passé en ligne doit avoir une intention claire et définie."
          ]
        },
        {
          title: 'La Méthode des Comptes Thématiques',
          content: [
            "Voici la stratégie révolutionnaire : créez des comptes séparés pour chaque domaine d'intérêt. Chaque compte devient un outil d'apprentissage et d'inspiration ciblé.",
            "IMPORTANT : Cette méthode s'applique à TOUS les domaines !"
          ],
          list: [
            "Compte Décoration : Ne suivez QUE des comptes de décoration de qualité",
            "Veille IA : Maximum 5 sources fiables (le FOMO dans l'IA est TOXIQUE)",
            "Fitness : 5 coachs maximum dont vous respectez la philosophie",
            "Finance : 5 analystes avec des approches complémentaires"
          ],
          highlight: "Cette approche transforme le scroll mindless en session d'apprentissage ciblée."
        },
        {
          title: 'La Règle d\'Or : Les Sources Conditionnées (ANTI-FOMO)',
          content: [
            "Le FOMO (Fear Of Missing Out) est particulièrement vicieux dans certains domaines. L'IA par exemple : il y a littéralement des 'breaking news' toutes les heures."
          ],
          list: [
            "Règle des 5 sources maximum par domaine",
            "Créneaux conditionnés de 30 minutes (ex: Veille IA de 9h à 9h30 UNIQUEMENT)",
            "Après le créneau : TERMINÉ, peu importe les 'breaking news'",
            "Si une info est vraiment importante, elle sera encore là demain",
            "Productivité > Information"
          ]
        },
        {
          title: 'Éduquer l\'Algorithme : Votre Nouveau Superpouvoir',
          content: [
            "Les algorithmes ne sont pas vos ennemis - ils sont des outils stupides qui répondent à vos signaux. En étant intentionnel avec vos interactions, vous pouvez littéralement reprogrammer ce que vous voyez."
          ],
          list: [
            "Phase de purge : Unfollowez impitoyablement tout compte qui ne sert pas vos objectifs",
            "Phase de construction : Recherchez activement et suivez des comptes de haute qualité",
            "Phase d'engagement : Interagissez UNIQUEMENT avec le contenu que vous voulez voir plus",
            "Phase de maintenance : Utilisez 'Je ne suis pas intéressé' généreusement"
          ]
        }
      ]
    }
  },
  {
    id: 'outils',
    title: 'Les Outils de Maîtrise',
    subtitle: 'Techniques Pratiques',
    content: {
      subsections: [
        {
          title: 'La Capture Intelligente : Transformer la Consommation en Capital',
          content: [
            "Au lieu de consommer passivement, devenez un collectionneur actif de valeur."
          ],
          list: [
            "Créez des dossiers thématiques dans votre application de notes",
            "Capturez immédiatement tout contenu valuable (screenshot, lien, citation)",
            "Ajoutez TOUJOURS un commentaire personnel : pourquoi c'est important, comment l'utiliser",
            "Revoyez vos notes régulièrement pour transformer l'information en connaissance"
          ],
          highlight: "Applications recommandées : Notion, Pocket, Pinterest, Obsidian"
        },
        {
          title: 'Les Barrières Intentionnelles',
          content: [
            "Créez des frictions entre vous et la consommation mindless."
          ],
          list: [
            "Déconnectez-vous de tous vos comptes après chaque session",
            "Supprimez les applications des réseaux sociaux de votre téléphone",
            "Activez le mode noir et blanc sur votre téléphone",
            "Utilisez des applications de blocage temporaire (Forest, Freedom, Cold Turkey)",
            "Placez votre téléphone dans une autre pièce la nuit"
          ]
        },
        {
          title: 'Le Rituel de Connexion Consciente',
          content: [
            "Transformez chaque session en ligne en rituel intentionnel."
          ],
          list: [
            "Avant : Définissez clairement votre objectif",
            "Pendant : Fixez une limite de temps avec un minuteur",
            "Pendant : Restez focus sur votre objectif, capturez ce qui est valuable",
            "Après : Faites un bilan rapide - qu'avez-vous appris/accompli ?"
          ]
        }
      ]
    }
  },
  {
    id: 'plan-action',
    title: 'Plan d\'Action',
    subtitle: '30 Jours pour Reprendre le Contrôle',
    content: {
      subsections: [
        {
          title: 'Semaine 1 : L\'Audit Digital',
          content: [
            "Jour 1-3 : L'inventaire brutal"
          ],
          list: [
            "Listez TOUS vos comptes sur TOUS les réseaux",
            "Notez le temps passé sur chaque plateforme",
            "Identifiez vos déclencheurs de scroll compulsif"
          ]
        },
        {
          title: 'Semaine 2 : La Reconstruction Intentionnelle',
          content: [
            "Jour 8-14 : Reconstruction"
          ],
          list: [
            "Identifiez 3-5 domaines d'amélioration personnelle",
            "Créez des comptes thématiques si nécessaire",
            "Établissez des règles claires d'utilisation",
            "Éduquez les algorithmes"
          ]
        },
        {
          title: 'Semaine 3 : L\'Installation des Habitudes',
          content: [
            "Jour 15-21 : Nouvelles habitudes"
          ],
          list: [
            "Implémentez le rituel de connexion consciente",
            "Testez différentes applications de gestion du temps",
            "Créez votre système de capture de valeur",
            "Établissez des zones sans écran"
          ]
        },
        {
          title: 'Semaine 4 : L\'Optimisation et l\'Ancrage',
          content: [
            "Jour 22-30 : Consolidation"
          ],
          list: [
            "Analysez ce qui fonctionne et ce qui résiste",
            "Affinez vos règles et rituels",
            "Partagez votre expérience avec votre entourage",
            "Mesurez vos progrès et célébrez"
          ]
        }
      ]
    }
  },
  {
    id: 'avance',
    title: 'Stratégies Avancées',
    subtitle: 'Pour Aller Plus Loin',
    content: {
      subsections: [
        {
          title: 'Le Mantra Anti-FOMO',
          content: [
            "Répétez-vous ces vérités quotidiennement pour ancrer votre nouvelle mentalité."
          ],
          list: [
            "Si c'est vraiment important, ça reviendra",
            "Ma productivité vaut plus que ma connaissance exhaustive",
            "Je ne peux pas tout savoir, et c'est OK",
            "30 minutes d'information suffisent pour rester pertinent",
            "Mieux vaut maîtriser 5 sources que survoler 50"
          ]
        },
        {
          title: 'La Diète Digitale Périodique',
          content: [
            "Programmez des périodes de détox complète pour réinitialiser votre relation avec la technologie."
          ],
          list: [
            "Un jour par semaine sans écran (Digital Sabbath)",
            "Un weekend par mois offline complet",
            "Une semaine par an de détox totale"
          ]
        },
        {
          title: 'Le Principe du Créateur vs Consommateur',
          content: [
            "Inversez le ratio : pour chaque heure de consommation, créez pendant deux heures."
          ],
          list: [
            "Écrivez sur ce que vous apprenez",
            "Créez du contenu dans vos domaines d'intérêt",
            "Partagez vos découvertes de manière intentionnelle",
            "Transformez-vous de consommateur passif en créateur actif"
          ]
        },
        {
          title: 'La Communauté de Soutien',
          content: [
            "Créez ou rejoignez un groupe de personnes partageant les mêmes objectifs."
          ],
          list: [
            "Accountability partners pour maintenir vos engagements",
            "Challenges collectifs de déconnexion",
            "Partage de ressources et stratégies"
          ]
        }
      ]
    }
  },
  {
    id: 'conclusion',
    title: 'Conclusion',
    subtitle: 'Votre Nouvelle Vie Digitale',
    content: {
      paragraphs: [
        "La maîtrise de votre vie digitale n'est pas une destination, c'est un voyage continu. Chaque jour, vous avez le choix : être esclave de l'algorithme ou en faire votre serviteur.",
        "Les réseaux sociaux et la technologie peuvent être des amplificateurs extraordinaires de votre potentiel - mais seulement si vous en prenez le contrôle. En appliquant les stratégies de ce guide, vous ne faites pas que récupérer votre temps et votre attention. Vous récupérez votre capacité à penser profondément, à créer authentiquement, et à vivre pleinement.",
        "Rappelez-vous : l'objectif n'est pas la déconnexion totale, mais la connexion intentionnelle. Utilisez la technologie comme un outil, pas comme une béquille. Faites de chaque moment en ligne un investissement dans votre croissance, pas une fuite de votre réalité.",
        "Votre cerveau vous remerciera. Vos relations s'amélioreront. Votre créativité explosera. Et surtout, vous retrouverez cette sensation oubliée : être véritablement présent dans votre propre vie.",
        "Le monde digital n'attend qu'une chose : que vous en preniez le contrôle. C'est le moment."
      ],
      quote: {
        text: "La technologie est un serviteur utile mais un maître dangereux.",
        author: "Christian Lous Lange"
      },
      actionItems: [
        "Commencez aujourd'hui avec une action simple",
        "Partagez ce guide avec quelqu'un qui en a besoin",
        "Rejoignez la communauté Octogoal pour du soutien continu",
        "Mesurez vos progrès chaque semaine"
      ]
    }
  }
];
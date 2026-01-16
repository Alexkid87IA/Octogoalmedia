// localDataSystem.ts - Version corrigée et simplifiée
import { useState, useEffect } from 'react';
import type { PortableTextContent, SanityImage } from '../types/sanity';

export interface Article {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt: string;
  body: PortableTextContent;
  publishedAt: string;
  author: {
    name: string;
    image?: SanityImage;
    bio?: string;
  };
  categories: Array<{
    title: string;
    slug: { current: string };
  }>;
  tags: Array<{
    title: string;
    slug: { current: string };
  }>;
  mainImage?: SanityImage;
  readingTime?: number;
  views?: number;
  likes?: number;
}

// Articles de démonstration
const DEMO_ARTICLES: Article[] = [
  {
    _id: "1",
    title: "Comment débuter en programmation web en 2024",
    slug: { current: "comment-debuter-programmation" },
    excerpt: "Guide complet pour apprendre la programmation web de zéro. Découvrez les langages essentiels, les outils indispensables et la roadmap parfaite pour devenir développeur.",
    body: [
      {
        _type: "block",
        children: [
          {
            text: "La programmation web est l'un des domaines les plus accessibles et demandés du développement logiciel. Que vous souhaitiez créer des sites vitrines, des applications web complexes ou même devenir freelance, ce guide vous donnera toutes les clés pour réussir.",
            _type: "span"
          }
        ]
      },
      {
        _type: "block",
        style: "h2",
        children: [
          {
            text: "Les langages fondamentaux",
            _type: "span"
          }
        ]
      },
      {
        _type: "block",
        children: [
          {
            text: "HTML (HyperText Markup Language) est le squelette de toute page web. Il définit la structure et le contenu : les titres, paragraphes, listes, liens, images, formulaires et tableaux.",
            _type: "span"
          }
        ]
      },
      {
        _type: "block",
        children: [
          {
            text: "CSS (Cascading Style Sheets) s'occupe de la présentation : couleurs, polices, espacements, mise en page responsive, animations et transitions.",
            _type: "span"
          }
        ]
      },
      {
        _type: "block",
        children: [
          {
            text: "JavaScript apporte l'interactivité : manipulation du DOM, gestion des événements, communication avec les APIs.",
            _type: "span"
          }
        ]
      }
    ],
    publishedAt: "2024-12-01T10:00:00.000Z",
    author: {
      name: "Alex Développeur",
      bio: "Développeur fullstack passionné avec 5 ans d'expérience. Spécialisé en React, Node.js et formations."
    },
    categories: [
      { title: "Programmation", slug: { current: "programmation" } },
      { title: "Débutant", slug: { current: "debutant" } }
    ],
    tags: [
      { title: "HTML", slug: { current: "html" } },
      { title: "CSS", slug: { current: "css" } },
      { title: "JavaScript", slug: { current: "javascript" } }
    ],
    readingTime: 8,
    views: 1247,
    likes: 89
  },
  {
    _id: "2",
    title: "Maîtriser les React Hooks : Guide complet 2024",
    slug: { current: "react-hooks-guide" },
    excerpt: "Découvrez tous les secrets des React Hooks avec des exemples pratiques. useState, useEffect, useContext et hooks personnalisés expliqués simplement.",
    body: [
      {
        _type: "block",
        children: [
          {
            text: "Les React Hooks ont révolutionné la façon d'écrire des composants React. Fini les classes complexes, place à des fonctions élégantes et réutilisables !",
            _type: "span"
          }
        ]
      },
      {
        _type: "block",
        style: "h2",
        children: [
          {
            text: "useState : Gérer l'état local",
            _type: "span"
          }
        ]
      },
      {
        _type: "block",
        children: [
          {
            text: "Le hook le plus utilisé pour gérer l'état dans vos composants. Exemple : const [count, setCount] = useState(0);",
            _type: "span"
          }
        ]
      }
    ],
    publishedAt: "2024-11-28T14:30:00.000Z",
    author: {
      name: "Marie Frontend",
      bio: "Experte React avec une passion pour l'architecture frontend moderne."
    },
    categories: [
      { title: "React", slug: { current: "react" } },
      { title: "Avancé", slug: { current: "avance" } }
    ],
    tags: [
      { title: "React", slug: { current: "react" } },
      { title: "Hooks", slug: { current: "hooks" } }
    ],
    readingTime: 12,
    views: 892,
    likes: 156
  },
  {
    _id: "3",
    title: "CSS Grid vs Flexbox : Quand utiliser quoi ?",
    slug: { current: "css-grid-vs-flexbox" },
    excerpt: "Comprendre les différences entre CSS Grid et Flexbox. Découvrez quand et comment utiliser chaque technique pour créer des layouts parfaits.",
    body: [
      {
        _type: "block",
        children: [
          {
            text: "CSS Grid et Flexbox sont deux systèmes de mise en page puissants mais avec des objectifs différents. Ce guide vous aide à choisir la bonne solution.",
            _type: "span"
          }
        ]
      }
    ],
    publishedAt: "2024-11-25T09:15:00.000Z",
    author: {
      name: "Sophie Design",
      bio: "Designer UI/UX spécialisée dans les interfaces web modernes et accessibles."
    },
    categories: [
      { title: "CSS", slug: { current: "css" } },
      { title: "Design", slug: { current: "design" } }
    ],
    tags: [
      { title: "CSS", slug: { current: "css" } },
      { title: "Layout", slug: { current: "layout" } }
    ],
    readingTime: 6,
    views: 654,
    likes: 78
  },
  {
    _id: "4",
    title: "API REST vs GraphQL : Le guide complet",
    slug: { current: "api-rest-vs-graphql" },
    excerpt: "Comparaison détaillée entre REST et GraphQL. Avantages, inconvénients, et cas d'usage pour vous aider à faire le bon choix architectural.",
    body: [
      {
        _type: "block",
        children: [
          {
            text: "Le choix entre REST et GraphQL est crucial pour votre architecture. Chaque approche a ses avantages selon votre contexte projet.",
            _type: "span"
          }
        ]
      }
    ],
    publishedAt: "2024-11-22T16:45:00.000Z",
    author: {
      name: "Thomas Backend",
      bio: "Architecte logiciel spécialisé dans les APIs et les systèmes distribués."
    },
    categories: [
      { title: "Backend", slug: { current: "backend" } },
      { title: "API", slug: { current: "api" } }
    ],
    tags: [
      { title: "REST", slug: { current: "rest" } },
      { title: "GraphQL", slug: { current: "graphql" } }
    ],
    readingTime: 10,
    views: 1089,
    likes: 134
  }
];

// API simulée
export class LocalDataAPI {
  private static delay(ms: number = 300): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  static async getAllArticles(): Promise<Article[]> {
    await this.delay();
    return [...DEMO_ARTICLES].sort((a, b) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  }

  static async getArticleBySlug(slug: string): Promise<Article | null> {
    await this.delay();
    return DEMO_ARTICLES.find(article => article.slug.current === slug) || null;
  }

  static async getRelatedArticles(articleId: string, limit: number = 3): Promise<Article[]> {
    await this.delay();
    return DEMO_ARTICLES
      .filter(article => article._id !== articleId)
      .slice(0, limit);
  }
}

// Hook personnalisé
export const useLocalArticle = (slug: string) => {
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await LocalDataAPI.getArticleBySlug(slug);
        
        if (result) {
          setArticle(result);
        } else {
          setError('Article non trouvé');
        }
      } catch (err) {
        setError('Erreur lors du chargement');
        console.error('Erreur:', err);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchArticle();
    }
  }, [slug]);

  return { article, loading, error };
};
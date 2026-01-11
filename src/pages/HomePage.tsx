import React, { useState, useEffect } from 'react';
import { SEO } from '../components/common/SEO';
import { staticSEO } from '../utils/seo.config';
import { HeroSection } from '../components/sections/HeroSection';
import { RecentArticlesSection } from '../components/sections/RecentArticlesSection';
import { EditorialSection } from '../components/sections/EditorialSection';
import ContentSection from '../components/sections/ContentSection';
import { EssentialArticlesSection } from '../components/sections/EssentialArticlesSection';
import { ClubSection } from '../components/sections/ClubSection';
import { Footer } from '../components/layout/Footer';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { useData } from '../context/DataContext';

// Widget Live Scores via iframe (fonctionne sans problème CORS)
import MatchesTicker from '../components/football/MatchesTicker';

const mockArticles = [
  {
    _id: '1',
    title: "Comment développer un mindset d'exception",
    slug: { _type: "slug", current: 'mindset-exception' },
    mainImage: {
      _type: "image",
      asset: {
        _ref: 'https://picsum.photos/400/300?random=1',
        _type: "reference"
      }
    },
    excerpt: "Découvrez les secrets des entrepreneurs qui réussissent et transforment leur vision du possible.",
    publishedAt: "2024-03-20",
    categories: [
      {
        _id: 'cat1',
        title: 'Mindset',
        slug: { current: 'mindset' }
      }
    ]
  },
  {
    _id: '2',
    title: "Les 5 stratégies de croissance des licornes françaises",
    slug: { _type: "slug", current: 'strategies-croissance-licornes' },
    mainImage: {
      _type: "image",
      asset: {
        _ref: 'https://picsum.photos/400/300?random=2',
        _type: "reference"
      }
    },
    excerpt: "Analyse exclusive des méthodes utilisées par les startups françaises valorisées à plus d'1 milliard.",
    publishedAt: "2024-03-19",
    categories: [
      {
        _id: 'cat2',
        title: 'Business',
        slug: { current: 'business' }
      }
    ]
  },
  {
    _id: '3',
    title: "L'art du pivot : Quand et comment changer de direction",
    slug: { _type: "slug", current: 'art-du-pivot' },
    mainImage: {
      _type: "image",
      asset: {
        _ref: 'https://picsum.photos/400/300?random=3',
        _type: "reference"
      }
    },
    excerpt: "Apprenez à reconnaître les signaux et à exécuter un pivot stratégique avec succès.",
    publishedAt: "2024-03-18",
    categories: [
      {
        _id: 'cat2',
        title: 'Business',
        slug: { current: 'business' }
      }
    ]
  },
  {
    _id: '4',
    title: "Le pouvoir de la visualisation dans l'entrepreneuriat",
    slug: { _type: "slug", current: 'pouvoir-visualisation' },
    mainImage: {
      _type: "image",
      asset: {
        _ref: 'https://picsum.photos/400/300?random=4',
        _type: "reference"
      }
    },
    excerpt: "Comment les entrepreneurs à succès utilisent la visualisation pour atteindre leurs objectifs.",
    publishedAt: "2024-03-17",
    categories: [
      {
        _id: 'cat1',
        title: 'Mindset',
        slug: { current: 'mindset' }
      }
    ]
  },
  {
    _id: '5',
    title: "Réseauter comme un pro : Le guide complet",
    slug: { _type: "slug", current: 'reseauter-comme-un-pro' },
    mainImage: {
      _type: "image",
      asset: {
        _ref: 'https://picsum.photos/400/300?random=5',
        _type: "reference"
      }
    },
    excerpt: "Techniques avancées pour construire un réseau professionnel puissant et authentique.",
    publishedAt: "2024-03-16",
    categories: [
      {
        _id: 'cat3',
        title: 'Society',
        slug: { current: 'society' }
      }
    ]
  },
  {
    _id: '6',
    title: "L'impact de l'IA sur les modèles économiques de demain",
    slug: { _type: "slug", current: 'impact-ia-modeles-economiques' },
    mainImage: {
      _type: "image",
      asset: {
        _ref: 'https://picsum.photos/400/300?random=6',
        _type: "reference"
      }
    },
    excerpt: "Exploration des transformations radicales que l'intelligence artificielle apporte au business.",
    publishedAt: "2024-03-15",
    categories: [
      {
        _id: 'cat2',
        title: 'Business',
        slug: { current: 'business' }
      }
    ]
  },
  {
    _id: '7',
    title: "La méthode des micro-habitudes pour transformer sa vie",
    slug: { _type: "slug", current: 'micro-habitudes-transformation' },
    mainImage: {
      _type: "image",
      asset: {
        _ref: 'https://picsum.photos/400/300?random=7',
        _type: "reference"
      }
    },
    excerpt: "Comment de petits changements quotidiens peuvent mener à des résultats extraordinaires.",
    publishedAt: "2024-03-14",
    categories: [
      {
        _id: 'cat4',
        title: 'Mental',
        slug: { current: 'mental' }
      }
    ]
  },
  {
    _id: '8',
    title: "Négociation avancée : Les tactiques des meilleurs dealmakers",
    slug: { _type: "slug", current: 'negociation-avancee-dealmakers' },
    mainImage: {
      _type: "image",
      asset: {
        _ref: 'https://picsum.photos/400/300?random=8',
        _type: "reference"
      }
    },
    excerpt: "Les stratégies de négociation utilisées par les plus grands entrepreneurs pour conclure des deals.",
    publishedAt: "2024-03-13",
    categories: [
      {
        _id: 'cat2',
        title: 'Business',
        slug: { current: 'business' }
      }
    ]
  },
  {
    _id: '9',
    title: "Construire une marque personnelle authentique en 2024",
    slug: { _type: "slug", current: 'marque-personnelle-authentique' },
    mainImage: {
      _type: "image",
      asset: {
        _ref: 'https://picsum.photos/400/300?random=9',
        _type: "reference"
      }
    },
    excerpt: "Le guide complet pour développer votre personal branding sans perdre votre authenticité.",
    publishedAt: "2024-03-12",
    categories: [
      {
        _id: 'cat5',
        title: 'Story',
        slug: { current: 'story' }
      }
    ]
  },
  {
    _id: '10',
    title: "Les nouvelles règles du leadership post-pandémie",
    slug: { _type: "slug", current: 'leadership-post-pandemie' },
    mainImage: {
      _type: "image",
      asset: {
        _ref: 'https://picsum.photos/400/300?random=10',
        _type: "reference"
      }
    },
    excerpt: "Comment les meilleurs leaders adaptent leur style de management aux nouvelles réalités du travail.",
    publishedAt: "2024-03-11",
    categories: [
      {
        _id: 'cat3',
        title: 'Society',
        slug: { current: 'society' }
      }
    ]
  }
];

export const HomePage = () => {
  const { recentArticles, isLoading: contextLoading } = useData();
  const [articles, setArticles] = useState(mockArticles);
  const [dataSource, setDataSource] = useState('mock');

  useEffect(() => {
    if (recentArticles && recentArticles.length > 0) {
      setArticles(recentArticles.slice(0, 10));
      setDataSource('sanity');
      console.log('✅ Articles récupérés depuis le contexte DataContext');
    } else {
      setArticles(mockArticles);
      setDataSource('mock');
      console.log('📦 Utilisation des articles mockés (fallback)');
    }
  }, [recentArticles]);

  if (contextLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <>
      <SEO {...staticSEO.home} />
      <div className="relative min-h-screen bg-black overflow-hidden">
        {/* Background effects */}
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,164,249,0.15),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(99,253,253,0.15),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(0,164,249,0.15),transparent_50%)]" />
          <div className="absolute inset-0 backdrop-blur-[100px]" />
        </div>

        {/* LIVE SCORES TICKER - Entre navbar et hero */}
        <div className="relative z-[45] pt-20">
          <MatchesTicker />
        </div>

        <main className="relative z-[5] overflow-x-hidden">
          {/* 1. Hero avec article à la une + 6 articles récents + CTA */}
          <HeroSection />
          
          {/* 2. Section des derniers articles publiés */}
          <RecentArticlesSection articles={articles} />
          
          {/* 3. Articles essentiels */}
          <section className="py-20 overflow-hidden">
            <EssentialArticlesSection />
          </section>
          
          {/* 4. Nos formats : Émissions Octogoal */}
          <section className="py-20 bg-gradient-to-b from-transparent via-purple-900/10 to-transparent overflow-hidden">
            <ContentSection 
              title="Les émissions Octogoal"
              description="Réactions live, débats enflammés et analyses décalées"
              sectionType="emission"
            />
          </section>
          
          {/* 5. Nos formats : Études de cas */}
          <section className="py-20 overflow-hidden">
            <ContentSection 
              title="Des études de cas exclusives"
              description="Découvrez les stratégies et idées qui transforment le monde des affaires"
              sectionType="business-idea"
            />
          </section>
          
          {/* 6. Nos formats : Parcours exceptionnels */}
          <section className="py-20 bg-gradient-to-b from-transparent via-blue-900/10 to-transparent overflow-hidden">
            <ContentSection 
              title="Des parcours inspirants"
              description="Histoires d'entrepreneurs qui ont réussi à concrétiser leur vision"
              sectionType="success-story"
            />
          </section>
          
          {/* 7. Navigation thématique + stats + CTA */}
          <EditorialSection />
          
          {/* 8. Proposition premium */}
          <ClubSection />
        </main>
        
        {/* 9. Footer */}
        <Footer />
      </div>
    </>
  );
};

export default HomePage;
// src/pages/FormatsPage.tsx
// Page hub pour les Formats Octogoal - contenus originaux et signatures

import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Trophy,
  Flame,
  Smile,
  MessageSquare,
  Star,
  BookOpen,
  ChevronRight,
  Calendar,
  Loader2,
  Play,
  Zap,
} from 'lucide-react';
import { sanityClient, urlFor } from '../utils/sanityClient';

// ===========================================
// TYPES
// ===========================================

interface SanityArticle {
  _id: string;
  title: string;
  slug: { current: string };
  mainImage: any;
  excerpt?: string;
  publishedAt: string;
  contentType?: string;
  videoUrl?: string;
  categories?: { title: string; slug: { current: string } }[];
  subcategories?: { title: string; slug: { current: string } }[];
}

interface FormatCategory {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: React.ElementType;
  gradient: string;
  borderColor: string;
  hoverGlow: string;
}

// ===========================================
// CONFIGURATION DES CATÉGORIES
// ===========================================

const FORMAT_CATEGORIES: FormatCategory[] = [
  {
    id: 'tops-listes',
    slug: 'tops-listes',
    title: 'Tops et Listes',
    description: 'Classements, top 10 et sélections',
    icon: Trophy,
    gradient: 'from-amber-500 to-orange-600',
    borderColor: 'border-amber-500/30',
    hoverGlow: 'hover:shadow-amber-500/20',
  },
  {
    id: 'moments-viraux',
    slug: 'moments-viraux',
    title: 'Moments Viraux',
    description: 'Les buzz et moments forts',
    icon: Flame,
    gradient: 'from-red-500 to-pink-600',
    borderColor: 'border-red-500/30',
    hoverGlow: 'hover:shadow-red-500/20',
  },
  {
    id: 'humour-punchlines',
    slug: 'humour-punchlines',
    title: 'Humour',
    description: 'Contenus drôles et décalés',
    icon: Smile,
    gradient: 'from-yellow-400 to-orange-500',
    borderColor: 'border-yellow-500/30',
    hoverGlow: 'hover:shadow-yellow-500/20',
  },
  {
    id: 'debats-reactions',
    slug: 'debats-reactions',
    title: 'Débats',
    description: 'Discussions et points de vue',
    icon: MessageSquare,
    gradient: 'from-blue-500 to-violet-600',
    borderColor: 'border-blue-500/30',
    hoverGlow: 'hover:shadow-blue-500/20',
  },
  {
    id: 'joueur-du-jour',
    slug: 'joueur-du-jour',
    title: 'Le Joueur du Jour',
    description: 'Focus sur les performances',
    icon: Star,
    gradient: 'from-emerald-500 to-teal-600',
    borderColor: 'border-emerald-500/30',
    hoverGlow: 'hover:shadow-emerald-500/20',
  },
  {
    id: 'culture-foot',
    slug: 'culture-foot',
    title: 'Culture Foot',
    description: 'Histoire et anecdotes',
    icon: BookOpen,
    gradient: 'from-violet-500 to-indigo-600',
    borderColor: 'border-violet-500/30',
    hoverGlow: 'hover:shadow-violet-500/20',
  },
];

// ===========================================
// SECTION 1: HERO
// ===========================================

const HeroSection = () => {
  return (
    <section className="relative min-h-[40vh] flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-pink-950/40 via-black to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(236,72,153,0.25),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.2),transparent_50%)]" />

        {/* Formes octogonales décoratives */}
        <div
          className="absolute top-20 right-20 w-40 h-40 border border-pink-500/10 rotate-12 opacity-50"
          style={{ clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)' }}
        />
        <div
          className="absolute bottom-10 left-10 w-32 h-32 border border-blue-500/10 -rotate-12 opacity-30"
          style={{ clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)' }}
        />
        <div
          className="absolute top-1/2 left-1/4 w-24 h-24 bg-gradient-to-br from-pink-500/5 to-blue-500/5 rotate-45 opacity-40"
          style={{ clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)' }}
        />

        {/* Grille subtile */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-20 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500/10 to-blue-500/10 rounded-full border border-pink-500/20 mb-6"
        >
          <Zap className="w-4 h-4 text-pink-400" />
          <span className="text-sm font-medium text-gray-300">Contenus originaux</span>
        </motion.div>

        {/* Titre principal */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-6xl lg:text-7xl font-black mb-6"
        >
          <span className="text-white">Formats </span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-pink-500 to-blue-500">
            Octogoal
          </span>
        </motion.h1>

        {/* Sous-titre */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto"
        >
          Tops, débats et formats originaux made in Octogoal
        </motion.p>
      </div>
    </section>
  );
};

// ===========================================
// SECTION 2: NAVIGATION PAR CATÉGORIE
// ===========================================

const CategoryNavSection = ({
  onCategoryClick,
}: {
  onCategoryClick: (slug: string) => void;
}) => {
  return (
    <section className="relative py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {FORMAT_CATEGORIES.map((category, index) => {
            const Icon = category.icon;
            return (
              <motion.button
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => onCategoryClick(category.slug)}
                className={`
                  group relative p-5 rounded-2xl border ${category.borderColor} bg-gray-900/60 backdrop-blur-sm
                  hover:bg-gray-900/80 transition-all duration-300 hover:scale-105 ${category.hoverGlow} hover:shadow-xl
                  text-left overflow-hidden
                `}
                style={{
                  clipPath: 'polygon(8% 0%, 92% 0%, 100% 8%, 100% 92%, 92% 100%, 8% 100%, 0% 92%, 0% 8%)',
                }}
              >
                {/* Icône avec gradient */}
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${category.gradient} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>

                {/* Titre */}
                <h3 className="text-white font-bold text-sm mb-1 group-hover:text-pink-400 transition-colors">
                  {category.title}
                </h3>

                {/* Description */}
                <p className="text-gray-500 text-xs line-clamp-2">
                  {category.description}
                </p>

                {/* Hover effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-5 transition-opacity`} />
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// ===========================================
// SECTION 3: CONTENU À LA UNE - VERSION CINÉMATIQUE
// ===========================================

const FeaturedSection = ({ article }: { article: SanityArticle | null }) => {
  if (!article) return null;

  const getCategoryBadge = () => {
    const subcat = article.subcategories?.[0]?.slug?.current;
    const cat = FORMAT_CATEGORIES.find((c) => c.slug === subcat);
    return cat || FORMAT_CATEGORIES[0];
  };

  const category = getCategoryBadge();

  return (
    <section className="relative">
      <Link
        to={`/article/${article.slug?.current}`}
        className="group block relative min-h-[70vh] md:min-h-[80vh] overflow-hidden"
      >
        {/* Image plein écran */}
        <div className="absolute inset-0">
          <img
            src={urlFor(article.mainImage).width(1920).height(1080).url()}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
          />
        </div>

        {/* Overlay gradient cinématique */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />

        {/* Vignette subtile */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.4)_100%)]" />

        {/* Play icon central si vidéo */}
        {article.videoUrl && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
          >
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover:scale-110 group-hover:bg-white/20 transition-all duration-500">
              <Play className="w-10 h-10 md:w-12 md:h-12 text-white fill-white ml-1" />
            </div>
          </motion.div>
        )}

        {/* Contenu positionné en bas à gauche */}
        <div className="absolute inset-0 flex flex-col justify-end">
          <div className="max-w-7xl mx-auto w-full px-6 md:px-12 pb-12 md:pb-20">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="max-w-3xl"
            >
              {/* Badge catégorie */}
              <div className={`inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${category.gradient} rounded-full mb-6 shadow-lg`}>
                <category.icon className="w-5 h-5 text-white" />
                <span className="text-white font-semibold">{category.title}</span>
              </div>

              {/* Titre énorme */}
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight group-hover:text-pink-400 transition-colors duration-300">
                {article.title}
              </h2>

              {/* Extrait */}
              {article.excerpt && (
                <p className="text-gray-200 text-lg md:text-xl max-w-2xl line-clamp-3 mb-8 leading-relaxed">
                  {article.excerpt}
                </p>
              )}

              {/* Footer avec date et CTA */}
              <div className="flex flex-wrap items-center gap-6">
                {/* Bouton CTA */}
                <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-pink-500 to-blue-500 rounded-xl text-white font-bold group-hover:shadow-lg group-hover:shadow-pink-500/30 transition-all">
                  <span>Lire l'article</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>

                {/* Date */}
                <div className="flex items-center gap-2 text-gray-300">
                  <Calendar className="w-5 h-5" />
                  <span className="text-base">
                    {new Date(article.publishedAt).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Indicateur scroll (optionnel) */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 text-white/50"
        >
          <span className="text-xs uppercase tracking-wider">Découvrir</span>
          <ChevronRight className="w-5 h-5 rotate-90" />
        </motion.div>
      </Link>
    </section>
  );
};

// ===========================================
// COMPOSANT CARD ARTICLE
// ===========================================

const FormatArticleCard = ({
  article,
  category,
  index,
}: {
  article: SanityArticle;
  category: FormatCategory;
  index: number;
}) => {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
    >
      <Link
        to={`/article/${article.slug?.current}`}
        className={`group block bg-gray-900/60 rounded-2xl overflow-hidden border border-gray-800 hover:${category.borderColor} transition-all hover:shadow-lg ${category.hoverGlow}`}
      >
        {/* Image sans overlay */}
        <div className="relative aspect-video overflow-hidden">
          <img
            src={urlFor(article.mainImage).width(600).height(340).url()}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Badge */}
          <div className={`absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r ${category.gradient} rounded-full shadow-lg`}>
            <category.icon className="w-3.5 h-3.5 text-white" />
            <span className="text-white text-xs font-medium">{category.title}</span>
          </div>

          {/* Play icon si vidéo */}
          {article.videoUrl && (
            <div className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center">
              <Play className="w-4 h-4 text-white fill-white ml-0.5" />
            </div>
          )}
        </div>

        {/* Contenu */}
        <div className="p-5">
          <h3 className="text-white font-bold leading-tight line-clamp-2 group-hover:text-pink-400 transition-colors mb-2">
            {article.title}
          </h3>
          {article.excerpt && (
            <p className="text-gray-400 text-sm line-clamp-2 mb-3">
              {article.excerpt}
            </p>
          )}
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Calendar className="w-3 h-3" />
            <span>
              {new Date(article.publishedAt).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'short',
              })}
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
};

// ===========================================
// SECTION GÉNÉRIQUE PAR CATÉGORIE
// ===========================================

const FormatSection = ({
  category,
  articles,
  isLoading,
  sectionRef,
}: {
  category: FormatCategory;
  articles: SanityArticle[];
  isLoading: boolean;
  sectionRef: React.RefObject<HTMLElement>;
}) => {
  const Icon = category.icon;

  return (
    <section ref={sectionRef} className="relative py-16" id={category.slug}>
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${category.gradient} flex items-center justify-center`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-white">{category.title}</h2>
              <p className="text-gray-500 text-sm">{category.description}</p>
            </div>
          </div>

          <Link
            to={`/rubrique/formats-octogoal/${category.slug}`}
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 bg-gray-900/80 hover:bg-gray-800 border border-gray-700 rounded-xl text-white text-sm font-medium transition-all"
          >
            Voir tout
            <ChevronRight className="w-4 h-4" />
          </Link>
        </motion.div>

        {/* Contenu */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-pink-500 animate-spin" />
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-12">
            <Icon className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500">Aucun contenu disponible pour le moment</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.slice(0, 6).map((article, index) => (
              <FormatArticleCard
                key={article._id}
                article={article}
                category={category}
                index={index}
              />
            ))}
          </div>
        )}

        {/* Bouton mobile */}
        {articles.length > 0 && (
          <div className="flex justify-center mt-8 sm:hidden">
            <Link
              to={`/rubrique/formats-octogoal/${category.slug}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-pink-500/10 to-blue-500/10 hover:from-pink-500/20 hover:to-blue-500/20 border border-pink-500/30 rounded-xl text-white text-sm font-medium transition-all"
            >
              Voir tous les {category.title.toLowerCase()}
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

// ===========================================
// PAGE PRINCIPALE
// ===========================================

export default function FormatsPage() {
  const [featuredArticle, setFeaturedArticle] = useState<SanityArticle | null>(null);
  const [articlesByCategory, setArticlesByCategory] = useState<Record<string, SanityArticle[]>>({});
  const [isLoading, setIsLoading] = useState(true);

  // Refs pour le scroll
  const sectionRefs = useRef<Record<string, React.RefObject<HTMLElement>>>({});
  FORMAT_CATEGORIES.forEach((cat) => {
    if (!sectionRefs.current[cat.slug]) {
      sectionRefs.current[cat.slug] = React.createRef();
    }
  });

  // Charger les données
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Requête pour récupérer les articles par sous-catégorie "formats-octogoal"
        const query = `{
          "featured": *[_type == "article" && (
            "formats-octogoal" in categories[]->slug.current ||
            subcategories[]->parentCategory->slug.current == "formats-octogoal"
          ) && isFeatured == true] | order(publishedAt desc)[0] {
            _id,
            title,
            slug,
            mainImage,
            excerpt,
            publishedAt,
            videoUrl,
            subcategories[]->{ title, slug }
          },
          "tops": *[_type == "article" && "tops-listes" in subcategories[]->slug.current] | order(publishedAt desc)[0...6] {
            _id, title, slug, mainImage, excerpt, publishedAt, videoUrl, subcategories[]->{ title, slug }
          },
          "viraux": *[_type == "article" && "moments-viraux" in subcategories[]->slug.current] | order(publishedAt desc)[0...6] {
            _id, title, slug, mainImage, excerpt, publishedAt, videoUrl, subcategories[]->{ title, slug }
          },
          "humour": *[_type == "article" && "humour-punchlines" in subcategories[]->slug.current] | order(publishedAt desc)[0...6] {
            _id, title, slug, mainImage, excerpt, publishedAt, videoUrl, subcategories[]->{ title, slug }
          },
          "debats": *[_type == "article" && "debats-reactions" in subcategories[]->slug.current] | order(publishedAt desc)[0...6] {
            _id, title, slug, mainImage, excerpt, publishedAt, videoUrl, subcategories[]->{ title, slug }
          },
          "joueur": *[_type == "article" && "joueur-du-jour" in subcategories[]->slug.current] | order(publishedAt desc)[0...6] {
            _id, title, slug, mainImage, excerpt, publishedAt, videoUrl, subcategories[]->{ title, slug }
          },
          "culture": *[_type == "article" && "culture-foot" in subcategories[]->slug.current] | order(publishedAt desc)[0...6] {
            _id, title, slug, mainImage, excerpt, publishedAt, videoUrl, subcategories[]->{ title, slug }
          }
        }`;

        const data = await sanityClient.fetch(query);

        // Si pas de featured, prendre le plus récent de toutes les catégories
        let featured = data.featured;
        if (!featured) {
          const allArticles = [
            ...data.tops,
            ...data.viraux,
            ...data.humour,
            ...data.debats,
            ...data.joueur,
            ...data.culture,
          ].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
          featured = allArticles[0] || null;
        }

        setFeaturedArticle(featured);
        setArticlesByCategory({
          'tops-listes': data.tops || [],
          'moments-viraux': data.viraux || [],
          'humour-punchlines': data.humour || [],
          'debats-reactions': data.debats || [],
          'joueur-du-jour': data.joueur || [],
          'culture-foot': data.culture || [],
        });
      } catch (error) {
        console.error('Erreur chargement Formats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Scroll vers une section
  const scrollToSection = (slug: string) => {
    const ref = sectionRefs.current[slug];
    if (ref?.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Hero */}
      <HeroSection />

      {/* Navigation par catégorie */}
      <CategoryNavSection onCategoryClick={scrollToSection} />

      {/* Contenu à la une */}
      {!isLoading && featuredArticle && <FeaturedSection article={featuredArticle} />}

      {/* Sections par catégorie */}
      {FORMAT_CATEGORIES.map((category) => (
        <FormatSection
          key={category.id}
          category={category}
          articles={articlesByCategory[category.slug] || []}
          isLoading={isLoading}
          sectionRef={sectionRefs.current[category.slug]}
        />
      ))}
    </div>
  );
}

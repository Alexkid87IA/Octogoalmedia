import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, PlayCircle, Clock, Sparkles, Zap, Trophy, Flame, Star } from 'lucide-react';
import { getAllArticles } from '../../utils/sanityAPI';
import { SanityArticle } from '../../types/sanity';
import { LoadingSpinner } from '../common/LoadingSpinner';
import SafeImage from '../common/SafeImage';
import ErrorBoundary from '../common/ErrorBoundary';

// Clip-paths octogonaux
const octagonClip = 'polygon(15% 0%, 85% 0%, 100% 15%, 100% 85%, 85% 100%, 15% 100%, 0% 85%, 0% 15%)';
const octagonClipSubtle = 'polygon(8% 0%, 92% 0%, 100% 8%, 100% 92%, 92% 100%, 8% 100%, 0% 92%, 0% 8%)';
const octagonClipCard = 'polygon(4% 0%, 96% 0%, 100% 4%, 100% 96%, 96% 100%, 4% 100%, 0% 96%, 0% 4%)';

interface ContentSectionProps {
  title?: string;
  description?: string;
  sectionType?: 'emission' | 'business-idea' | 'success-story';
}

// Données mockées - THÈME OCTOGOAL FOOTBALL
const mockItems = {
  emission: [
    {
      _id: '1',
      title: 'Mohamed Henni réagit au Classico PSG-OM',
      slug: { current: 'momo-henni-classico' },
      excerpt: 'Les meilleures réactions de Momo pendant le match le plus chaud de la saison',
      mainImage: {
        asset: { _ref: 'https://picsum.photos/600/400?random=10' }
      },
      publishedAt: '2024-03-20',
      categories: [{ title: 'Émissions' }],
      guest: 'Mohamed Henni',
      duration: '45 min'
    },
    {
      _id: '2',
      title: 'Débat : Mbappé mérite-t-il le Ballon d\'Or ?',
      slug: { current: 'debat-mbappe-ballon-or' },
      excerpt: 'On analyse les stats, les perfs et on tranche sur la question qui divise',
      mainImage: {
        asset: { _ref: 'https://picsum.photos/600/400?random=11' }
      },
      publishedAt: '2024-03-19',
      categories: [{ title: 'Émissions' }],
      guest: 'L\'équipe Octogoal',
      duration: '38 min'
    },
    {
      _id: '3',
      title: 'Les plus gros fails arbitrage de la saison',
      slug: { current: 'fails-arbitrage-saison' },
      excerpt: 'VAR, penalties inventés, cartons absurdes... On a tout compilé',
      mainImage: {
        asset: { _ref: 'https://picsum.photos/600/400?random=12' }
      },
      publishedAt: '2024-03-18',
      categories: [{ title: 'Émissions' }],
      guest: 'Spécial compilation',
      duration: '25 min'
    }
  ],
  'business-idea': [
    {
      _id: '1',
      title: 'Notes du match : Real Madrid 3-1 Bayern',
      slug: { current: 'notes-real-bayern' },
      excerpt: 'Vinicius en feu, Bellingham patron : toutes les notes du choc européen',
      mainImage: {
        asset: { _ref: 'https://picsum.photos/600/400?random=13' }
      },
      publishedAt: '2024-03-20',
      categories: [{ title: 'Matchs' }],
      readingTime: 5
    },
    {
      _id: '2',
      title: 'Compo probable : France vs Espagne',
      slug: { current: 'compo-france-espagne' },
      excerpt: 'On prédit le XI de Deschamps pour le choc face à la Roja',
      mainImage: {
        asset: { _ref: 'https://picsum.photos/600/400?random=14' }
      },
      publishedAt: '2024-03-19',
      categories: [{ title: 'Matchs' }],
      readingTime: 4
    },
    {
      _id: '3',
      title: 'Stats : Les 10 joueurs les plus décisifs en 2024',
      slug: { current: 'stats-joueurs-decisifs' },
      excerpt: 'Buts + passes décisives : le classement qui fait mal',
      mainImage: {
        asset: { _ref: 'https://picsum.photos/600/400?random=15' }
      },
      publishedAt: '2024-03-18',
      categories: [{ title: 'Joueurs' }],
      readingTime: 6
    }
  ],
  'success-story': [
    {
      _id: '1',
      title: 'Kylian Mbappé : Du bonhomme de Bondy au Real Madrid',
      slug: { current: 'mbappe-parcours' },
      excerpt: 'Retour sur le parcours incroyable du prodige français devenu légende',
      mainImage: {
        asset: { _ref: 'https://picsum.photos/600/400?random=16' }
      },
      publishedAt: '2024-03-20',
      categories: [{ title: 'Joueurs' }],
      readingTime: 10
    },
    {
      _id: '2',
      title: 'Jude Bellingham : Le teenager qui règne sur Madrid',
      slug: { current: 'bellingham-story' },
      excerpt: 'À 20 ans, il est déjà le patron du Real. Comment c\'est possible ?',
      mainImage: {
        asset: { _ref: 'https://picsum.photos/600/400?random=17' }
      },
      publishedAt: '2024-03-19',
      categories: [{ title: 'Joueurs' }],
      readingTime: 8
    },
    {
      _id: '3',
      title: 'Lamine Yamal : La pépite qui affole l\'Europe',
      slug: { current: 'yamal-pepite' },
      excerpt: '16 ans, titulaire au Barça et en sélection : portrait d\'un phénomène',
      mainImage: {
        asset: { _ref: 'https://picsum.photos/600/400?random=18' }
      },
      publishedAt: '2024-03-18',
      categories: [{ title: 'Joueurs' }],
      readingTime: 7
    }
  ]
};

const ContentSection: React.FC<ContentSectionProps> = ({
  sectionType = 'emission'
}) => {
  const [items, setItems] = useState<SanityArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dataSource, setDataSource] = useState<'cms' | 'mock'>('cms');

  // Configuration OCTOGOAL - Style unifié pink-to-blue
  const getTypeConfig = () => {
    // Style unifié pour toutes les sections
    const baseStyle = {
      gradient: 'from-pink-500 to-blue-500',
      bgGradient: 'from-pink-900/20 via-blue-900/10 to-transparent',
      borderColor: 'border-pink-500/20'
    };

    switch (sectionType) {
      case 'emission':
        return {
          ...baseStyle,
          icon: PlayCircle,
          link: '/emissions',
          label: 'Émissions Octogoal',
          title: 'Les émissions Octogoal',
          description: 'Réactions live, débats enflammés et analyses décalées',
          emptyMessage: 'Nouvelles émissions en préparation',
          actionText: 'Regarder'
        };
      case 'business-idea':
        return {
          ...baseStyle,
          icon: Trophy,
          link: '/rubrique/matchs',
          label: 'Matchs & Analyses',
          title: 'Les matchs du moment',
          description: 'Notes, compos, stats et analyses des rencontres',
          emptyMessage: 'Analyses en cours',
          actionText: 'Lire'
        };
      case 'success-story':
        return {
          ...baseStyle,
          icon: Star,
          link: '/rubrique/joueurs',
          label: 'Portraits de joueurs',
          title: 'Les joueurs qui marquent l\'histoire',
          description: 'Parcours, stats et moments légendaires des stars du foot',
          emptyMessage: 'Nouveaux portraits en préparation',
          actionText: 'Découvrir'
        };
      default:
        return {
          ...baseStyle,
          icon: PlayCircle,
          link: '/articles',
          label: 'Contenus',
          title: 'Nos contenus',
          description: 'Le meilleur du foot',
          emptyMessage: 'Contenus en préparation',
          actionText: 'Voir'
        };
    }
  };

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setIsLoading(true);
        const articles = await getAllArticles();
        
        if (articles && articles.length > 0) {
          let filtered = articles;
          
          if (sectionType === 'emission') {
            filtered = articles.filter((a) =>
              a.categories?.some((c) =>
                ['vidéos', 'émissions', 'emission', 'videos'].includes(c.title?.toLowerCase() || c.slug?.current?.toLowerCase() || '')
              )
            );
          } else if (sectionType === 'business-idea') {
            filtered = articles.filter((a) =>
              a.categories?.some((c) =>
                ['matchs', 'match'].includes(c.title?.toLowerCase() || c.slug?.current?.toLowerCase() || '')
              )
            );
          } else if (sectionType === 'success-story') {
            filtered = articles.filter((a) =>
              a.categories?.some((c) =>
                ['joueurs', 'joueur'].includes(c.title?.toLowerCase() || c.slug?.current?.toLowerCase() || '')
              )
            );
          }
          
          if (filtered.length >= 3) {
            setItems(filtered.slice(0, 3));
            setDataSource('cms');
          } else {
            setItems(mockItems[sectionType] || []);
            setDataSource('mock');
          }
        } else {
          setItems(mockItems[sectionType] || []);
          setDataSource('mock');
        }
      } catch (error) {
        console.error('Erreur lors du chargement:', error);
        setItems(mockItems[sectionType] || []);
        setDataSource('mock');
      } finally {
        setIsLoading(false);
      }
    };

    fetchItems();
  }, [sectionType]);

  const config = getTypeConfig();
  const Icon = config.icon;

  if (isLoading) {
    return (
      <section className="py-20">
        <div className="container flex justify-center">
          <LoadingSpinner />
        </div>
      </section>
    );
  }

  if (items.length === 0) {
    return null;
  }

  return (
    <ErrorBoundary>
      <section className="relative py-20 overflow-hidden">
        {/* Background */}
        <div className={`absolute inset-0 bg-gradient-to-b ${config.bgGradient} pointer-events-none`} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent,rgba(0,0,0,0.5))] pointer-events-none" />
        
        <div className="container relative">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <div className="flex items-start justify-between mb-8">
              <div className="flex-1 max-w-3xl">
                {/* Badge octogonal */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  className="inline-flex items-center gap-3 mb-6"
                >
                  <div
                    className={`p-2.5 bg-gradient-to-br ${config.gradient} shadow-xl`}
                    style={{ clipPath: octagonClip }}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                    {config.label}
                  </span>
                </motion.div>
                
                {/* Titre - HARDCODÉ */}
                <h2 className="text-4xl md:text-5xl font-bold mb-4">
                  <span className="text-white">{config.title}</span>
                </h2>
                
                {/* Description - HARDCODÉ */}
                <p className="text-lg text-gray-400 leading-relaxed">
                  {config.description}
                </p>
              </div>

              {/* Indicateur live octogonal */}
              {dataSource === 'cms' && (
                <motion.div
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="hidden lg:flex items-center gap-2 px-4 py-2 bg-pink-500/10 border border-pink-500/20"
                  style={{ clipPath: octagonClipSubtle }}
                >
                  <div className="w-2 h-2 bg-pink-500 rounded-full" />
                  <span className="text-xs text-pink-400 font-medium">Live</span>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Grille d'articles */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {items.map((item, index) => (
              <motion.article
                key={item._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ 
                  delay: index * 0.15,
                  type: "spring",
                  stiffness: 100
                }}
                className="group"
              >
                <Link
                  to={`/article/${item.slug?.current}`}
                  className="block h-full"
                >
                  <div
                    className={`relative h-full bg-gradient-to-b from-gray-900/50 to-black/50 backdrop-blur-sm overflow-hidden border ${config.borderColor} hover:border-white/30 transition-all duration-500 hover:shadow-2xl hover:-translate-y-1`}
                    style={{ clipPath: octagonClipCard }}
                  >

                    {/* Image */}
                    <div className="relative aspect-[16/9] overflow-hidden">
                      <SafeImage
                        source={item.mainImage}
                        alt={item.title}
                        className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
                      />

                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60" />

                      {/* Play button pour émissions - octogonal */}
                      {sectionType === 'emission' && (
                        <motion.div
                          initial={{ scale: 0 }}
                          whileHover={{ scale: 1.1 }}
                          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
                        >
                          <div
                            className={`p-5 bg-gradient-to-br ${config.gradient} shadow-2xl`}
                            style={{ clipPath: octagonClip }}
                          >
                            <PlayCircle className="w-10 h-10 text-white" />
                          </div>
                        </motion.div>
                      )}

                    </div>

                    {/* Contenu */}
                    <div className="p-6 space-y-4">
                      {/* Guest/Category - Style unifié */}
                      {(item.guest || item.categories?.[0]) && (
                        <div className="text-xs font-semibold uppercase tracking-wider text-pink-400">
                          {item.guest ? `Avec ${item.guest}` : item.categories[0].title}
                        </div>
                      )}
                      
                      {/* Titre */}
                      <h3 className="text-xl font-bold text-white line-clamp-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-pink-400 group-hover:to-blue-400 transition-all">
                        {item.title}
                      </h3>
                      
                      {/* Description */}
                      <p className="text-gray-400 text-sm line-clamp-3 leading-relaxed">
                        {item.excerpt}
                      </p>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 border-t border-white/5">
                        <time className="text-xs text-gray-500">
                          {new Date(item.publishedAt || '').toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long'
                          })}
                        </time>
                        
                        <motion.span
                          className="flex items-center gap-2 text-xs font-medium text-pink-400"
                          whileHover={{ x: 5 }}
                        >
                          {config.actionText}
                          <ArrowRight className="w-3.5 h-3.5" />
                        </motion.span>
                      </div>
                    </div>

                    {/* Accent line */}
                    <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${config.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left`} />
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>

          {/* CTA octogonal */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex justify-center"
          >
            <Link
              to={config.link}
              className={`group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r ${config.gradient} font-semibold text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-0.5`}
              style={{ clipPath: octagonClipSubtle }}
            >
              <span>Voir tout</span>
              <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />

              {/* Shine effect */}
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ clipPath: octagonClipSubtle }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
              </div>
            </Link>
          </motion.div>
        </div>
      </section>
    </ErrorBoundary>
  );
};

export default ContentSection;
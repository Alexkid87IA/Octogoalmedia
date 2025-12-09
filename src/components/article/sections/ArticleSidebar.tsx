// src/components/article/sections/ArticleSidebar.tsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Share2, ArrowRight, Clock, Sparkles, PenTool, Zap,
  TrendingUp, Hash, Users, Calendar, MessageCircle,
  BookOpen, Award, Eye, ThumbsUp, Bookmark, Instagram,
  Bell, Star
} from "lucide-react";
import { SanityArticle, VerticalColors, TableOfContentsHeading } from "../../../types/article.types";
import ArticleAuthor from "../ui/ArticleAuthor";
import TableOfContents from "../ui/TableOfContents";
import ArticleCTA from "../ui/ArticleCTA";

interface ArticleSidebarProps {
  article: SanityArticle;
  relatedArticles: SanityArticle[];
  latestArticles?: SanityArticle[];
  headings: TableOfContentsHeading[] | null;
  activeSection: string;
  scrollProgress: number;
  colors: VerticalColors;
  onShare: () => void;
}

const ArticleSidebar: React.FC<ArticleSidebarProps> = ({
  article,
  relatedArticles,
  latestArticles = [],
  headings,
  activeSection,
  scrollProgress,
  colors,
  onShare
}) => {
  const [popularArticles, setPopularArticles] = useState<SanityArticle[]>([]);
  const [showMoreRelated, setShowMoreRelated] = useState(false);
  const [showMoreLatest, setShowMoreLatest] = useState(false);
  
  // Fonction pour formater la date relative
  const getRelativeTime = (date: string) => {
    const now = new Date();
    const publishedDate = new Date(date);
    const diffInMs = now.getTime() - publishedDate.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return "Aujourd'hui";
    if (diffInDays === 1) return "Hier";
    if (diffInDays < 7) return `Il y a ${diffInDays} jours`;
    if (diffInDays < 30) return `Il y a ${Math.floor(diffInDays / 7)} semaines`;
    if (diffInDays < 365) return `Il y a ${Math.floor(diffInDays / 30)} mois`;
    return `Il y a ${Math.floor(diffInDays / 365)} ans`;
  };

  // Charger les articles populaires
  useEffect(() => {
    // Simuler les articles populaires (à remplacer par un vrai appel API)
    setPopularArticles(relatedArticles.slice(0, 5));
  }, [relatedArticles]);

  // Tags populaires mockés
  const popularTags = [
    { name: 'Innovation', count: 45, color: 'from-blue-400 to-cyan-400' },
    { name: 'Leadership', count: 38, color: 'from-purple-400 to-violet-400' },
    { name: 'IA', count: 32, color: 'from-green-400 to-emerald-400' },
    { name: 'Startup', count: 28, color: 'from-orange-400 to-red-400' },
    { name: 'Mindset', count: 24, color: 'from-pink-400 to-rose-400' },
    { name: 'Growth', count: 22, color: 'from-indigo-400 to-blue-400' },
    { name: 'Tech', count: 20, color: 'from-yellow-400 to-orange-400' },
    { name: 'Culture', count: 18, color: 'from-teal-400 to-cyan-400' }
  ];
  
  return (
    <div className="space-y-8">
        
        {/* Encart Auteur - Desktop */}
        {article.author && (
          <ArticleAuthor 
            author={article.author}
            publishedAt={article.publishedAt}
            colors={colors}
            variant="desktop"
          />
        )}
        
        {/* Table des matières DESKTOP */}
        {headings && headings.length > 0 && (
          <TableOfContents
            headings={headings}
            activeSection={activeSection}
            scrollProgress={scrollProgress}
            colors={colors}
            variant="desktop"
          />
        )}

        {/* Encart Verticales - NOUVEAU DESIGN */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 via-black to-gray-900 p-6 border border-white/10">
          {/* Effet de fond animé */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 via-purple-500/20 to-emerald-500/20 blur-3xl" />
          </div>
          
          {/* Contenu */}
          <div className="relative">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-white">
                NOS 4 UNIVERS
              </h3>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {[
                { 
                  name: 'Story', 
                  slug: 'story', 
                  gradient: 'from-orange-500 to-red-500',
                  bgGradient: 'from-orange-500/10 to-red-500/10',
                  icon: BookOpen,
                  description: 'Récits inspirants'
                },
                { 
                  name: 'Business', 
                  slug: 'business', 
                  gradient: 'from-blue-500 to-cyan-500',
                  bgGradient: 'from-blue-500/10 to-cyan-500/10',
                  icon: TrendingUp,
                  description: 'Stratégies & succès'
                },
                { 
                  name: 'Mental', 
                  slug: 'mental', 
                  gradient: 'from-purple-500 to-violet-500',
                  bgGradient: 'from-purple-500/10 to-violet-500/10',
                  icon: Sparkles,
                  description: 'Mindset & bien-être'
                },
                { 
                  name: 'Society', 
                  slug: 'society', 
                  gradient: 'from-green-500 to-emerald-500',
                  bgGradient: 'from-green-500/10 to-emerald-500/10',
                  icon: Users,
                  description: 'Société & impact'
                }
              ].map((vertical) => {
                const Icon = vertical.icon;
                return (
                  <Link
                    key={vertical.slug}
                    to={`/rubrique/${vertical.slug}`}
                    className="group relative overflow-hidden rounded-xl transition-all duration-300 hover:scale-105"
                  >
                    {/* Fond avec gradient subtil */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${vertical.bgGradient} opacity-50 group-hover:opacity-100 transition-opacity`} />
                    
                    {/* Bordure gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${vertical.gradient} opacity-0 group-hover:opacity-100 transition-opacity`} 
                         style={{ padding: '1px' }}>
                      <div className="h-full w-full rounded-xl bg-black" />
                    </div>
                    
                    {/* Contenu */}
                    <div className="relative p-4 flex flex-col items-center text-center space-y-2">
                      {/* Icône Lucide */}
                      <div className={`p-2.5 rounded-lg bg-gradient-to-br ${vertical.gradient} mb-1`}>
                        <Icon size={20} className="text-white" />
                      </div>
                      
                      {/* Nom avec gradient */}
                      <h4 className={`font-bold text-white bg-gradient-to-r ${vertical.gradient} bg-clip-text group-hover:text-transparent transition-all`}>
                        {vertical.name}
                      </h4>
                      
                      {/* Description */}
                      <p className="text-xs text-gray-500 group-hover:text-gray-400 transition-colors">
                        {vertical.description}
                      </p>
                      
                      {/* Indicateur de hover */}
                      <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${vertical.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`} />
                    </div>
                  </Link>
                );
              })}
            </div>
            
            <Link
              to="/articles"
              className="mt-5 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 transition-all group"
            >
              <span className="text-sm text-gray-400 group-hover:text-white transition-colors">
                Explorer tous les contenus
              </span>
              <ArrowRight size={14} className="text-gray-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
            </Link>
          </div>
        </div>

        {/* Stats de l'article - Partage uniquement */}
        <div 
          className="backdrop-blur-md rounded-2xl p-6"
          style={{
            background: colors.bgLight,
            border: `1px solid ${colors.borderColor}`
          }}
        >
          <button
            onClick={onShare}
            className="w-full flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-white/5 transition-all"
          >
            <Share2 size={24} className="text-gray-400" />
            <span className="text-sm text-gray-400">Partager cet article</span>
          </button>
        </div>

        {/* NOUVEAU : Articles les plus lus */}
        <div className="bg-gray-900/30 backdrop-blur-md rounded-2xl border border-gray-700/50 p-6">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp size={18} className="text-yellow-400" />
            <h3 className="text-lg font-semibold text-white">
              Les plus lus
            </h3>
          </div>
          
          <div className="space-y-3">
            {popularArticles.slice(0, 5).map((popular, index) => (
              <Link
                key={popular._id}
                to={`/article/${popular.slug.current}`}
                className="group block"
              >
                <div className="flex items-start gap-3 py-2 hover:bg-white/5 rounded-lg px-2 transition-all">
                  <span className="text-2xl font-bold text-gray-600 mt-1">
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-white line-clamp-2 group-hover:text-opacity-100 text-opacity-80">
                      {popular.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                      <Eye size={12} />
                      <span>{Math.floor(Math.random() * 5000) + 1000} vues</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Derniers articles publiés - Extensible */}
        {latestArticles && latestArticles.length > 0 && (
          <div 
            className="backdrop-blur-md rounded-2xl p-6"
            style={{
              background: `linear-gradient(135deg, ${colors.bgLight}, transparent)`,
              border: `1px solid ${colors.borderColor}`
            }}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div 
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{ backgroundColor: colors.primary }}
                />
                <h3 className="text-lg font-semibold text-white">
                  Publié récemment
                </h3>
              </div>
              <Link 
                to="/articles"
                className="text-sm transition-colors"
                style={{ color: colors.textColor }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = colors.primary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = colors.textColor;
                }}
              >
                Tous →
              </Link>
            </div>
            
            <div className="space-y-2">
              {latestArticles.slice(0, showMoreLatest ? 12 : 6).map((latest, index) => (
                <Link
                  key={latest._id}
                  to={`/article/${latest.slug.current}`}
                  className="group block"
                >
                  <div className="flex items-start gap-3 py-2 px-2 rounded-lg hover:bg-white/5 transition-all duration-300">
                    <span 
                      className="text-xs font-bold mt-1 opacity-40"
                      style={{ color: colors.textColor }}
                    >
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-white text-sm line-clamp-2 group-hover:text-opacity-100 text-opacity-90 transition-all">
                        {latest.title}
                      </h4>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-gray-500">
                          {getRelativeTime(latest.publishedAt || latest._createdAt)}
                        </span>
                        {latest.categories?.[0]?.title && (
                          <>
                            <span className="text-gray-600">•</span>
                            <span 
                              className="text-xs font-medium"
                              style={{ color: colors.textColor, opacity: 0.7 }}
                            >
                              {latest.categories[0].title}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <ArrowRight 
                      size={14} 
                      className="mt-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ color: colors.primary }}
                    />
                  </div>
                </Link>
              ))}
            </div>
            
            {latestArticles.length > 6 && (
              <button
                onClick={() => setShowMoreLatest(!showMoreLatest)}
                className="mt-4 w-full py-2 text-sm text-gray-400 hover:text-white transition-colors"
              >
                {showMoreLatest ? 'Voir moins' : `Voir ${latestArticles.length - 6} articles de plus`}
              </button>
            )}
          </div>
        )}

        {/* NOUVEAU : Tags populaires */}
        <div className="bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Hash size={18} className="text-cyan-400" />
            <h3 className="text-lg font-semibold text-white">
              Tags populaires
            </h3>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {popularTags.map((tag) => (
              <Link
                key={tag.name}
                to={`/tag/${tag.name.toLowerCase()}`}
                className="group relative overflow-hidden rounded-full px-3 py-1.5 bg-white/5 hover:bg-white/10 transition-all"
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${tag.color} opacity-0 group-hover:opacity-20 transition-opacity`} />
                <div className="relative flex items-center gap-1">
                  <span className="text-xs font-medium text-white">
                    {tag.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    {tag.count}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* CTA Racontez votre histoire */}
        <div 
          className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-violet-600/10 to-purple-600/10 backdrop-blur-md border border-violet-500/20"
        >
          <div 
            className="absolute inset-0 opacity-30"
            style={{
              background: 'linear-gradient(45deg, transparent 30%, rgba(139, 92, 246, 0.1) 50%, transparent 70%)',
            }}
          />
          
          <div className="absolute top-2 right-2 opacity-20">
            <PenTool size={40} className="text-violet-400" />
          </div>
          
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={16} className="text-violet-400" />
              <span className="text-xs font-bold text-violet-400 uppercase tracking-wider">
                Nouvelle section
              </span>
            </div>
            
            <h3 className="text-lg font-bold text-white mb-2">
              Votre histoire mérite d'être racontée
            </h3>
            
            <p className="text-sm text-gray-400 mb-4">
              Partagez votre parcours entrepreneurial et inspirez la communauté
            </p>
            
            <Link
              to="/create-with-roger"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-500 to-purple-500 text-white text-sm font-semibold rounded-lg hover:shadow-lg hover:shadow-violet-500/25 transition-all group"
            >
              <span>Raconter mon histoire</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              <span>Bientôt disponible</span>
            </div>
          </div>
        </div>

        {/* Articles similaires - Extensible */}
        {relatedArticles.length > 0 && (
          <div className="bg-gray-900/30 backdrop-blur-md rounded-2xl border border-gray-700/50 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">
                Articles similaires
              </h3>
              <Link 
                to="/articles"
                className="text-sm transition-colors"
                style={{ color: colors.textColor }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = colors.primary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = colors.textColor;
                }}
              >
                Voir tous →
              </Link>
            </div>
            
            <div className="space-y-4">
              {relatedArticles.slice(0, showMoreRelated ? 9 : 3).map((related) => (
                <Link
                  key={related._id}
                  to={`/article/${related.slug.current}`}
                  className="group block"
                >
                  <div className="flex gap-4 p-3 rounded-xl hover:bg-white/5 transition-all duration-300">
                    {related.mainImage && related.mainImage.asset && related.mainImage.asset._ref && (
                      <img 
                        src={`https://cdn.sanity.io/images/5rn8u6ed/production/${related.mainImage.asset._ref.replace('image-', '').replace('-jpg', '.jpg').replace('-png', '.png').replace('-webp', '.webp')}?w=120&h=80&fit=crop&auto=format`}
                        alt={related.title}
                        className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 
                        className="font-medium text-white transition-colors line-clamp-2 text-sm mb-2"
                        style={{
                          color: '#ffffff'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = colors.textColor;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = '#ffffff';
                        }}
                      >
                        {related.title}
                      </h4>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            
            {relatedArticles.length > 3 && (
              <button
                onClick={() => setShowMoreRelated(!showMoreRelated)}
                className="mt-4 w-full py-2 text-sm text-gray-400 hover:text-white transition-colors"
              >
                {showMoreRelated ? 'Voir moins' : `Voir ${Math.min(6, relatedArticles.length - 3)} articles de plus`}
              </button>
            )}
          </div>
        )}

        {/* QR Code Instagram - REMPLACE LA SECTION STATISTIQUES */}
        <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 border border-white/10">
          <div className="flex items-center gap-2 mb-4">
            <Instagram size={18} className="text-pink-500" />
            <h3 className="text-lg font-semibold text-white">
              Suivez-nous sur Instagram
            </h3>
          </div>
          
          <div className="flex flex-col items-center">
            {/* QR Code avec l'image hébergée sur Imgur */}
            <div className="bg-white p-4 rounded-xl mb-4">
              <img 
                src="https://i.imgur.com/DcSvEmy.png"
                alt="QR Code Instagram Octogoal Media"
                className="w-40 h-40 object-contain"
              />
            </div>
            
            {/* Username Instagram cliquable */}
            <a 
              href="https://www.instagram.com/octogoal.media" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-white hover:text-pink-400 transition-colors group"
            >
              <span className="text-sm font-medium">@octogoal.media</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </a>
            
            {/* Texte descriptif */}
            <p className="text-xs text-gray-400 text-center mt-3">
              Scannez pour découvrir nos stories exclusives
            </p>
          </div>
        </div>

        {/* NEWSLETTER - VERSION "BIENTÔT DISPONIBLE" */}
        <div 
          className="rounded-2xl p-6 border"
          style={{
            background: `linear-gradient(135deg, ${colors.bgLight}, ${colors.bgMedium})`,
            borderColor: colors.borderColor
          }}
        >
          {/* Badge Bientôt disponible */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <MessageCircle size={18} style={{ color: colors.primary }} />
              <h3 className="text-lg font-semibold text-white">
                Newsletter exclusive
              </h3>
            </div>
            <span className="px-2 py-1 bg-amber-500/20 text-amber-400 rounded text-xs font-bold flex items-center gap-1">
              <Clock size={10} />
              Bientôt
            </span>
          </div>
          
          {/* Icône animée */}
          <div className="flex justify-center my-4">
            <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center animate-pulse">
              <Bell size={24} className="text-black" />
            </div>
          </div>
          
          <p className="text-sm text-gray-400 mb-4 text-center">
            Notre newsletter est en préparation. Revenez bientôt pour recevoir nos meilleurs articles !
          </p>
          
          {/* Bouton désactivé */}
          <div className="w-full py-2 rounded-lg font-medium text-white/50 text-center bg-white/10 border border-white/10 cursor-not-allowed">
            <div className="flex items-center justify-center gap-2">
              <Sparkles size={14} className="text-amber-400" />
              <span className="text-sm">Disponible prochainement</span>
            </div>
          </div>
          
          {/* Indicateurs */}
          <div className="flex items-center justify-center gap-1 mt-3">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={10} className="fill-amber-400 text-amber-400" />
            ))}
          </div>
          
          <p className="text-xs text-gray-500 mt-2 text-center">
            Pas de spam, désabonnement en 1 clic
          </p>
        </div>

        {/* CTA Club Élite */}
        <ArticleCTA colors={colors} />
    </div>
  );
};

export default ArticleSidebar;
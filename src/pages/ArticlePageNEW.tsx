// src/pages/ArticlePageNEW.tsx - Version refactorisée et modulaire pour test
import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Share2, Heart } from "lucide-react";

// Composants existants
import { SEO } from "../components/common/SEO";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { ErrorMessage } from "../components/common/ErrorMessage";
import ErrorBoundary from "../components/common/ErrorBoundary";
import { Footer } from "../components/layout/Footer";

// Nouveaux composants modulaires
import {
  ArticleHero,
  ArticleContent,
  ArticleSidebar,
  RelatedArticles,
  ShareModal,
  TableOfContents,
  ArticleAuthor
} from "../components/article";

// Système de données
import { LocalDataAPI } from "../utils/localDataSystem";
import { getArticleBySlug, getAllArticles } from "../utils/sanityAPI";
import { 
  cleanPortableText, 
  getVerticalColors, 
  generateTableOfContents 
} from "../utils/articleUtils";

// Types
import { SanityArticle } from "../types/article.types";

const ArticlePageNEW: React.FC<{ isEmission?: boolean }> = ({ isEmission = false }) => {
  const { slug } = useParams<{ slug: string }>();
  
  // États principaux
  const [article, setArticle] = useState<SanityArticle | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<SanityArticle[]>([]);
  const [latestArticles, setLatestArticles] = useState<SanityArticle[]>([]); // NOUVEAU
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // États UI
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [localLikes, setLocalLikes] = useState(0);
  const [dataSource, setDataSource] = useState<'local' | 'sanity'>('local');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('intro');
  const [showSharePopup, setShowSharePopup] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Refs pour sidebar sticky JS
  const sidebarRef = useRef<HTMLDivElement>(null);
  const sidebarContainerRef = useRef<HTMLDivElement>(null);
  const [sidebarStyle, setSidebarStyle] = useState<React.CSSProperties>({});

  // Sidebar sticky avec JavaScript (plus fiable que CSS sticky)
  useEffect(() => {
    const handleSidebarScroll = () => {
      if (!sidebarRef.current || !sidebarContainerRef.current) return;

      const container = sidebarContainerRef.current;
      const sidebar = sidebarRef.current;
      const containerRect = container.getBoundingClientRect();
      const sidebarHeight = sidebar.offsetHeight;
      const navbarOffset = 96; // Espace sous la navbar
      const windowHeight = window.innerHeight;

      // Position du container par rapport au viewport
      const containerTop = containerRect.top;
      const containerBottom = containerRect.bottom;

      // Cas 1: Le container est en dessous du viewport -> sidebar en position normale
      if (containerTop > navbarOffset) {
        setSidebarStyle({
          position: 'relative',
          top: 0,
        });
      }
      // Cas 2: On a scrollé et la sidebar doit être fixe
      else if (containerTop <= navbarOffset && containerBottom > sidebarHeight + navbarOffset) {
        setSidebarStyle({
          position: 'fixed',
          top: navbarOffset,
          width: container.offsetWidth,
        });
      }
      // Cas 3: On arrive à la fin du container -> sidebar en position absolute en bas
      else if (containerBottom <= sidebarHeight + navbarOffset) {
        setSidebarStyle({
          position: 'absolute',
          bottom: 0,
          top: 'auto',
          width: '100%',
        });
      }
    };

    // Écouter le scroll
    window.addEventListener('scroll', handleSidebarScroll, { passive: true });
    window.addEventListener('resize', handleSidebarScroll);

    // Appeler une fois au chargement
    handleSidebarScroll();

    return () => {
      window.removeEventListener('scroll', handleSidebarScroll);
      window.removeEventListener('resize', handleSidebarScroll);
    };
  }, [article]);

  // Gestion du scroll
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(Math.min(progress, 100));

      // Détection de la section active
      const sections = document.querySelectorAll('section[id], h2[id], h3[id]');
      sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 150 && rect.bottom >= 150) {
          setActiveSection(section.id);
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Chargement de l'article
  useEffect(() => {
    const loadArticle = async () => {
      if (!slug) {
        setError("Slug de l'article manquant.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        
        const urlParams = new URLSearchParams(window.location.search);
        const isPreview = urlParams.get('preview') === 'true';
        
        let fetchedArticle = null;
        
        try {
          fetchedArticle = await getArticleBySlug(slug, isPreview);
            
          if (fetchedArticle) {
            setDataSource('sanity');
            
            // NETTOYAGE DES DONNÉES
            if (fetchedArticle.excerpt) {
              fetchedArticle.excerpt = cleanPortableText(fetchedArticle.excerpt);
            }
            
            if (fetchedArticle.author?.bio) {
              fetchedArticle.author.bio = cleanPortableText(fetchedArticle.author.bio);
            }
            
            if (fetchedArticle.keyPoints && !Array.isArray(fetchedArticle.keyPoints)) {
              delete fetchedArticle.keyPoints;
            } else if (fetchedArticle.keyPoints && Array.isArray(fetchedArticle.keyPoints)) {
              fetchedArticle.keyPoints = fetchedArticle.keyPoints.map((point: any) => 
                typeof point === 'string' ? point : cleanPortableText(point)
              ).filter(Boolean);
            }
          }
        } catch (sanityError) {
          console.error("Erreur Sanity:", sanityError);
        }
        
        if (!fetchedArticle) {
          fetchedArticle = await LocalDataAPI.getArticleBySlug(slug);
          setDataSource('local');
        }
        
        if (!fetchedArticle) {
          setError("Article non trouvé");
        } else {
          setArticle(fetchedArticle);
          setLocalLikes(fetchedArticle.likes || 0);
          
          const savedBookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
          setIsBookmarked(savedBookmarks.includes(fetchedArticle._id));
          
          // Charger les articles liés
          try {
            const allArticles = await getAllArticles();
            
            const cleanedArticles = allArticles.map((a) => ({
              ...a,
              excerpt: cleanPortableText(a.excerpt)
            }));

            let filtered: typeof cleanedArticles | undefined;
            if (fetchedArticle.categories && fetchedArticle.categories.length > 0) {
              const categoryIds = fetchedArticle.categories.map((c) => c._id);
              filtered = cleanedArticles
                .filter((a) => {
                  if (a._id === fetchedArticle._id) return false;
                  if (a.categories && a.categories.length > 0) {
                    return a.categories.some((c) => categoryIds.includes(c._id));
                  }
                  return false;
                });
            }

            if (!filtered || filtered.length < 6) {
              const otherArticles = cleanedArticles
                .filter((a) => a._id !== fetchedArticle._id)
                .filter((a) => !filtered?.some((f) => f._id === a._id));

              filtered = [...(filtered || []), ...otherArticles].slice(0, 6);
            }

            setRelatedArticles(filtered || []);

            // NOUVEAU : Charger les derniers articles publiés
            const allArticlesSorted = cleanedArticles
              .filter((a) => a._id !== fetchedArticle._id) // Exclure l'article actuel
              .sort((a, b) => {
                const dateA = new Date(a.publishedAt || a._createdAt || 0).getTime();
                const dateB = new Date(b.publishedAt || b._createdAt || 0).getTime();
                return dateB - dateA; // Plus récent en premier
              })
              .slice(0, 6); // Prendre les 6 derniers
            
            setLatestArticles(allArticlesSorted);
            
          } catch (err) {
            console.error("Erreur chargement articles liés:", err);
          }
        }
      } catch (err) {
        console.error("Erreur lors du chargement:", err);
        setError("Erreur lors du chargement de l'article");
      } finally {
        setIsLoading(false);
      }
    };

    loadArticle();
  }, [slug, isEmission]);

  // Scroll en haut quand on change d'article
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  // Gestionnaires - mémorisés pour éviter les re-renders
  const handleLike = useCallback(() => {
    setIsLiked(prev => !prev);
    setLocalLikes(prev => isLiked ? prev - 1 : prev + 1);
  }, [isLiked]);

  const handleBookmark = useCallback(() => {
    if (!article) return;

    const savedBookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    if (isBookmarked) {
      const filtered = savedBookmarks.filter((id: string) => id !== article._id);
      localStorage.setItem('bookmarks', JSON.stringify(filtered));
    } else {
      savedBookmarks.push(article._id);
      localStorage.setItem('bookmarks', JSON.stringify(savedBookmarks));
    }
    setIsBookmarked(prev => !prev);
  }, [article, isBookmarked]);

  const handleShare = useCallback(() => {
    setShowSharePopup(true);
  }, []);

  // Variables dérivées - mémorisées pour éviter les re-renders
  const colors = useMemo(() => getVerticalColors(article), [article]);
  const headings = useMemo(() => generateTableOfContents(article), [article]);
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareTitle = article?.title || '';
  const shareText = article?.excerpt || '';
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <ErrorMessage message={error || "Article non trouvé"} />
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-lg text-white transition-colors mt-4"
          >
            <ArrowLeft size={20} />
            Retour à l'accueil
          </Link>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <SEO
        title={article.title}
        description={article.excerpt}
        keywords={article.tags?.map(tag => tag.title).join(', ')}
        author={article.author?.name}
        publishedTime={article.publishedAt}
        image={article.mainImage}
      />

      {/* Styles CSS pour scrollbar personnalisée et fix overflow mobile */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
        /* Fix pour empêcher le scroll horizontal sur mobile */
        html, body {
          overflow-x: hidden !important;
          max-width: 100vw !important;
          position: relative;
        }
        body {
          overscroll-behavior-x: none;
        }
        p, h1, h2, h3, h4, h5, h6, li, span {
          word-wrap: break-word;
          overflow-wrap: break-word;
        }
        #root, main {
          overflow-x: hidden !important;
        }
      `}</style>

      {/* Popup de partage */}
      <ShareModal
        isOpen={showSharePopup}
        onClose={() => setShowSharePopup(false)}
        shareUrl={shareUrl}
        shareTitle={shareTitle}
        shareText={shareText}
      />

      {/* Progress Bar avec couleur de la verticale */}
      <div 
        className={`fixed top-0 left-0 h-1 bg-gradient-to-r ${colors.gradient} z-[60] transition-all duration-300`}
        style={{ width: `${scrollProgress}%` }}
      />

      <div className="min-h-screen bg-black text-white overflow-x-hidden">
        {/* Hero Section */}
        <ArticleHero article={article} colors={colors} onShareClick={handleShare} />

        {/* Table des matières mobile */}
        {headings && headings.length > 0 && (
          <TableOfContents
            headings={headings}
            activeSection={activeSection}
            scrollProgress={scrollProgress}
            colors={colors}
            variant="mobile"
            mobileMenuOpen={mobileMenuOpen}
            setMobileMenuOpen={setMobileMenuOpen}
          />
        )}

        {/* Container principal avec layout 2 colonnes */}
        <div className="container mx-auto px-4 pt-4 pb-8 sm:pt-8 sm:pb-12 lg:py-16 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            
            {/* Colonne principale qui contient le contenu et les éléments mobile */}
            <div className="lg:col-span-8">
              {/* Encart Auteur - Version mobile uniquement */}
              {article.author && (
                <ArticleAuthor 
                  author={article.author}
                  publishedAt={article.publishedAt}
                  colors={colors}
                  variant="mobile"
                />
              )}

              {/* Contenu principal */}
              <ArticleContent
                article={article}
                colors={colors}
                isEmission={isEmission}
              />
            </div>

            {/* Sidebar droite - Desktop uniquement, sticky via JS */}
            <div
              ref={sidebarContainerRef}
              className="hidden lg:block lg:col-span-4 relative"
            >
              <div
                ref={sidebarRef}
                style={sidebarStyle}
              >
                <ArticleSidebar
                  article={article}
                  relatedArticles={relatedArticles}
                  latestArticles={latestArticles}
                  headings={headings}
                  activeSection={activeSection}
                  scrollProgress={scrollProgress}
                  colors={colors}
                  onShare={handleShare}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section Articles Recommandés */}
        <RelatedArticles 
          articles={relatedArticles}
          colors={colors}
        />

        {/* Barre d'actions flottante mobile - Glassmorphism */}
        <div className="fixed bottom-4 left-4 right-4 lg:hidden z-50">
          <div className="flex items-center justify-between gap-3 px-4 py-3 bg-black/70 backdrop-blur-2xl rounded-2xl border border-white/15 shadow-2xl">
            {/* Like */}
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                isLiked
                  ? 'bg-pink-500/20 text-pink-400'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Heart size={18} className={isLiked ? 'fill-current' : ''} />
              <span className="text-sm font-medium">{localLikes > 0 ? localLikes : ''}</span>
            </button>

            {/* Share - Central et plus grand */}
            <button
              onClick={handleShare}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-6 bg-gradient-to-r from-pink-500 to-blue-500 rounded-xl text-white font-medium transition-all hover:shadow-lg hover:shadow-pink-500/30"
            >
              <Share2 size={18} />
              <span className="text-sm">Partager</span>
            </button>

            {/* Bookmark */}
            <button
              onClick={handleBookmark}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                isBookmarked
                  ? 'bg-blue-500/20 text-blue-400'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill={isBookmarked ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
              </svg>
            </button>
          </div>
        </div>

      </div>

      {/* Footer */}
      <Footer />
    </ErrorBoundary>
  );
};

export default ArticlePageNEW;
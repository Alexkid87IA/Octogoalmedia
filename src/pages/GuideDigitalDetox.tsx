// src/pages/GuideDigitalDetox.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Clock, BookOpen, ArrowLeft } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

// Import des sections
import GuideHero from '../components/guide/sections/GuideHero';
import GuideIntro from '../components/guide/sections/GuideIntro';
import GuideComprendre from '../components/guide/sections/GuideComprendre';
import GuideStrategie from '../components/guide/sections/GuideStrategie';
import GuideOutils from '../components/guide/sections/GuideOutils';
import GuidePlanAction from '../components/guide/sections/GuidePlanAction';
import GuideAvance from '../components/guide/sections/GuideAvance';
import GuideConclusion from '../components/guide/sections/GuideConclusion';

// Import des composants utilitaires
import GuideTableOfContents from '../components/guide/GuideTableOfContents';
import GuideShareBar from '../components/guide/GuideShareBar';

// Import du Footer
import { Footer } from '../components/layout/Footer';

// Import des données
import { getGuideBySlug } from '../data/guidesData';
import { digitalDetoxContent } from '../data/guides/digitalDetoxContent';

const GuideDigitalDetox: React.FC = () => {
  const [activeSection, setActiveSection] = useState('intro');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isSticky, setIsSticky] = useState(false);
  
  const guide = getGuideBySlug('maitrise-digitale');

  // Gestion du scroll et de la progression
  useEffect(() => {
    const handleScroll = () => {
      // Calcul de la progression
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(Math.min(progress, 100));

      // Détection de la section active
      const sections = document.querySelectorAll('section[id]');
      sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 150 && rect.bottom >= 150) {
          setActiveSection(section.id);
        }
      });

      // Sticky sidebar
      setIsSticky(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!guide) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl mb-4">Guide non trouvé</h1>
          <Link to="/guides" className="text-purple-400 hover:underline">
            Retour aux guides
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Meta Tags SEO pour le partage */}
      <Helmet>
        <title>{guide.title} - {guide.subtitle} | High Value</title>
        <meta name="description" content={guide.excerpt} />
        
        {/* Open Graph pour Facebook/LinkedIn */}
        <meta property="og:title" content={`${guide.title} - ${guide.subtitle}`} />
        <meta property="og:description" content={guide.excerpt} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://highvalue.media/guides/maitrise-digitale" />
        <meta property="og:image" content="https://26.staticbtf.eno.do/v1/57-default/3f8dd22f1c8fc2e00a6a725e2b8e2793/media.jpg" />
        <meta property="og:site_name" content="High Value" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${guide.title} - ${guide.subtitle}`} />
        <meta name="twitter:description" content={guide.excerpt} />
        <meta name="twitter:image" content="https://26.staticbtf.eno.do/v1/57-default/3f8dd22f1c8fc2e00a6a725e2b8e2793/media.jpg" />
        
        {/* Auteur et date */}
        <meta name="author" content={guide.author} />
        {guide.publishedDate && <meta property="article:published_time" content={guide.publishedDate} />}
      </Helmet>

      <div className="min-h-screen bg-black text-white">
        {/* Progress Bar */}
        <div 
          className="fixed top-0 left-0 h-1 bg-gradient-to-r from-purple-500 to-violet-500 z-[60] transition-all duration-300"
          style={{ width: `${scrollProgress}%` }}
        />

        {/* Navigation Bar */}
        <nav className="sticky top-0 bg-black/80 backdrop-blur-lg border-b border-white/10 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-sm">
                <Link to="/" className="text-gray-400 hover:text-white transition-colors">
                  Accueil
                </Link>
                <ChevronRight size={16} className="text-gray-600" />
                <Link to="/guides" className="text-gray-400 hover:text-white transition-colors">
                  Guides
                </Link>
                <ChevronRight size={16} className="text-gray-600" />
                <span className="text-white font-medium">{guide.title}</span>
              </div>

              {/* Guide Info */}
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <div className="flex items-center gap-1">
                  <Clock size={14} />
                  <span>{guide.readingTime} min</span>
                </div>
                <div className="flex items-center gap-1">
                  <BookOpen size={14} />
                  <span>{digitalDetoxContent.length} sections</span>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <GuideHero guide={guide} />

        {/* Main Content */}
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left Sidebar - Table of Contents (Desktop) */}
            <div className="hidden lg:block lg:col-span-3">
              <div className={`${isSticky ? 'sticky top-24' : ''}`}>
                <GuideTableOfContents 
                  sections={digitalDetoxContent}
                  activeSection={activeSection}
                  scrollProgress={scrollProgress}
                />
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-6">
              {/* Mobile Back Button */}
              <Link 
                to="/guides"
                className="lg:hidden inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 mb-8"
              >
                <ArrowLeft size={18} />
                Retour aux guides
              </Link>

              {/* Sections */}
              <div className="space-y-24">
                <GuideIntro content={digitalDetoxContent[0]} />
                <GuideComprendre content={digitalDetoxContent[1]} />
                <GuideStrategie content={digitalDetoxContent[2]} />
                <GuideOutils content={digitalDetoxContent[3]} />
                <GuidePlanAction content={digitalDetoxContent[4]} />
                <GuideAvance content={digitalDetoxContent[5]} />
                <GuideConclusion content={digitalDetoxContent[6]} />
              </div>

              {/* CTA Final */}
              <div className="mt-24 p-8 bg-gradient-to-br from-purple-900/20 to-violet-900/20 rounded-2xl border border-purple-500/20">
                <h3 className="text-2xl font-bold mb-4">Prêt à transformer votre vie digitale ?</h3>
                <p className="text-gray-300 mb-6">
                  Rejoignez notre communauté et recevez des conseils exclusifs chaque semaine.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link 
                    to="/club"
                    className="px-6 py-3 bg-gradient-to-r from-purple-500 to-violet-500 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all text-center"
                  >
                    Rejoindre le Club Elite
                  </Link>
                  <Link 
                    to="/guides"
                    className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-lg font-medium transition-all text-center"
                  >
                    Voir d'autres guides
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Sidebar - Share & Actions (Desktop) */}
            <div className="hidden lg:block lg:col-span-3">
              <div className={`${isSticky ? 'sticky top-24' : ''}`}>
                <GuideShareBar guide={guide} />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Share Bar */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-lg border-t border-white/10 p-4 z-50">
          <GuideShareBar guide={guide} mobile={true} />
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
};

export default GuideDigitalDetox;
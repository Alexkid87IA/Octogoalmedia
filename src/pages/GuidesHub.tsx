// src/pages/GuidesHub.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Clock, 
  ArrowRight, 
  Sparkles,
  Lock,
  TrendingUp,
  Brain,
  Users,
  ChevronRight
} from 'lucide-react';
import { guides, getPublishedGuides, Guide } from '../data/guidesData';

const GuidesHub: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const publishedGuides = getPublishedGuides();
  
  // Catégories uniques
  const categories = ['all', ...Array.from(new Set(guides.map(g => g.category)))];
  
  // Filtrer les guides
  const filteredGuides = selectedCategory === 'all' 
    ? guides 
    : guides.filter(g => g.category === selectedCategory);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20" />
        
        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }} />
        </div>

        <div className="relative container mx-auto px-4 py-20">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm mb-8">
            <Link to="/" className="text-gray-400 hover:text-white transition-colors">
              Accueil
            </Link>
            <ChevronRight size={16} className="text-gray-600" />
            <span className="text-white font-medium">Guides Premium</span>
          </div>

          {/* Title */}
          <div className="max-w-4xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-violet-500">
                <BookOpen size={24} className="text-white" />
              </div>
              <span className="text-purple-400 font-semibold uppercase tracking-wider text-sm">
                Ressources Exclusives
              </span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Guides Premium
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Des guides complets et actionnables pour transformer votre vie, 
              votre mindset et votre business. Chaque guide est le résultat 
              de recherches approfondies et d'expériences concrètes.
            </p>

            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-gray-400">
                <Sparkles size={18} />
                <span>{publishedGuides.length} guides disponibles</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <Clock size={18} />
                <span>Mis à jour régulièrement</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <TrendingUp size={18} />
                <span>Contenus premium</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 border-t border-b border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-purple-500 to-violet-500 text-white'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                {category === 'all' ? 'Tous les guides' : category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Guides Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredGuides.map((guide) => (
              <div key={guide.id}>
                <GuideCard guide={guide} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 border-t border-white/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Vous avez une idée de guide ?
          </h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Nous sommes toujours à l'écoute de notre communauté. 
            Partagez vos idées de guides que vous aimeriez voir.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-violet-500 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all"
          >
            Suggérer un guide
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
};

// Composant GuideCard
const GuideCard: React.FC<{ guide: Guide }> = ({ guide }) => {
  const isPublished = guide.status === 'published';
  const isComingSoon = guide.status === 'coming-soon';

  const getCategoryIcon = (category: string) => {
    switch(category) {
      case 'Mental': return <Brain size={20} />;
      case 'Business': return <TrendingUp size={20} />;
      case 'Lifestyle': return <Users size={20} />;
      default: return <BookOpen size={20} />;
    }
  };

  return (
    <div className="group relative h-full">
      {/* Card Container */}
      <div 
        className={`relative h-full rounded-2xl overflow-hidden border transition-all duration-300 ${
          isPublished 
            ? 'border-white/10 hover:border-white/30 hover:shadow-2xl hover:shadow-purple-500/10' 
            : 'border-white/5 opacity-70'
        }`}
        style={{
          background: isPublished 
            ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(59, 130, 246, 0.05))' 
            : 'rgba(255, 255, 255, 0.02)'
        }}
      >
        {/* Featured Badge */}
        {guide.featured && (
          <div className="absolute top-4 right-4 z-10">
            <span className="px-3 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-black text-xs font-bold rounded-full">
              FEATURED
            </span>
          </div>
        )}

        {/* Coming Soon Overlay */}
        {isComingSoon && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-20 flex items-center justify-center">
            <div className="text-center">
              <Lock size={40} className="text-gray-400 mx-auto mb-2" />
              <p className="text-white font-semibold">Bientôt disponible</p>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="p-6 h-full flex flex-col">
          {/* Category & Reading Time */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div 
                className={`p-1.5 rounded-lg bg-gradient-to-br ${guide.color.gradient}`}
              >
                {getCategoryIcon(guide.category)}
              </div>
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                {guide.category}
              </span>
            </div>
            <div className="flex items-center gap-1 text-gray-500 text-xs">
              <Clock size={14} />
              <span>{guide.readingTime} min</span>
            </div>
          </div>

          {/* Title & Subtitle */}
          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-blue-400 group-hover:bg-clip-text transition-all">
            {guide.title}
          </h3>
          <p className="text-sm text-purple-400 mb-3">
            {guide.subtitle}
          </p>

          {/* Description */}
          <p className="text-gray-400 text-sm mb-4 flex-grow">
            {guide.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {guide.tags.slice(0, 3).map((tag, i) => (
              <span 
                key={i}
                className="px-2 py-1 bg-white/5 rounded-full text-xs text-gray-400"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* CTA Button */}
          {isPublished ? (
            <Link
              to={`/guides/${guide.slug}`}
              className="flex items-center justify-between w-full py-3 px-4 bg-white/5 hover:bg-white/10 rounded-lg transition-all group/btn"
            >
              <span className="text-white font-medium">Lire le guide</span>
              <ArrowRight size={18} className="text-gray-400 group-hover/btn:text-white group-hover/btn:translate-x-1 transition-all" />
            </Link>
          ) : (
            <div className="flex items-center justify-center w-full py-3 px-4 bg-white/5 rounded-lg">
              <span className="text-gray-500">Prochainement</span>
            </div>
          )}
        </div>

        {/* Gradient Border Effect on Hover */}
        {isPublished && (
          <div 
            className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
            style={{
              background: `linear-gradient(135deg, transparent, ${guide.color.primary}20)`,
            }}
          />
        )}
      </div>
    </div>
  );
};

export default GuidesHub;
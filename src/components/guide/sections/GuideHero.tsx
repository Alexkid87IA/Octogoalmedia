// src/components/guide/sections/GuideHero.tsx
import React from 'react';
import { Guide } from '../../../data/guidesData';
import { Calendar, User, Hash } from 'lucide-react';

interface GuideHeroProps {
  guide: Guide;
}

const GuideHero: React.FC<GuideHeroProps> = ({ guide }) => {
  return (
    <section className="relative min-h-[50vh] flex items-center overflow-hidden bg-gradient-to-br from-purple-900/30 via-black to-violet-900/20">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(139, 92, 246, 0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(139, 92, 246, 0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

      <div className="relative container mx-auto px-4 py-20">
        <div className="max-w-4xl">
          {/* Category Badge */}
          <div className="mb-6">
            <span className={`inline-block px-4 py-2 bg-gradient-to-r ${guide.color.gradient} text-white text-sm font-semibold rounded-full`}>
              {guide.category}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            {guide.title}
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-purple-300 mb-8">
            {guide.subtitle}
          </p>

          {/* Excerpt */}
          <p className="text-lg text-gray-300 mb-8 leading-relaxed max-w-3xl">
            {guide.excerpt}
          </p>

          {/* Meta Info */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <User size={16} />
              <span>{guide.author}</span>
            </div>
            {guide.publishedDate && (
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span>{new Date(guide.publishedDate).toLocaleDateString('fr-FR')}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Hash size={16} />
              <span>{guide.tags.slice(0, 3).join(', ')}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GuideHero;
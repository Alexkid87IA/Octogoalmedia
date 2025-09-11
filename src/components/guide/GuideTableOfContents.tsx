// src/components/guide/GuideTableOfContents.tsx
import React from 'react';
import { GuideSection } from '../../data/guides/digitalDetoxContent';
import { BookOpen, Brain, Target, Shield, Calendar, Zap, Trophy } from 'lucide-react';

interface GuideTableOfContentsProps {
  sections: GuideSection[];
  activeSection: string;
  scrollProgress: number;
}

const GuideTableOfContents: React.FC<GuideTableOfContentsProps> = ({ 
  sections, 
  activeSection, 
  scrollProgress 
}) => {
  const getIcon = (sectionId: string) => {
    switch(sectionId) {
      case 'intro': return <BookOpen size={16} />;
      case 'comprendre': return <Brain size={16} />;
      case 'strategie': return <Target size={16} />;
      case 'outils': return <Shield size={16} />;
      case 'plan-action': return <Calendar size={16} />;
      case 'avance': return <Zap size={16} />;
      case 'conclusion': return <Trophy size={16} />;
      default: return <BookOpen size={16} />;
    }
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-white mb-2">Table des matières</h3>
        <div className="w-full bg-white/10 rounded-full h-2">
          <div 
            className="h-2 bg-gradient-to-r from-purple-500 to-violet-500 rounded-full transition-all duration-300"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-2">
          {Math.round(scrollProgress)}% complété
        </p>
      </div>

      {/* Sections List */}
      <nav className="space-y-2">
        {sections.map((section, index) => {
          const isActive = activeSection === section.id;
          const isPassed = sections.findIndex(s => s.id === activeSection) > index;
          
          return (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className={`
                w-full text-left flex items-start gap-3 p-3 rounded-lg transition-all
                ${isActive 
                  ? 'bg-gradient-to-r from-purple-500/20 to-violet-500/20 border-l-2 border-purple-500' 
                  : isPassed
                    ? 'text-gray-500 hover:bg-white/5'
                    : 'text-gray-400 hover:bg-white/5'
                }
              `}
            >
              <div className={`mt-0.5 ${isActive ? 'text-purple-400' : isPassed ? 'text-gray-500' : 'text-gray-600'}`}>
                {getIcon(section.id)}
              </div>
              <div className="flex-1">
                <p className={`text-sm font-medium ${isActive ? 'text-white' : ''}`}>
                  {section.title}
                </p>
                {section.subtitle && (
                  <p className="text-xs text-gray-500 mt-0.5">
                    {section.subtitle}
                  </p>
                )}
              </div>
              {isPassed && !isActive && (
                <div className="mt-0.5">
                  <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                    <span className="text-green-400 text-xs">✓</span>
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Time Estimate */}
      <div className="mt-6 pt-6 border-t border-white/10">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Temps estimé</span>
          <span className="text-purple-400">~25 min</span>
        </div>
      </div>
    </div>
  );
};

export default GuideTableOfContents;
// src/components/guide/sections/GuideAvance.tsx
import React from 'react';
import { GuideSection } from '../../../data/guides/digitalDetoxContent';
import { Zap, Users, Repeat, MessageSquare } from 'lucide-react';

interface GuideAvanceProps {
  content: GuideSection;
}

const GuideAvance: React.FC<GuideAvanceProps> = ({ content }) => {
  return (
    <section id={content.id} className="scroll-mt-24">
      {/* Section Header */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500">
            <Zap size={24} className="text-white" />
          </div>
          <span className="text-indigo-400 font-semibold uppercase tracking-wider text-sm">
            Partie 5
          </span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
          {content.title}
        </h2>
        {content.subtitle && (
          <p className="text-xl text-gray-400">
            {content.subtitle}
          </p>
        )}
      </div>

      {/* Subsections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {content.content.subsections?.map((subsection, index) => {
          // Determine icon and color for each subsection
          const getSubsectionStyle = () => {
            if (subsection.title.includes('Anti-FOMO')) {
              return { icon: <MessageSquare />, gradient: 'from-yellow-500 to-orange-500' };
            }
            if (subsection.title.includes('Diète')) {
              return { icon: <Repeat />, gradient: 'from-red-500 to-pink-500' };
            }
            if (subsection.title.includes('Créateur')) {
              return { icon: <Zap />, gradient: 'from-purple-500 to-indigo-500' };
            }
            if (subsection.title.includes('Communauté')) {
              return { icon: <Users />, gradient: 'from-green-500 to-teal-500' };
            }
            return { icon: <Zap />, gradient: 'from-gray-500 to-gray-600' };
          };

          const style = getSubsectionStyle();

          return (
            <div key={index} className="relative">
              {/* Card */}
              <div className="h-full p-6 bg-gradient-to-br from-white/5 to-white/[0.02] rounded-2xl border border-white/10 hover:border-white/20 transition-all">
                {/* Icon and Title */}
                <div className="flex items-start gap-4 mb-4">
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${style.gradient}`}>
                    {React.cloneElement(style.icon, { size: 20, className: 'text-white' })}
                  </div>
                  <h3 className="text-xl font-bold text-white flex-1">
                    {subsection.title}
                  </h3>
                </div>

                {/* Content */}
                {subsection.content.map((paragraph, pIndex) => (
                  <p key={pIndex} className="text-gray-300 text-sm mb-4">
                    {paragraph}
                  </p>
                ))}

                {/* List */}
                {subsection.list && (
                  <ul className="space-y-2 mt-4">
                    {subsection.list.map((item, listIndex) => (
                      <li key={listIndex} className="flex items-start gap-2">
                        <span className={`text-transparent bg-gradient-to-r ${style.gradient} bg-clip-text mt-1`}>
                          •
                        </span>
                        <span className="text-gray-400 text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Advanced Tips Box */}
      <div className="mt-12 p-6 bg-gradient-to-br from-indigo-900/20 to-purple-900/20 rounded-lg border border-indigo-500/30">
        <div className="flex items-center gap-3 mb-4">
          <Zap className="text-indigo-400" size={24} />
          <p className="text-xl font-bold text-white">
            Niveau Expert Débloqué
          </p>
        </div>
        <p className="text-gray-300 mb-4">
          Ces stratégies avancées sont pour ceux qui veulent aller au-delà de la simple maîtrise. 
          Elles transforment votre relation avec la technologie en avantage compétitif.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-indigo-400">2:1</p>
            <p className="text-xs text-gray-500">Ratio Création/Consommation</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-indigo-400">1/7</p>
            <p className="text-xs text-gray-500">Jour sans écran/semaine</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-indigo-400">5</p>
            <p className="text-xs text-gray-500">Sources max par domaine</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-indigo-400">30min</p>
            <p className="text-xs text-gray-500">Temps max par session</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GuideAvance;
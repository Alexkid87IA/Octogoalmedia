// src/components/guide/sections/GuideStrategie.tsx
import React from 'react';
import { GuideSection } from '../../../data/guides/digitalDetoxContent';
import { Target, Zap, Hash } from 'lucide-react';

interface GuideStrategieProps {
  content: GuideSection;
}

const GuideStrategie: React.FC<GuideStrategieProps> = ({ content }) => {
  return (
    <section id={content.id} className="scroll-mt-24">
      {/* Section Header */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500">
            <Target size={24} className="text-white" />
          </div>
          <span className="text-cyan-400 font-semibold uppercase tracking-wider text-sm">
            Partie 2
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

      {/* Subsections */}
      <div className="space-y-12">
        {content.content.subsections?.map((subsection, index) => (
          <div key={index} className="relative">
            {/* Visual indicator for different subsections */}
            {subsection.title.includes('Intentionnalité') && (
              <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full" />
            )}
            
            {/* Subsection Title */}
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              {subsection.title.includes('Comptes Thématiques') && <Hash className="text-blue-400" />}
              {subsection.title.includes('ANTI-FOMO') && <span className="text-2xl">🚫</span>}
              {subsection.title.includes('Algorithme') && <Zap className="text-yellow-400" />}
              {subsection.title}
            </h3>

            {/* Content */}
            <div className="space-y-4">
              {subsection.content.map((paragraph, pIndex) => (
                <p key={pIndex} className="text-gray-300 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* List if exists */}
            {subsection.list && (
              <div className="mt-6">
                {subsection.title.includes('ANTI-FOMO') ? (
                  // Special styling for FOMO section
                  <div className="p-6 bg-gradient-to-br from-red-900/20 to-orange-900/20 border border-red-500/30 rounded-lg">
                    <p className="text-orange-400 font-bold mb-4 text-lg">
                      LA SOLUTION : Le Système 5-30
                    </p>
                    <ul className="space-y-3">
                      {subsection.list.map((item, listIndex) => (
                        <li key={listIndex} className="flex items-start gap-3">
                          <span className="text-orange-400 font-bold mt-1">!</span>
                          <span className="text-gray-300">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  // Regular list styling
                  <ul className="space-y-3 p-6 bg-white/5 rounded-lg">
                    {subsection.list.map((item, listIndex) => (
                      <li key={listIndex} className="flex items-start gap-3">
                        <span className="text-cyan-400 mt-1">▸</span>
                        <span className="text-gray-300">{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {/* Highlight if exists */}
            {subsection.highlight && (
              <div className="mt-6 p-4 bg-gradient-to-r from-blue-900/20 to-cyan-900/20 border-l-4 border-cyan-500 rounded-r-lg">
                <p className="text-white font-medium">
                  💡 {subsection.highlight}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Success Box */}
      <div className="mt-12 p-6 bg-gradient-to-br from-green-900/20 to-emerald-900/20 rounded-lg border border-green-500/30">
        <p className="text-xl font-bold text-white mb-2">
          ✅ Résultat garanti
        </p>
        <p className="text-gray-300">
          En appliquant ces stratégies, vous transformerez vos réseaux sociaux 
          de sources de distraction en outils de croissance personnelle. 
          Le scroll mindless deviendra de l'apprentissage ciblé.
        </p>
      </div>
    </section>
  );
};

export default GuideStrategie;
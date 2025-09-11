// src/components/guide/sections/GuideComprendre.tsx
import React from 'react';
import { GuideSection } from '../../../data/guides/digitalDetoxContent';
import { Brain, TrendingDown } from 'lucide-react';

interface GuideComprendreProps {
  content: GuideSection;
}

const GuideComprendre: React.FC<GuideComprendreProps> = ({ content }) => {
  return (
    <section id={content.id} className="scroll-mt-24">
      {/* Section Header */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-gradient-to-br from-red-500 to-orange-500">
            <Brain size={24} className="text-white" />
          </div>
          <span className="text-orange-400 font-semibold uppercase tracking-wider text-sm">
            Partie 1
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
            {/* Subsection Title */}
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              {subsection.title === 'Le Piège de la Dopamine Artificielle' && (
                <span className="text-3xl">🧠</span>
              )}
              {subsection.title === 'Le Coût Caché du Doomscrolling' && (
                <TrendingDown className="text-red-400" size={24} />
              )}
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
              <div className="mt-6 p-6 bg-red-900/10 border border-red-500/20 rounded-lg">
                <p className="text-red-400 font-semibold mb-4">
                  Les conséquences sont réelles et mesurables :
                </p>
                <ul className="space-y-3">
                  {subsection.list.map((item, listIndex) => (
                    <li key={listIndex} className="flex items-start gap-3">
                      <span className="text-red-400 mt-1">▸</span>
                      <span className="text-gray-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Highlight if exists */}
            {subsection.highlight && (
              <div className="mt-6 p-4 bg-gradient-to-r from-orange-900/20 to-red-900/20 border-l-4 border-orange-500 rounded-r-lg">
                <p className="text-white font-medium italic">
                  {subsection.highlight}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Warning Box */}
      <div className="mt-12 p-6 bg-gradient-to-br from-red-900/20 to-orange-900/20 rounded-lg border border-red-500/30">
        <p className="text-xl font-bold text-white mb-2">
          ⚠️ Réalité brutale
        </p>
        <p className="text-gray-300">
          Votre cerveau est littéralement en train d'être reprogrammé. 
          Chaque scroll, chaque notification, chaque like modifie physiquement 
          vos circuits neuronaux. La question n'est pas SI vous êtes affecté, 
          mais À QUEL POINT.
        </p>
      </div>
    </section>
  );
};

export default GuideComprendre;
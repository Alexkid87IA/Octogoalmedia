// src/components/guide/sections/GuideOutils.tsx
import React from 'react';
import { GuideSection } from '../../../data/guides/digitalDetoxContent';
import { Wrench, Save, Shield, Clock } from 'lucide-react';

interface GuideOutilsProps {
  content: GuideSection;
}

const GuideOutils: React.FC<GuideOutilsProps> = ({ content }) => {
  return (
    <section id={content.id} className="scroll-mt-24">
      {/* Section Header */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-violet-500">
            <Wrench size={24} className="text-white" />
          </div>
          <span className="text-violet-400 font-semibold uppercase tracking-wider text-sm">
            Partie 3
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
            {/* Icon for each subsection */}
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 mt-1">
                {subsection.title.includes('Capture') && (
                  <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg">
                    <Save className="text-white" size={20} />
                  </div>
                )}
                {subsection.title.includes('Barrières') && (
                  <div className="p-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg">
                    <Shield className="text-white" size={20} />
                  </div>
                )}
                {subsection.title.includes('Rituel') && (
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg">
                    <Clock className="text-white" size={20} />
                  </div>
                )}
              </div>

              <div className="flex-1">
                {/* Subsection Title */}
                <h3 className="text-2xl font-bold text-white mb-6">
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
                    <div className="p-6 bg-gradient-to-br from-purple-900/10 to-violet-900/10 border border-purple-500/20 rounded-lg">
                      <ul className="space-y-3">
                        {subsection.list.map((item, listIndex) => (
                          <li key={listIndex} className="flex items-start gap-3">
                            <span className="text-purple-400 mt-1">
                              {subsection.title.includes('Rituel') ? `${listIndex + 1}.` : '▸'}
                            </span>
                            <span className="text-gray-300">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Highlight if exists */}
                {subsection.highlight && (
                  <div className="mt-6 p-4 bg-gradient-to-r from-purple-900/20 to-violet-900/20 border-l-4 border-purple-500 rounded-r-lg">
                    <p className="text-purple-300 font-medium">
                      📱 {subsection.highlight}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tools Box */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-gradient-to-br from-green-900/20 to-emerald-900/20 rounded-lg border border-green-500/30">
          <p className="font-bold text-white mb-2">🧠 Pour la capture</p>
          <p className="text-sm text-gray-400">Notion, Obsidian, Pocket</p>
        </div>
        <div className="p-4 bg-gradient-to-br from-orange-900/20 to-red-900/20 rounded-lg border border-orange-500/30">
          <p className="font-bold text-white mb-2">🛡️ Pour le blocage</p>
          <p className="text-sm text-gray-400">Forest, Freedom, Cold Turkey</p>
        </div>
      </div>
    </section>
  );
};

export default GuideOutils;
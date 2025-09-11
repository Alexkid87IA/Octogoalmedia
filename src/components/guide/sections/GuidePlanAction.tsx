// src/components/guide/sections/GuidePlanAction.tsx
import React, { useState } from 'react';
import { GuideSection } from '../../../data/guides/digitalDetoxContent';
import { Calendar, CheckCircle, Circle } from 'lucide-react';

interface GuidePlanActionProps {
  content: GuideSection;
}

const GuidePlanAction: React.FC<GuidePlanActionProps> = ({ content }) => {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  const toggleCheck = (itemId: string) => {
    const newChecked = new Set(checkedItems);
    if (newChecked.has(itemId)) {
      newChecked.delete(itemId);
    } else {
      newChecked.add(itemId);
    }
    setCheckedItems(newChecked);
  };

  const weeks = [
    { number: 1, color: 'from-red-500 to-orange-500', bgColor: 'from-red-900/20 to-orange-900/20' },
    { number: 2, color: 'from-yellow-500 to-amber-500', bgColor: 'from-yellow-900/20 to-amber-900/20' },
    { number: 3, color: 'from-green-500 to-emerald-500', bgColor: 'from-green-900/20 to-emerald-900/20' },
    { number: 4, color: 'from-blue-500 to-cyan-500', bgColor: 'from-blue-900/20 to-cyan-900/20' }
  ];

  return (
    <section id={content.id} className="scroll-mt-24">
      {/* Section Header */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500">
            <Calendar size={24} className="text-white" />
          </div>
          <span className="text-emerald-400 font-semibold uppercase tracking-wider text-sm">
            Partie 4
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

      {/* Progress Indicator */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-4">
          {weeks.map((week) => (
            <div key={week.number} className="flex-1 text-center">
              <div className={`h-2 bg-gradient-to-r ${week.color} rounded-full mx-1`} />
              <p className="text-xs text-gray-400 mt-2">Semaine {week.number}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Plans */}
      <div className="space-y-8">
        {content.content.subsections?.map((subsection, index) => {
          const week = weeks[index];
          const weekId = `week-${index}`;
          
          return (
            <div key={index} className="relative">
              {/* Week Card */}
              <div className={`p-6 bg-gradient-to-br ${week.bgColor} rounded-2xl border border-white/10`}>
                {/* Week Header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {subsection.title}
                    </h3>
                    <p className="text-gray-400">
                      {subsection.content[0]}
                    </p>
                  </div>
                  <div className={`p-4 bg-gradient-to-br ${week.color} rounded-xl`}>
                    <span className="text-2xl font-bold text-white">
                      {week.number}
                    </span>
                  </div>
                </div>

                {/* Checklist */}
                {subsection.list && (
                  <div className="space-y-3">
                    {subsection.list.map((item, listIndex) => {
                      const itemId = `${weekId}-${listIndex}`;
                      const isChecked = checkedItems.has(itemId);
                      
                      return (
                        <div 
                          key={listIndex}
                          onClick={() => toggleCheck(itemId)}
                          className="flex items-start gap-3 p-3 bg-black/20 rounded-lg cursor-pointer hover:bg-black/30 transition-all"
                        >
                          {isChecked ? (
                            <CheckCircle className="text-green-400 mt-0.5 flex-shrink-0" size={20} />
                          ) : (
                            <Circle className="text-gray-500 mt-0.5 flex-shrink-0" size={20} />
                          )}
                          <span className={`${isChecked ? 'text-gray-400 line-through' : 'text-gray-300'}`}>
                            {item}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Motivation Box */}
      <div className="mt-12 p-6 bg-gradient-to-br from-purple-900/20 to-violet-900/20 rounded-lg border border-purple-500/30">
        <p className="text-xl font-bold text-white mb-2">
          🎯 Votre progression
        </p>
        <p className="text-gray-300 mb-4">
          Utilisez cette checklist interactive pour suivre votre progression. 
          Chaque case cochée est une victoire contre l'addiction digitale.
        </p>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-400">
            Actions complétées : 
            <span className="text-purple-400 font-bold ml-2">
              {checkedItems.size} / {content.content.subsections?.reduce((acc, sub) => acc + (sub.list?.length || 0), 0)}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GuidePlanAction;
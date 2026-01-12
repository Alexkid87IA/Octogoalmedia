// src/components/article/blocks/Accordion.tsx
// Accordéon avec plusieurs items dépliables
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { AccordionBlock, AccordionItem } from '../../../types/sanity';

interface AccordionProps {
  value: AccordionBlock;
}

// Parser le contenu en liste si format "- item1 - item2 - item3"
const parseContentToList = (content: string): string[] => {
  if (!content) return [];

  // Vérifier si le contenu contient des tirets de liste
  if (content.includes(' - ') || content.startsWith('- ')) {
    // Split par "- " et filtrer les éléments vides
    const items = content
      .split(/\s*-\s+/)
      .map(item => item.trim())
      .filter(item => item.length > 0);
    return items;
  }

  // Si pas de format liste, retourner comme paragraphe unique
  return [content];
};

const AccordionItemComponent: React.FC<{
  item: AccordionItem;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}> = ({ item, isOpen, onToggle, index }) => {
  const contentItems = parseContentToList(item.content);
  const isList = contentItems.length > 1;

  return (
    <div className="border-b border-white/10 last:border-b-0">
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-white/5 transition-colors"
        aria-expanded={isOpen}
      >
        <span className="font-medium text-white">{item.title}</span>
        <ChevronDown
          size={20}
          className={`text-gray-400 transition-transform duration-300 flex-shrink-0 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Content */}
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-5 pb-4 text-gray-300 leading-relaxed">
          {isList ? (
            <ul className="space-y-2">
              {contentItems.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-pink-400 mt-1.5">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p>{contentItems[0]}</p>
          )}
        </div>
      </div>
    </div>
  );
};

const Accordion: React.FC<AccordionProps> = ({ value }) => {
  const { title, items, allowMultiple = false } = value;
  const [openIndexes, setOpenIndexes] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    if (allowMultiple) {
      // Mode multi-ouverture
      setOpenIndexes((prev) =>
        prev.includes(index)
          ? prev.filter((i) => i !== index)
          : [...prev, index]
      );
    } else {
      // Mode un seul ouvert à la fois
      setOpenIndexes((prev) =>
        prev.includes(index) ? [] : [index]
      );
    }
  };

  return (
    <div className="my-8 rounded-xl border border-white/10 bg-gray-900/50 overflow-hidden">
      {/* Title */}
      {title && (
        <div className="px-5 py-4 border-b border-white/10 bg-black/30">
          <h3 className="font-bold text-white">{title}</h3>
        </div>
      )}

      {/* Items */}
      <div>
        {items?.map((item, index) => (
          <AccordionItemComponent
            key={item._key || index}
            item={item}
            isOpen={openIndexes.includes(index)}
            onToggle={() => toggleItem(index)}
            index={index}
          />
        ))}
      </div>
    </div>
  );
};

export default Accordion;

// src/components/article/blocks/Spoiler.tsx
// Bloc spoiler avec contenu masqué cliquable
import React, { useState } from 'react';
import { Eye, EyeOff, AlertTriangle } from 'lucide-react';
import { SpoilerBlock } from '../../../types/sanity';

interface SpoilerProps {
  value: SpoilerBlock;
}

// Parser markdown inline (** pour gras, * pour italique)
const parseInlineMarkdown = (text: string): React.ReactNode[] => {
  if (!text) return [];

  const parts: React.ReactNode[] = [];
  let remaining = text;
  let key = 0;

  // Regex pour matcher **bold** et *italic*
  const regex = /(\*\*(.+?)\*\*|\*(.+?)\*)/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    // Ajouter le texte avant le match
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    // Vérifier si c'est bold (**) ou italic (*)
    if (match[2]) {
      // Bold: **text**
      parts.push(
        <strong key={key++} className="font-bold text-white">
          {match[2]}
        </strong>
      );
    } else if (match[3]) {
      // Italic: *text*
      parts.push(
        <em key={key++} className="italic text-gray-200">
          {match[3]}
        </em>
      );
    }

    lastIndex = regex.lastIndex;
  }

  // Ajouter le reste du texte
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : [text];
};

const Spoiler: React.FC<SpoilerProps> = ({ value }) => {
  const { title, content, warningText } = value;
  const [isRevealed, setIsRevealed] = useState(false);

  return (
    <div className="my-8 rounded-xl border border-amber-500/30 bg-amber-500/5 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-amber-500/20">
        <AlertTriangle size={20} className="text-amber-400 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-amber-300">
            {title || 'Spoiler'}
          </h4>
          {warningText && (
            <p className="text-sm text-amber-400/70 mt-0.5">
              {warningText}
            </p>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="relative">
        {/* Contenu flouté ou visible */}
        <div
          className={`p-5 transition-all duration-300 ${
            isRevealed ? '' : 'blur-md select-none'
          }`}
        >
          <p className="text-gray-300 leading-relaxed">
            {parseInlineMarkdown(content)}
          </p>
        </div>

        {/* Overlay pour révéler */}
        {!isRevealed && (
          <div
            className="absolute inset-0 flex items-center justify-center cursor-pointer bg-black/20 hover:bg-black/10 transition-colors"
            onClick={() => setIsRevealed(true)}
          >
            <button
              className="flex items-center gap-2 px-4 py-2 bg-amber-500/20 rounded-lg text-amber-300 hover:bg-amber-500/30 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setIsRevealed(true);
              }}
            >
              <Eye size={18} />
              <span className="font-medium">Révéler le contenu</span>
            </button>
          </div>
        )}

        {/* Bouton pour masquer à nouveau */}
        {isRevealed && (
          <div className="px-5 pb-4">
            <button
              onClick={() => setIsRevealed(false)}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-400 transition-colors"
            >
              <EyeOff size={14} />
              <span>Masquer le spoiler</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Spoiler;

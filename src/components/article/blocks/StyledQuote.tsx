// src/components/article/blocks/StyledQuote.tsx
// Citation stylée avec auteur, photo, source
import React from 'react';
import { Quote } from 'lucide-react';
import { StyledQuoteBlock } from '../../../types/sanity';
import { urlFor } from '../../../utils/sanityClient';

interface StyledQuoteProps {
  value: StyledQuoteBlock;
}

const StyledQuote: React.FC<StyledQuoteProps> = ({ value }) => {
  const { quote, author, role, image, source, date, style = 'classic' } = value;

  // Récupérer l'URL de l'image
  const getImageUrl = () => {
    if (!image?.asset) return null;
    try {
      if (image.asset.url) return image.asset.url;
      if (image.asset._ref) return urlFor(image).width(120).height(120).url();
      return null;
    } catch {
      return null;
    }
  };

  const imageUrl = getImageUrl();

  // Style classique
  if (style === 'classic') {
    return (
      <blockquote className="my-10 relative pl-6 border-l-4 border-pink-500">
        <p className="text-xl md:text-2xl text-white italic leading-relaxed mb-4">
          "{quote}"
        </p>
        {(author || source) && (
          <footer className="flex items-center gap-3 mt-4">
            {imageUrl && (
              <img
                src={imageUrl}
                alt={author || ''}
                className="w-12 h-12 rounded-full object-cover"
              />
            )}
            <div>
              {author && (
                <cite className="text-gray-300 font-medium not-italic block">
                  {author}
                </cite>
              )}
              {role && (
                <span className="text-gray-500 text-sm">{role}</span>
              )}
              {source && (
                <span className="text-gray-500 text-sm block">
                  {source}{date && ` - ${date}`}
                </span>
              )}
            </div>
          </footer>
        )}
      </blockquote>
    );
  }

  // Style avec fond
  if (style === 'with-background') {
    return (
      <blockquote className="my-10 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-8 border border-white/10 relative overflow-hidden">
        {/* Guillemet décoratif */}
        <Quote
          size={80}
          className="absolute top-4 right-4 text-pink-500/10"
        />

        <p className="text-xl md:text-2xl text-white italic leading-relaxed mb-6 relative z-10">
          "{quote}"
        </p>

        {(author || source) && (
          <footer className="flex items-center gap-4 relative z-10">
            {imageUrl && (
              <img
                src={imageUrl}
                alt={author || ''}
                className="w-14 h-14 rounded-full object-cover ring-2 ring-pink-500/30"
              />
            )}
            <div>
              {author && (
                <cite className="text-white font-semibold not-italic block">
                  {author}
                </cite>
              )}
              {role && (
                <span className="text-pink-400 text-sm">{role}</span>
              )}
              {source && (
                <span className="text-gray-500 text-sm block">
                  {source}{date && ` - ${date}`}
                </span>
              )}
            </div>
          </footer>
        )}
      </blockquote>
    );
  }

  // Style grande citation
  if (style === 'large') {
    return (
      <blockquote className="my-16 text-center px-4">
        <Quote size={48} className="text-pink-500/30 mx-auto mb-4" />
        <p className="text-2xl md:text-4xl text-white font-light italic leading-snug mb-6 max-w-3xl mx-auto">
          "{quote}"
        </p>
        {(author || source) && (
          <footer className="flex flex-col items-center gap-2">
            {imageUrl && (
              <img
                src={imageUrl}
                alt={author || ''}
                className="w-16 h-16 rounded-full object-cover"
              />
            )}
            {author && (
              <cite className="text-gray-300 font-medium not-italic">
                {author}
              </cite>
            )}
            {role && (
              <span className="text-pink-400 text-sm">{role}</span>
            )}
            {source && (
              <span className="text-gray-500 text-sm">
                {source}{date && ` - ${date}`}
              </span>
            )}
          </footer>
        )}
      </blockquote>
    );
  }

  // Style encadré
  if (style === 'bordered') {
    return (
      <blockquote className="my-10 border border-white/20 rounded-xl p-6 bg-black/30">
        <div className="flex gap-4">
          <div className="flex-shrink-0">
            <div className="w-1 h-full bg-gradient-to-b from-pink-500 to-rose-600 rounded-full" />
          </div>
          <div>
            <p className="text-lg text-gray-200 italic leading-relaxed mb-4">
              "{quote}"
            </p>
            {(author || source) && (
              <footer className="flex items-center gap-3">
                {imageUrl && (
                  <img
                    src={imageUrl}
                    alt={author || ''}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                )}
                <div className="text-sm">
                  {author && (
                    <cite className="text-gray-300 font-medium not-italic block">
                      {author}
                    </cite>
                  )}
                  {(role || source) && (
                    <span className="text-gray-500">
                      {role}{role && source && ' - '}{source}
                    </span>
                  )}
                </div>
              </footer>
            )}
          </div>
        </div>
      </blockquote>
    );
  }

  // Fallback au style classique
  return (
    <blockquote className="my-10 relative pl-6 border-l-4 border-pink-500">
      <p className="text-xl text-white italic leading-relaxed">"{quote}"</p>
      {author && (
        <cite className="text-gray-400 mt-2 block not-italic">— {author}</cite>
      )}
    </blockquote>
  );
};

export default StyledQuote;

// src/components/article/sections/ArticleContent.tsx
import React, { useState } from "react";
import { PortableText } from "@portabletext/react";
import { ChevronDown, Copy, Check } from "lucide-react";
import { SanityArticle, VerticalColors } from "../../../types/article.types";
import { urlFor } from "../../../utils/sanityClient";
import InstagramEmbed from "../embeds/InstagramEmbed";
import YouTubeEmbed from "../embeds/YouTubeEmbed";
import TwitterEmbed from "../embeds/TwitterEmbed";

interface ArticleContentProps {
  article: SanityArticle;
  colors: VerticalColors;
  isEmission?: boolean;
}

const ArticleContent: React.FC<ArticleContentProps> = ({ article, colors, isEmission = false }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Composants PortableText
  const portableTextComponents = {
    block: {
      h1: ({children}: any) => (
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 mt-12">{children}</h1>
      ),
      h2: ({children, value}: any) => {
        // Générer un ID stable basé sur le texte du heading
        const text = value?.children?.[0]?.text || '';
        const id = `h2-${text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`;
        return (
          <h2 id={id} className="text-3xl font-bold mb-6 text-white relative inline-block mt-10 scroll-mt-24">
            {children}
            <span 
              className="absolute -bottom-2 left-0 w-20 h-1 rounded-full"
              style={{ background: colors.bgGradient }}
            ></span>
          </h2>
        );
      },
      h3: ({children, value}: any) => {
        // Générer un ID stable basé sur le texte du heading
        const text = value?.children?.[0]?.text || '';
        const id = `h3-${text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`;
        return (
          <h3 id={id} className="text-2xl font-bold text-white mb-4 mt-8 scroll-mt-24">{children}</h3>
        );
      },
      normal: ({children}: any) => (
        <p className="text-lg leading-relaxed text-gray-300 mb-6">{children}</p>
      ),
      blockquote: ({children}: any) => (
        <blockquote 
          className="relative my-8 p-6 border-l-4 rounded-r-xl"
          style={{ 
            background: colors.bgLight,
            borderLeftColor: colors.primary 
          }}
        >
          <p className="text-xl text-white italic">{children}</p>
        </blockquote>
      ),
    },
    list: {
      bullet: ({children}: any) => (
        <ul className="space-y-3 my-6 ml-6">{children}</ul>
      ),
      number: ({children}: any) => (
        <ol className="space-y-3 my-6 ml-6 list-decimal">{children}</ol>
      ),
    },
    listItem: {
      bullet: ({children}: any) => (
        <li className="flex items-start gap-3 text-gray-300">
          <span className="mt-1" style={{ color: colors.textColor }}>▸</span>
          <span>{children}</span>
        </li>
      ),
      number: ({children}: any) => (
        <li className="text-gray-300">{children}</li>
      ),
    },
    marks: {
      strong: ({children}: any) => <strong className="font-bold text-white">{children}</strong>,
      em: ({children}: any) => <em className="italic">{children}</em>,
      code: ({children}: any) => (
        <code 
          className="px-2 py-1 rounded text-sm"
          style={{ 
            background: colors.bgLight,
            color: colors.textColor 
          }}
        >{children}</code>
      ),
      link: ({value, children}: any) => (
        <a 
          href={value?.href} 
          className="underline transition-colors" 
          style={{ color: colors.textColor }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = colors.primary;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = colors.textColor;
          }}
          target="_blank" 
          rel="noopener noreferrer"
        >
          {children}
        </a>
      ),
    },
    types: {
      image: ({value}: any) => (
        <figure className="my-12">
          <img 
            src={urlFor(value).width(1200).url()}
            alt={value.alt || "Image de l'article"}
            className="w-full rounded-xl max-w-full"
          />
          {value.caption && (
            <figcaption className="text-center text-sm text-gray-400 mt-4">
              {value.caption}
            </figcaption>
          )}
        </figure>
      ),
      code: ({value}: any) => (
        <div className="relative bg-gray-900/50 rounded-xl border border-gray-800 overflow-hidden my-8">
          <div className="flex items-center justify-between px-4 py-3 bg-gray-900/80 border-b border-gray-800">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-xs text-gray-400 ml-2">{value.language || 'code'}</span>
            </div>
            <button 
              onClick={() => handleCopyCode(value.code)}
              className="text-xs bg-blue-500/20 text-blue-400 px-3 py-1 rounded hover:bg-blue-500/30 transition-colors flex items-center gap-1"
            >
              {copied ? <Check size={12} /> : <Copy size={12} />}
              {copied ? 'Copié!' : 'Copier'}
            </button>
          </div>
          <pre className="p-4 text-sm overflow-x-auto">
            <code className="text-gray-300">{value.code}</code>
          </pre>
        </div>
      ),
      // Utilisation des composants embed importés
      instagram: ({value}: any) => (
        <InstagramEmbed url={value?.url} caption={value?.caption} />
      ),
      youtube: ({value}: any) => (
        <YouTubeEmbed value={value} />
      ),
      twitter: ({value}: any) => (
        <TwitterEmbed url={value?.url} caption={value?.caption} />
      ),
    },
  };

  return (
    <>
      {/* EXCERPT - Intégré comme introduction */}
      {article.excerpt && (
        <div className="mb-10 relative max-w-full overflow-hidden">
          {/* Ligne décorative gauche */}
          <div 
            className="absolute left-0 top-0 bottom-0 w-1 rounded-full"
            style={{ 
              background: colors.bgGradient,
              opacity: 0.6
            }}
          />
          
          {/* Contenu de l'extrait */}
          <div className="pl-6 pr-2">
            <p className="text-lg md:text-xl lg:text-2xl leading-relaxed text-gray-200 font-light italic break-words">
              {article.excerpt}
            </p>
          </div>
          
          {/* Séparateur décoratif amélioré */}
          <div className="mt-10 mb-4">
            <div className="flex items-center gap-4">
              <div 
                className="h-[1px] flex-1"
                style={{ 
                  background: `linear-gradient(to right, transparent, ${colors.primary}40, transparent)`
                }}
              />
              <div 
                className="relative"
                style={{ color: colors.primary }}
              >
                <ChevronDown 
                  size={24} 
                  className="animate-bounce"
                  style={{ opacity: 0.6 }}
                />
              </div>
              <div 
                className="h-[1px] flex-1"
                style={{ 
                  background: `linear-gradient(to left, transparent, ${colors.primary}40, transparent)`
                }}
              />
            </div>
            
            <p className="text-center text-xs text-gray-500 mt-3 uppercase tracking-wider">
              Continuer la lecture
            </p>
          </div>
        </div>
      )}

      {/* Player YouTube si c'est une émission avec videoUrl */}
      {isEmission && article.videoUrl && (
        <div className="mb-12">
          <div className="relative aspect-video rounded-xl overflow-hidden bg-black">
            <iframe
              src={`https://www.youtube.com/embed/${article.videoUrl.split('v=')[1]?.split('&')[0] || article.videoUrl.split('/').pop()}`}
              title={article.title}
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <div className="mt-4 p-4 bg-white/5 rounded-lg border border-white/10">
            <p className="text-sm text-gray-400">
              📺 Émission complète
            </p>
          </div>
        </div>
      )}
      
      <div className="prose prose-invert prose-lg max-w-none overflow-hidden">
        {(article.body || article.content) && (
          <PortableText 
            value={article.body || article.content}
            components={portableTextComponents}
          />
        )}

        {!article.body && !article.content && (
          <div className="text-center py-12">
            <p className="text-gray-400 px-2">Le contenu de cet article est en cours de rédaction.</p>
          </div>
        )}
      </div>

      {/* Points clés */}
      {article.keyPoints && Array.isArray(article.keyPoints) && article.keyPoints.length > 0 && (
        <div className="mt-12 p-6 rounded-xl" style={{
          background: colors.bgLight,
          border: `1px solid ${colors.borderColor}`
        }}>
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <span className="text-2xl">💡</span>
            Points clés à retenir
          </h3>
          <ul className="space-y-2 text-gray-300">
            {article.keyPoints.map((point: string, index: number) => (
              <li key={index} className="flex items-start gap-2">
                <span style={{ color: colors.primary }}>▸</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Tags */}
      {article.tags && article.tags.length > 0 && (
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-wrap gap-2">
            {article.tags.map((tag, index) => (
              <span 
                key={index}
                className="px-3 py-1 bg-white/5 rounded-full text-sm text-gray-400 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
              >
                #{tag.title}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* CTA de fin d'article - Version Bientôt disponible */}
      <div className={`mt-16 p-6 md:p-8 bg-gradient-to-br ${colors.gradient}/10 rounded-2xl border`} style={{ borderColor: colors.borderColor }}>
        <h3 className="text-xl md:text-2xl font-bold text-white mb-4 whitespace-nowrap">
          Vous avez aimé cet article&nbsp;?
        </h3>
        <p className="text-gray-300 mb-6">
          Notre newsletter arrive bientôt ! En attendant, partagez cet article avec votre réseau.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 py-3 px-6 bg-white/10 text-white/50 rounded-lg font-medium text-center cursor-not-allowed flex items-center justify-center gap-2">
            <span>📬</span>
            <span>Newsletter bientôt disponible</span>
          </div>
          <button 
            onClick={() => {
              const shareUrl = window.location.href;
              navigator.clipboard.writeText(shareUrl);
            }}
            className="flex-1 py-3 px-6 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            Partager l'article
          </button>
        </div>
      </div>
    </>
  );
};

export default ArticleContent;
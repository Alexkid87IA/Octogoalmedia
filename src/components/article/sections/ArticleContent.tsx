// src/components/article/sections/ArticleContent.tsx
// Design éditorial épuré - Style Le Monde / GQ / L'Équipe
import React, { useState, useMemo, useCallback, useRef, memo } from "react";
import { PortableText } from "@portabletext/react";
import { Copy, Check, Lightbulb, Share2, Heart, ExternalLink } from "lucide-react";
import { SanityArticle, VerticalColors } from "../../../types/article.types";
import { urlFor } from "../../../utils/sanityClient";
import InstagramEmbed from "../embeds/InstagramEmbed";
import YouTubeEmbed from "../embeds/YouTubeEmbed";
import TwitterEmbed from "../embeds/TwitterEmbed";

// Blocs éditeur v2.2
import {
  Callout,
  StyledQuote,
  StatsCard,
  PlayerComparison,
  ImageGallery,
  CtaButton,
  Spoiler,
  Accordion,
  DataTable,
  TeamLineupBlock,
  FootballQuizBlock,
  MercatoRumorBlock,
  QuickPollBlock,
  TopListBlock,
} from "../blocks";

interface ArticleContentProps {
  article: SanityArticle;
  colors: VerticalColors;
  isEmission?: boolean;
}

// Encart Publicitaire - Design discret
const AdPlacement: React.FC<{ type: 'inline' | 'sidebar'; className?: string }> = ({ type, className = '' }) => (
  <div className={`relative ${className}`}>
    <div className={`${type === 'inline' ? 'my-12 py-6 px-6' : 'p-4'} bg-gray-900/50 border border-gray-800 rounded-lg flex flex-col items-center justify-center text-center min-h-[120px]`}>
      <p className="text-[11px] uppercase tracking-widest text-gray-600 font-medium">
        Publicité
      </p>
    </div>
  </div>
);

const ArticleContent: React.FC<ArticleContentProps> = memo(({ article, colors, isEmission = false }) => {
  const [copied, setCopied] = useState(false);
  const paragraphCountRef = useRef(0);

  const handleCopyCode = useCallback((code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  // Reset du compteur de paragraphes à chaque render du contenu
  paragraphCountRef.current = 0;

  // Design éditorial épuré - mémorisé pour éviter les re-renders
  const portableTextComponents = useMemo(() => ({
    block: {
      // H1 - Titre principal (rare dans le body)
      h1: ({ children }: any) => (
        <h1 className="text-2xl font-montserrat font-bold text-white mb-6 mt-12 leading-tight">
          {children}
        </h1>
      ),

      // H2 - Sections principales : grand, avec accent rose
      h2: ({ children, value }: any) => {
        const text = value?.children?.[0]?.text || '';
        const id = `h2-${text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`;
        return (
          <h2
            id={id}
            className="text-xl md:text-2xl font-montserrat font-bold text-white mt-14 mb-5 scroll-mt-24 flex items-center gap-3"
          >
            <span
              className="w-1 self-stretch rounded-full flex-shrink-0"
              style={{ background: colors.bgGradient }}
            />
            {children}
          </h2>
        );
      },

      // H3 - Sous-sections : petit, juste bold
      h3: ({ children, value }: any) => {
        const text = value?.children?.[0]?.text || '';
        const id = `h3-${text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`;
        return (
          <h3
            id={id}
            className="text-base font-montserrat font-bold text-gray-100 mt-8 mb-2 scroll-mt-24"
          >
            {children}
          </h3>
        );
      },

      // H4 - Très petit, gris, uppercase
      h4: ({ children }: any) => (
        <h4 className="text-sm font-montserrat font-semibold text-gray-500 mt-6 mb-2 uppercase tracking-wider">
          {children}
        </h4>
      ),

      // Paragraphe
      normal: ({ children }: any) => {
        paragraphCountRef.current++;
        const showAd = paragraphCountRef.current === 5 || paragraphCountRef.current === 12;

        return (
          <>
            <p className="text-lg leading-[1.8] text-gray-300 mb-6">
              {children}
            </p>
            {showAd && <AdPlacement type="inline" />}
          </>
        );
      },

      // Citation - Style éditorial élégant
      blockquote: ({ children }: any) => (
        <blockquote className="my-12 md:my-16 relative">
          {/* Ligne verticale subtile */}
          <div
            className="absolute left-0 top-0 bottom-0 w-[3px]"
            style={{ background: colors.primary }}
          />

          {/* Contenu */}
          <div className="pl-8 md:pl-12">
            <p className="text-2xl md:text-3xl lg:text-4xl font-montserrat italic text-white leading-snug">
              {children}
            </p>
          </div>
        </blockquote>
      ),
    },

    // Listes
    list: {
      bullet: ({ children }: any) => (
        <div className="my-8 space-y-3">{children}</div>
      ),
      number: ({ children }: any) => (
        <div className="my-8 space-y-3">{children}</div>
      ),
    },

    listItem: {
      bullet: ({ children }: any) => (
        <div className="flex items-start gap-4 text-gray-300">
          <span className="mt-[10px] w-[6px] h-[6px] rounded-full bg-gray-500 flex-shrink-0" />
          <span className="text-lg leading-[1.8]">{children}</span>
        </div>
      ),
      number: ({ children, index }: any) => (
        <div className="flex items-start gap-4 text-gray-300">
          <span className="text-lg font-medium text-gray-500 w-6 flex-shrink-0">
            {(index || 0) + 1}.
          </span>
          <span className="text-lg leading-[1.8]">{children}</span>
        </div>
      ),
    },

    // Styles inline
    marks: {
      strong: ({ children }: any) => (
        <strong className="font-semibold text-white">{children}</strong>
      ),
      em: ({ children }: any) => (
        <em className="italic">{children}</em>
      ),
      code: ({ children }: any) => (
        <code className="px-2 py-0.5 bg-gray-800 rounded text-sm font-mono text-gray-300">
          {children}
        </code>
      ),
      link: ({ value, children }: any) => (
        <a
          href={value?.href}
          className="text-white underline underline-offset-4 decoration-gray-500 hover:decoration-white transition-colors"
          target="_blank"
          rel="noopener noreferrer"
        >
          {children}
        </a>
      ),
    },

    // Types spéciaux
    types: {
      image: ({ value }: any) => (
        <figure className="my-12">
          <div className="relative overflow-hidden rounded-lg">
            <img
              src={urlFor(value).width(1400).url()}
              alt={value.alt || "Image de l'article"}
              className="w-full"
              loading="lazy"
            />
          </div>
          {value.caption && (
            <figcaption className="text-sm text-gray-500 mt-4 italic">
              {value.caption}
            </figcaption>
          )}
        </figure>
      ),

      code: ({ value }: any) => (
        <div className="relative rounded-lg border border-gray-800 overflow-hidden my-10">
          <div className="flex items-center justify-between px-4 py-3 bg-gray-900 border-b border-gray-800">
            <span className="text-xs text-gray-500 font-mono">
              {value.language || 'code'}
            </span>
            <button
              onClick={() => handleCopyCode(value.code)}
              className="text-xs text-gray-500 hover:text-white transition-colors"
            >
              {copied ? 'Copié' : 'Copier'}
            </button>
          </div>
          <pre className="p-6 text-sm overflow-x-auto bg-gray-950">
            <code className="text-gray-300 font-mono">{value.code}</code>
          </pre>
        </div>
      ),

      instagram: ({ value }: any) => (
        <InstagramEmbed url={value?.url} caption={value?.caption} />
      ),
      youtube: ({ value }: any) => (
        <YouTubeEmbed value={value} />
      ),
      twitter: ({ value }: any) => (
        <TwitterEmbed url={value?.url} caption={value?.caption} />
      ),

      // Blocs éditeur v2.2
      callout: ({ value }: any) => <Callout value={value} />,
      styledQuote: ({ value }: any) => <StyledQuote value={value} />,
      statsCard: ({ value }: any) => <StatsCard value={value} />,
      playerComparison: ({ value }: any) => <PlayerComparison value={value} />,
      imageGallery: ({ value }: any) => <ImageGallery value={value} />,
      ctaButton: ({ value }: any) => <CtaButton value={value} />,
      spoiler: ({ value }: any) => <Spoiler value={value} />,
      accordion: ({ value }: any) => <Accordion value={value} />,
      dataTable: ({ value }: any) => <DataTable value={value} />,
      teamLineup: ({ value }: any) => <TeamLineupBlock value={value} />,
      footballQuiz: ({ value }: any) => <FootballQuizBlock value={value} />,
      mercatoRumor: ({ value }: any) => <MercatoRumorBlock value={value} />,
      quickPoll: ({ value }: any) => <QuickPollBlock value={value} />,
      topList: ({ value }: any) => <TopListBlock value={value} />,
    },
  }), [colors.primary, colors.bgGradient, handleCopyCode, copied]);

  return (
    <article className="article-content">
      {/* Player YouTube si émission */}
      {isEmission && article.videoUrl && (
        <div className="mb-12">
          <div className="relative aspect-video rounded-lg overflow-hidden bg-black">
            <iframe
              src={`https://www.youtube.com/embed/${article.videoUrl.split('v=')[1]?.split('&')[0] || article.videoUrl.split('/').pop()}`}
              title={article.title}
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}

      {/* Contenu principal */}
      <div className="max-w-none">
        {(article.body || article.content) && (
          <PortableText
            value={article.body || article.content}
            components={portableTextComponents}
          />
        )}

        {!article.body && !article.content && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">Contenu en cours de rédaction.</p>
          </div>
        )}
      </div>

      {/* Encart pub fin d'article */}
      <AdPlacement type="inline" className="mt-16" />

      {/* Points clés */}
      {article.keyPoints && Array.isArray(article.keyPoints) && article.keyPoints.length > 0 && (
        <div className="mt-16 pt-8 border-t border-gray-800">
          <h3 className="text-xl font-montserrat font-bold text-white mb-6">
            À retenir
          </h3>
          <ul className="space-y-4">
            {article.keyPoints.map((point: string, index: number) => (
              <li key={index} className="flex items-start gap-3 text-gray-300">
                <span className="text-gray-500 font-medium">{index + 1}.</span>
                <span className="text-lg leading-relaxed">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Tags */}
      {article.tags && article.tags.length > 0 && (
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-wrap gap-2">
            {article.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1.5 text-sm text-gray-400 bg-gray-900 rounded hover:bg-gray-800 transition-colors cursor-pointer"
              >
                {tag.title}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Partage - Design minimal */}
      <div className="mt-16 pt-8 border-t border-gray-800">
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500 uppercase tracking-wider">Partager</span>
          <div className="flex gap-2">
            <button
              onClick={() => {
                const shareUrl = window.location.href;
                if (navigator.share) {
                  navigator.share({ title: article.title, url: shareUrl });
                } else {
                  navigator.clipboard.writeText(shareUrl);
                }
              }}
              className="p-3 bg-gray-900 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <Share2 size={18} className="text-gray-400" />
            </button>
            <button className="p-3 bg-gray-900 hover:bg-gray-800 rounded-lg transition-colors">
              <Heart size={18} className="text-gray-400" />
            </button>
          </div>
        </div>
      </div>

      {/* CSS Reset pour listes */}
      <style>{`
        .article-content ul,
        .article-content ol,
        .article-content li {
          list-style: none !important;
          list-style-type: none !important;
          padding-left: 0 !important;
          margin-left: 0 !important;
        }
        .article-content li::before,
        .article-content li::marker {
          content: none !important;
          display: none !important;
        }
      `}</style>
    </article>
  );
});

export default ArticleContent;

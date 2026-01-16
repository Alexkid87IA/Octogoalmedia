// src/components/article/sections/ArticleContent.tsx
// Design éditorial mobile-first avec glassmorphism
import React, { useState, useMemo, useCallback, useRef, memo } from "react";
import { PortableText } from "@portabletext/react";
import { Lightbulb, Share2, Heart } from "lucide-react";
import { SanityArticle, VerticalColors } from "../../../types/article.types";
import { urlFor } from "../../../utils/sanityClient";
import type {
  PortableTextBlockProps,
  PortableTextListProps,
  PortableTextListItemProps,
  PortableTextMarkProps,
  ImageBlockProps,
  CodeBlockProps,
  EmbedBlockProps,
  CustomBlockProps,
  CalloutBlockValue,
  StyledQuoteBlockValue,
  StatsCardBlockValue,
  PlayerComparisonBlockValue,
  ImageGalleryBlockValue,
  CtaButtonBlockValue,
  SpoilerBlockValue,
  AccordionBlockValue,
  DataTableBlockValue,
  TeamLineupBlockValue,
  FootballQuizBlockValue,
  MercatoRumorBlockValue,
  QuickPollBlockValue,
  TopListBlockValue,
} from "../../../types/portableText.types";
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

// Encart Publicitaire - Design glassmorphism discret
const AdPlacement: React.FC<{ type: 'inline' | 'sidebar'; className?: string }> = ({ type, className = '' }) => (
  <div className={`relative ${className}`}>
    <div className={`${type === 'inline' ? 'my-8 sm:my-12 py-6 px-6' : 'p-4'} bg-white/[0.02] backdrop-blur-sm border border-white/5 rounded-xl flex flex-col items-center justify-center text-center min-h-[100px]`}>
      <p className="text-[10px] uppercase tracking-widest text-gray-600 font-medium">
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

  // Design éditorial mobile-first avec glassmorphism - mémorisé pour éviter les re-renders
  const portableTextComponents = useMemo(() => ({
    block: {
      // H1 - Titre principal (rare dans le body)
      h1: ({ children }: PortableTextBlockProps) => (
        <h1 className="text-xl sm:text-2xl font-montserrat font-bold text-white mb-5 mt-10 sm:mt-12 leading-tight">
          {children}
        </h1>
      ),

      // H2 - Sections principales : grand, avec accent rose
      h2: ({ children, value }: PortableTextBlockProps) => {
        const text = value?.children?.[0]?.text || '';
        const id = `h2-${text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`;
        return (
          <h2
            id={id}
            className="text-lg sm:text-xl md:text-2xl font-montserrat font-bold text-white mt-10 sm:mt-14 mb-4 sm:mb-5 scroll-mt-24 flex items-center gap-3"
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
      h3: ({ children, value }: PortableTextBlockProps) => {
        const text = value?.children?.[0]?.text || '';
        const id = `h3-${text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`;
        return (
          <h3
            id={id}
            className="text-base font-montserrat font-bold text-gray-100 mt-6 sm:mt-8 mb-2 scroll-mt-24"
          >
            {children}
          </h3>
        );
      },

      // H4 - Très petit, gris, uppercase
      h4: ({ children }: PortableTextBlockProps) => (
        <h4 className="text-xs sm:text-sm font-montserrat font-semibold text-gray-500 mt-5 sm:mt-6 mb-2 uppercase tracking-wider">
          {children}
        </h4>
      ),

      // Paragraphe - Typographie mobile-first optimisée pour la lecture
      normal: ({ children }: PortableTextBlockProps) => {
        paragraphCountRef.current++;
        const showAd = paragraphCountRef.current === 5 || paragraphCountRef.current === 12;

        return (
          <>
            <p className="text-base sm:text-lg leading-[1.75] sm:leading-[1.85] text-gray-300 mb-5 sm:mb-6">
              {children}
            </p>
            {showAd && <AdPlacement type="inline" />}
          </>
        );
      },

      // Citation - Style glassmorphism élégant
      blockquote: ({ children }: PortableTextBlockProps) => (
        <blockquote className="my-8 sm:my-12 md:my-16 relative p-5 sm:p-8 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/10">
          {/* Reflet glassmorphism */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] via-transparent to-transparent pointer-events-none rounded-2xl" />

          {/* Ligne d'accent verticale */}
          <div
            className="absolute left-0 top-6 bottom-6 w-1 rounded-full"
            style={{ background: colors.bgGradient }}
          />

          {/* Contenu */}
          <div className="pl-4 sm:pl-6 relative">
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-montserrat italic text-white leading-snug">
              {children}
            </p>
          </div>
        </blockquote>
      ),
    },

    // Listes
    list: {
      bullet: ({ children }: PortableTextListProps) => (
        <div className="my-6 sm:my-8 space-y-2.5 sm:space-y-3">{children}</div>
      ),
      number: ({ children }: PortableTextListProps) => (
        <div className="my-6 sm:my-8 space-y-2.5 sm:space-y-3">{children}</div>
      ),
    },

    listItem: {
      bullet: ({ children }: PortableTextListItemProps) => (
        <div className="flex items-start gap-3 sm:gap-4 text-gray-300">
          <span className="mt-[9px] sm:mt-[10px] w-1.5 h-1.5 sm:w-[6px] sm:h-[6px] rounded-full bg-gradient-to-r from-pink-500 to-blue-500 flex-shrink-0" />
          <span className="text-base sm:text-lg leading-[1.75] sm:leading-[1.8]">{children}</span>
        </div>
      ),
      number: ({ children, index }: PortableTextListItemProps) => (
        <div className="flex items-start gap-3 sm:gap-4 text-gray-300">
          <span className="text-base sm:text-lg font-medium text-gray-500 w-5 sm:w-6 flex-shrink-0">
            {(index || 0) + 1}.
          </span>
          <span className="text-base sm:text-lg leading-[1.75] sm:leading-[1.8]">{children}</span>
        </div>
      ),
    },

    // Styles inline
    marks: {
      strong: ({ children }: PortableTextMarkProps) => (
        <strong className="font-semibold text-white">{children}</strong>
      ),
      em: ({ children }: PortableTextMarkProps) => (
        <em className="italic">{children}</em>
      ),
      code: ({ children }: PortableTextMarkProps) => (
        <code className="px-1.5 sm:px-2 py-0.5 bg-white/[0.08] backdrop-blur-sm rounded text-sm font-mono text-gray-300 border border-white/10">
          {children}
        </code>
      ),
      link: ({ value, children }: PortableTextMarkProps) => (
        <a
          href={value?.href}
          className="text-pink-400 hover:text-pink-300 underline underline-offset-4 decoration-pink-500/30 hover:decoration-pink-400 transition-colors"
          target="_blank"
          rel="noopener noreferrer"
        >
          {children}
        </a>
      ),
    },

    // Types spéciaux
    types: {
      image: ({ value }: ImageBlockProps) => (
        <figure className="my-8 sm:my-12 -mx-4 sm:mx-0">
          <div className="relative overflow-hidden sm:rounded-2xl">
            <img
              src={urlFor(value).width(1400).url()}
              alt={value.alt || "Image de l'article"}
              className="w-full"
              loading="lazy"
            />
          </div>
          {value.caption && (
            <figcaption className="text-xs sm:text-sm text-gray-500 mt-3 sm:mt-4 italic px-4 sm:px-0">
              {value.caption}
            </figcaption>
          )}
        </figure>
      ),

      code: ({ value }: CodeBlockProps) => (
        <div className="relative rounded-xl sm:rounded-2xl border border-white/10 overflow-hidden my-8 sm:my-10 bg-white/[0.02] backdrop-blur-xl">
          {/* Reflet glassmorphism */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] via-transparent to-transparent pointer-events-none" />

          <div className="flex items-center justify-between px-4 py-3 bg-white/[0.03] border-b border-white/10 relative">
            <span className="text-xs text-gray-500 font-mono">
              {value.language || 'code'}
            </span>
            <button
              onClick={() => handleCopyCode(value.code)}
              className="text-xs text-gray-500 hover:text-white transition-colors px-2 py-1 rounded-lg hover:bg-white/10"
            >
              {copied ? 'Copié !' : 'Copier'}
            </button>
          </div>
          <pre className="p-4 sm:p-6 text-sm overflow-x-auto relative">
            <code className="text-gray-300 font-mono">{value.code}</code>
          </pre>
        </div>
      ),

      instagram: ({ value }: EmbedBlockProps) => (
        <InstagramEmbed url={value?.url} caption={value?.caption} />
      ),
      youtube: ({ value }: EmbedBlockProps) => (
        <YouTubeEmbed value={value} />
      ),
      twitter: ({ value }: EmbedBlockProps) => (
        <TwitterEmbed url={value?.url} caption={value?.caption} />
      ),

      // Blocs éditeur v2.2
      callout: ({ value }: CustomBlockProps<CalloutBlockValue>) => <Callout value={value} />,
      styledQuote: ({ value }: CustomBlockProps<StyledQuoteBlockValue>) => <StyledQuote value={value} />,
      statsCard: ({ value }: CustomBlockProps<StatsCardBlockValue>) => <StatsCard value={value} />,
      playerComparison: ({ value }: CustomBlockProps<PlayerComparisonBlockValue>) => <PlayerComparison value={value} />,
      imageGallery: ({ value }: CustomBlockProps<ImageGalleryBlockValue>) => <ImageGallery value={value} />,
      ctaButton: ({ value }: CustomBlockProps<CtaButtonBlockValue>) => <CtaButton value={value} />,
      spoiler: ({ value }: CustomBlockProps<SpoilerBlockValue>) => <Spoiler value={value} />,
      accordion: ({ value }: CustomBlockProps<AccordionBlockValue>) => <Accordion value={value} />,
      dataTable: ({ value }: CustomBlockProps<DataTableBlockValue>) => <DataTable value={value} />,
      teamLineup: ({ value }: CustomBlockProps<TeamLineupBlockValue>) => <TeamLineupBlock value={value} />,
      footballQuiz: ({ value }: CustomBlockProps<FootballQuizBlockValue>) => <FootballQuizBlock value={value} />,
      mercatoRumor: ({ value }: CustomBlockProps<MercatoRumorBlockValue>) => <MercatoRumorBlock value={value} />,
      quickPoll: ({ value }: CustomBlockProps<QuickPollBlockValue>) => <QuickPollBlock value={value} />,
      topList: ({ value }: CustomBlockProps<TopListBlockValue>) => <TopListBlock value={value} />,
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
      <AdPlacement type="inline" className="mt-12 sm:mt-16" />

      {/* Points clés - Glassmorphism card */}
      {article.keyPoints && Array.isArray(article.keyPoints) && article.keyPoints.length > 0 && (
        <div className="mt-12 sm:mt-16 p-5 sm:p-8 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/10 relative overflow-hidden">
          {/* Reflet glassmorphism */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] via-transparent to-transparent pointer-events-none" />

          <div className="relative">
            <div className="flex items-center gap-3 mb-5 sm:mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-blue-500 flex items-center justify-center">
                <Lightbulb size={20} className="text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-montserrat font-bold text-white">
                À retenir
              </h3>
            </div>
            <ul className="space-y-3 sm:space-y-4">
              {article.keyPoints.map((point: string, index: number) => (
                <li key={index} className="flex items-start gap-3 text-gray-300">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-r from-pink-500/20 to-blue-500/20 border border-white/10 flex items-center justify-center text-xs font-bold text-white">
                    {index + 1}
                  </span>
                  <span className="text-base sm:text-lg leading-relaxed">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Tags - Glassmorphism pills */}
      {article.tags && article.tags.length > 0 && (
        <div className="mt-10 sm:mt-12 pt-6 sm:pt-8 border-t border-white/10">
          <p className="text-xs uppercase tracking-widest text-gray-500 mb-4">Tags</p>
          <div className="flex flex-wrap gap-2">
            {article.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1.5 text-sm text-gray-400 bg-white/[0.05] backdrop-blur-sm border border-white/10 rounded-full hover:border-pink-500/40 hover:text-white transition-all cursor-pointer"
              >
                {tag.title}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Partage - Glassmorphism Design (desktop only, mobile has floating bar) */}
      <div className="hidden lg:block mt-12 sm:mt-16 pt-6 sm:pt-8 border-t border-white/10">
        <div className="flex items-center gap-4">
          <span className="text-xs uppercase tracking-widest text-gray-500">Partager</span>
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
              className="p-3 bg-white/[0.05] hover:bg-white/10 backdrop-blur-sm border border-white/10 hover:border-pink-500/40 rounded-xl transition-all"
            >
              <Share2 size={18} className="text-gray-400" />
            </button>
            <button className="p-3 bg-white/[0.05] hover:bg-white/10 backdrop-blur-sm border border-white/10 hover:border-pink-500/40 rounded-xl transition-all">
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

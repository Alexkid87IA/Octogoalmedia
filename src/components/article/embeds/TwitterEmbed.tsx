// src/components/article/embeds/TwitterEmbed.tsx
import React, { useEffect, useRef, useState } from "react";
import { Twitter, Loader2, ExternalLink } from "lucide-react";

interface TwitterEmbedProps {
  url: string;
  caption?: string;
}

// Options pour le widget Twitter
interface TwitterWidgetOptions {
  theme?: 'light' | 'dark';
  align?: 'left' | 'center' | 'right';
  conversation?: 'none' | 'all';
  cards?: 'hidden' | 'visible';
  width?: number;
  dnt?: boolean;
  lang?: string;
}

// Déclaration pour Twitter widgets API
declare global {
  interface Window {
    twttr?: {
      widgets: {
        load: (element?: HTMLElement) => void;
        createTweet: (
          tweetId: string,
          targetEl: HTMLElement,
          options?: TwitterWidgetOptions
        ) => Promise<HTMLElement>;
      };
    };
  }
}

const TwitterEmbed: React.FC<TwitterEmbedProps> = ({ url, caption }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Extraire l'ID du tweet
  const getTweetId = (url: string): string | null => {
    if (!url) return null;
    
    // Patterns pour Twitter/X URLs
    const patterns = [
      /twitter\.com\/\w+\/status\/(\d+)/,
      /x\.com\/\w+\/status\/(\d+)/,
      /twitter\.com\/statuses\/(\d+)/,
      /x\.com\/statuses\/(\d+)/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    
    return null;
  };
  
  const tweetId = getTweetId(url);
  
  useEffect(() => {
    if (!tweetId || !containerRef.current) {
      setHasError(true);
      setIsLoading(false);
      return;
    }
    
    // Charger le script Twitter widgets si pas déjà chargé
    if (!window.twttr) {
      const script = document.createElement('script');
      script.src = 'https://platform.twitter.com/widgets.js';
      script.async = true;
      script.onload = () => {
        if (window.twttr && containerRef.current) {
          window.twttr.widgets.createTweet(
            tweetId,
            containerRef.current,
            {
              theme: 'dark',
              align: 'center',
              conversation: 'none',
              dnt: true
            }
          ).then(() => {
            setIsLoading(false);
          }).catch(() => {
            setHasError(true);
            setIsLoading(false);
          });
        }
      };
      document.body.appendChild(script);
    } else {
      // Script déjà chargé, créer le tweet directement
      window.twttr.widgets.createTweet(
        tweetId,
        containerRef.current,
        {
          theme: 'dark',
          align: 'center',
          conversation: 'none',
          dnt: true
        }
      ).then(() => {
        setIsLoading(false);
      }).catch(() => {
        setHasError(true);
        setIsLoading(false);
      });
    }
    
    return () => {
      // Nettoyer le container si nécessaire
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [tweetId]);
  
  // Si pas d'ID valide ou erreur
  if (!tweetId || hasError) {
    return (
      <div className="my-8 flex justify-center">
        <div className="w-full max-w-2xl">
          <div className="bg-gray-900/50 rounded-xl border border-gray-700 p-8 text-center">
            <Twitter className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400 mb-2">Tweet non disponible</p>
            <p className="text-sm text-gray-500">
              {!tweetId ? "L'URL fournie n'est pas valide" : "Impossible de charger le tweet"}
            </p>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all"
            >
              <Twitter className="w-4 h-4" />
              Voir sur X/Twitter
              <ExternalLink size={14} />
            </a>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="my-10 flex justify-center">
      <div className="w-full max-w-2xl">
        {/* Container avec style Twitter/X */}
        <div className="relative">
          {/* Loading state */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Loader2 className="w-8 h-8 text-blue-400 animate-spin mx-auto mb-4" />
                <p className="text-gray-400 text-sm">Chargement du tweet...</p>
              </div>
            </div>
          )}
          
          {/* Container pour le tweet embed */}
          <div 
            ref={containerRef}
            className="twitter-embed-container"
            style={{
              minHeight: isLoading ? '200px' : 'auto'
            }}
          />
        </div>
        
        {/* Caption optionnelle */}
        {caption && !isLoading && (
          <div className="mt-4 p-4 bg-gray-900/30 rounded-lg border border-gray-800">
            <p className="text-sm text-gray-400 italic text-center">
              {caption}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TwitterEmbed;
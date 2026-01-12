// src/components/article/embeds/YouTubeEmbed.tsx
import React, { useState, useMemo, memo } from "react";
import { ArrowRight, ChevronDown } from "lucide-react";

interface YouTubeEmbedProps {
  value: {
    url?: string;
    caption?: string;
    startTime?: number;
    autoplay?: boolean;
  };
}

const YouTubeEmbed: React.FC<YouTubeEmbedProps> = memo(({ value }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [cookiesAccepted, setCookiesAccepted] = useState(() => {
    // Vérifier si les cookies YouTube ont déjà été acceptés
    return localStorage.getItem('youtube-cookies-accepted') === 'true';
  });
  
  const getYouTubeId = (url: string) => {
    if (!url) return null;
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
      /youtube\.com\/shorts\/([^&\n?#]+)/
    ];
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };
  
  const videoId = getYouTubeId(value?.url || '');
  
  // Si pas d'ID valide
  if (!videoId) {
    return (
      <div className="my-8 p-6 bg-gray-900/50 rounded-xl border border-gray-700 text-center">
        <p className="text-gray-400">Vidéo YouTube non disponible</p>
        {value?.url && (
          <a 
            href={value.url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex items-center gap-2 mt-3 text-blue-400 hover:text-blue-300 transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
            Voir sur YouTube
          </a>
        )}
      </div>
    );
  }
  
  // Si cookies non acceptés
  if (!cookiesAccepted) {
    return (
      <div className="my-10 max-w-4xl mx-auto px-4 sm:px-0">
        <div className="bg-gray-900/50 rounded-xl border border-gray-700 p-8 text-center">
          <div className="mb-4">
            <svg className="w-16 h-16 mx-auto text-red-500 opacity-50" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Vidéo YouTube</h3>
          <p className="text-gray-400 mb-6">
            Cette vidéo nécessite l'acceptation des cookies YouTube pour être visionnée
          </p>
          <button 
            onClick={() => {
              setCookiesAccepted(true);
              localStorage.setItem('youtube-cookies-accepted', 'true');
            }}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors inline-flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"/>
            </svg>
            Accepter et voir la vidéo
          </button>
          <p className="text-xs text-gray-500 mt-3">
            En acceptant, vous autorisez le chargement de contenu depuis YouTube
          </p>
        </div>
      </div>
    );
  }
  
  // Construire l'URL d'embed avec les paramètres (mémoïsé pour éviter les re-renders)
  const embedUrl = useMemo(() => {
    const url = new URL(`https://www.youtube.com/embed/${videoId}`);
    if (value?.startTime) url.searchParams.set('start', value.startTime.toString());
    if (value?.autoplay) {
      url.searchParams.set('autoplay', '1');
      url.searchParams.set('mute', '1');
    }
    url.searchParams.set('rel', '0');
    url.searchParams.set('modestbranding', '1');
    url.searchParams.set('controls', '1');
    url.searchParams.set('showinfo', '0');
    url.searchParams.set('iv_load_policy', '3'); // Masquer les annotations
    return url.toString();
  }, [videoId, value?.startTime, value?.autoplay]);
  
  return (
    <div className="my-10 max-w-4xl mx-auto px-4 sm:px-0">
      <div className="relative w-full bg-black rounded-xl overflow-hidden shadow-2xl" style={{ paddingBottom: '56.25%' }}>
        {/* Loading state */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-gray-700 border-t-red-500 rounded-full animate-spin mb-4 mx-auto"></div>
              <p className="text-gray-400 text-sm">Chargement de la vidéo YouTube...</p>
            </div>
          </div>
        )}
        
        {/* YouTube iframe */}
        <iframe
          src={embedUrl}
          title={value?.caption || `YouTube video ${videoId}`}
          className={`absolute top-0 left-0 w-full h-full ${
            isLoading ? 'opacity-0' : 'opacity-100'
          } transition-opacity duration-500`}
          style={{ border: 'none' }}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
          onLoad={() => setIsLoading(false)}
        />
      </div>
      
      {/* Caption */}
      {value?.caption && (
        <div className="mt-4 p-4 bg-gray-900/30 rounded-lg border border-gray-800">
          <p className="text-sm text-gray-400 italic text-center">
            {value.caption}
          </p>
        </div>
      )}
      
      {/* Lien direct vers YouTube (optionnel) */}
      <div className="mt-2 text-center">
        <a 
          href={`https://www.youtube.com/watch?v=${videoId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-400 transition-colors"
        >
          Ouvrir sur YouTube
          <ArrowRight size={12} />
        </a>
      </div>
    </div>
  );
});

export default YouTubeEmbed;
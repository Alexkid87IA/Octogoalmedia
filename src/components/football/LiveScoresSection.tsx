import { useEffect, useRef, useState } from 'react';

/**
 * Section Live Scores avec widget ScoreAxis
 * Utilise l'injection de script dynamique pour contourner les problèmes CORS
 */
export default function LiveScoresSection() {
  const widgetRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Éviter les doubles chargements
    if (!widgetRef.current || isLoaded) return;

    // ID unique pour le widget
    const widgetId = 'scoreaxis-widget-' + Math.random().toString(36).substr(2, 9);
    
    // Créer le conteneur du widget
    const widgetContainer = document.createElement('div');
    widgetContainer.id = widgetId;
    widgetContainer.className = 'scoreaxis-widget';
    widgetContainer.style.cssText = `
      width: 100%;
      height: auto;
      min-height: 400px;
      font-size: 14px;
      background-color: #111827;
      color: #ffffff;
      border: none;
      overflow: auto;
    `;
    
    // Ajouter le conteneur au ref
    widgetRef.current.appendChild(widgetContainer);

    // Créer et charger le script
    const script = document.createElement('script');
    script.src = `https://widgets.scoreaxis.com/api/football/live-match/66717b45759a56977004a930?widgetId=${widgetId}&lang=fr&lineupsBlock=1&eventsBlock=1&statsBlock=1&links=1&font=heebo&fontSize=14&widgetWidth=auto&widgetHeight=auto&bodyColor=%23111827&textColor=%23ffffff&linkColor=%23ec4899&borderColor=%231f2937&tabColor=%231f2937`;
    script.async = true;
    
    script.onload = () => {
      setIsLoaded(true);
      // console.log('✅ Widget ScoreAxis chargé');
    };
    
    script.onerror = () => {
      setHasError(true);
      console.error('❌ Erreur chargement widget ScoreAxis');
    };

    // Ajouter le script au conteneur (pas au head)
    widgetContainer.appendChild(script);

    // Cleanup
    return () => {
      if (widgetRef.current) {
        widgetRef.current.innerHTML = '';
      }
    };
  }, []);

  return (
    <section className="py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
            ⚽ Live Scores
          </h2>
          <p className="text-gray-400">
            Suivez les matchs en direct
          </p>
        </div>

        {/* Widget Container */}
        <div className="bg-gray-900 rounded-2xl overflow-hidden shadow-xl">
          {/* Zone du widget */}
          <div 
            ref={widgetRef}
            className="min-h-[400px] relative"
          >
            {/* Loading state */}
            {!isLoaded && !hasError && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                <div className="text-center">
                  <div className="inline-block w-10 h-10 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-gray-400 mt-2 text-sm">Chargement des scores...</p>
                </div>
              </div>
            )}
            
            {/* Error state */}
            {hasError && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                <div className="text-center p-6">
                  <p className="text-gray-400 mb-4">Widget temporairement indisponible</p>
                  <a 
                    href="https://www.scoreaxis.com/live-scores"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-pink-400 hover:text-pink-300 underline"
                  >
                    Voir les scores sur ScoreAxis →
                  </a>
                </div>
              </div>
            )}
          </div>
          
          {/* Crédit ScoreAxis */}
          <div className="px-4 py-2 bg-black/50 text-center">
            <span className="text-gray-500 text-xs">
              Live scores by{' '}
              <a 
                href="https://www.scoreaxis.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-pink-400 hover:text-pink-300"
              >
                ScoreAxis
              </a>
            </span>
          </div>
        </div>

        {/* Lien vers la page complète */}
        <div className="text-center mt-6">
          <a 
            href="/football"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-medium rounded-full hover:opacity-90 transition-opacity"
          >
            📊 Voir tous les classements →
          </a>
        </div>
      </div>
    </section>
  );
}
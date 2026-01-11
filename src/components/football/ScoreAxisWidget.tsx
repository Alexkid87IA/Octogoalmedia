import { useEffect, useRef } from 'react';

interface ScoreAxisWidgetProps {
  // Tu peux personnaliser ces options
  theme?: 'light' | 'dark';
  fontSize?: number;
}

export default function ScoreAxisWidget({ theme = 'dark', fontSize = 14 }: ScoreAxisWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Nettoyer le conteneur avant d'ajouter le widget
    if (containerRef.current) {
      containerRef.current.innerHTML = '';
    }

    // Créer le div du widget
    const widgetDiv = document.createElement('div');
    widgetDiv.id = 'widget-5gc1mk1ltjv0';
    widgetDiv.className = 'scoreaxis-widget';
    
    // Style selon le thème
    const isDark = theme === 'dark';
    widgetDiv.style.cssText = `
      width: auto;
      height: auto;
      font-size: ${fontSize}px;
      background-color: ${isDark ? '#1a1a2e' : '#ffffff'};
      color: ${isDark ? '#ffffff' : '#141416'};
      border: 1px solid;
      border-color: ${isDark ? '#2d2d44' : '#ecf1f7'};
      border-radius: 12px;
      overflow: hidden;
    `;

    // Créer et charger le script
    const script = document.createElement('script');
    
    // Paramètres du widget adaptés au thème
    const bodyColor = isDark ? '%231a1a2e' : '%23ffffff';
    const textColor = isDark ? '%23ffffff' : '%23141416';
    const linkColor = isDark ? '%23f472b6' : '%23141416'; // Rose pour le dark mode
    const borderColor = isDark ? '%232d2d44' : '%23ecf1f7';
    const tabColor = isDark ? '%232d2d44' : '%23f3f8fd';
    
    script.src = `https://widgets.scoreaxis.com/api/football/live-match/66717b45759a56977004a930?widgetId=5gc1mk1ltjv0&lang=fr&lineupsBlock=1&eventsBlock=1&statsBlock=1&links=1&font=heebo&fontSize=${fontSize}&widgetWidth=auto&widgetHeight=auto&bodyColor=${bodyColor}&textColor=${textColor}&linkColor=${linkColor}&borderColor=${borderColor}&tabColor=${tabColor}`;
    script.async = true;

    // Ajouter le lien de crédit
    const creditDiv = document.createElement('div');
    creditDiv.className = 'widget-main-link';
    creditDiv.style.cssText = `
      padding: 6px 12px;
      font-weight: 500;
      font-size: 11px;
      text-align: center;
      color: ${isDark ? '#888' : '#666'};
    `;
    creditDiv.innerHTML = `Live data by <a href="https://www.scoreaxis.com/" style="color: inherit;">Scoreaxis</a>`;

    // Assembler le widget
    widgetDiv.appendChild(script);
    widgetDiv.appendChild(creditDiv);

    // Ajouter au conteneur
    if (containerRef.current) {
      containerRef.current.appendChild(widgetDiv);
    }

    // Cleanup
    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [theme, fontSize]);

  return (
    <div 
      ref={containerRef} 
      className="scoreaxis-container w-full"
    />
  );
}
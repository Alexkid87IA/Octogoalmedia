// src/components/article/ui/ArticleCTA.tsx
import React from "react";
import { Clock, Sparkles, Users, Crown, Star } from "lucide-react";
import { VerticalColors } from "../../../types/article.types";

interface ArticleCTAProps {
  colors: VerticalColors;
  variant?: 'desktop' | 'mobile';
}

const ArticleCTA: React.FC<ArticleCTAProps> = ({ colors, variant = 'desktop' }) => {
  const containerClass = variant === 'mobile' ? 'lg:hidden mt-12' : '';
  
  return (
    <div className={containerClass}>
      <div className="relative overflow-hidden rounded-2xl">
        <div 
          className="absolute inset-0 opacity-90"
          style={{ background: colors.bgGradient }}
        />
        {/* Pattern décoratif */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-32 h-32 transform rotate-45 translate-x-16 -translate-y-16">
            <div className="w-full h-full bg-white rounded-lg" />
          </div>
          <div className="absolute bottom-0 left-0 w-32 h-32 transform rotate-45 -translate-x-16 translate-y-16">
            <div className="w-full h-full bg-white rounded-lg" />
          </div>
        </div>
        
        <div className="relative p-6">
          {/* Badge Bientôt disponible */}
          <div className="flex items-center gap-2 mb-3">
            <span className="px-2 py-1 bg-white/20 rounded text-xs font-semibold text-white uppercase">
              Le Club Élite
            </span>
            <span className="px-2 py-1 bg-amber-500 text-black rounded text-xs font-bold flex items-center gap-1">
              <Clock size={10} />
              Bientôt
            </span>
          </div>
          
          {/* Icône animée */}
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center animate-pulse">
              <Crown className="w-8 h-8 text-black" />
            </div>
          </div>
          
          <h3 className="text-xl font-bold text-white mb-2 text-center">
            Quelque chose d'exceptionnel arrive
          </h3>
          <p className="text-white/90 text-sm mb-4 text-center">
            L'écosystème premium pour les entrepreneurs d'exception est en préparation.
          </p>
          
          {/* Preview des avantages */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-xs text-white/70">
              <span className="text-amber-400">✔</span>
              <span>Accès VIP aux contenus</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-white/70">
              <span className="text-amber-400">✔</span>
              <span>Communauté privée</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-white/70">
              <span className="text-amber-400">✔</span>
              <span>Events mensuels exclusifs</span>
            </div>
          </div>
          
          {/* Bouton désactivé avec style "Coming Soon" */}
          <div className="w-full py-3 bg-white/10 text-white/60 rounded-xl font-bold text-center border border-white/20 cursor-not-allowed">
            <div className="flex items-center justify-center gap-2">
              <Sparkles size={16} className="text-amber-400" />
              <span>Ouverture prochaine</span>
            </div>
          </div>
          
          {/* Indicateur de liste d'attente */}
          <div className="flex items-center justify-center gap-2 mt-3">
            <Users size={12} className="text-white/60" />
            <p className="text-xs text-white/60 text-center">
              500+ personnes attendent déjà
            </p>
          </div>
          
          {/* Étoiles */}
          <div className="flex items-center justify-center gap-1 mt-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={10} className="fill-amber-400 text-amber-400" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleCTA;
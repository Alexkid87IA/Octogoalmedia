// src/components/guide/sections/GuideIntro.tsx
import React from 'react';
import { GuideSection } from '../../../data/guides/digitalDetoxContent';
import { AlertCircle } from 'lucide-react';

interface GuideIntroProps {
  content: GuideSection;
}

const GuideIntro: React.FC<GuideIntroProps> = ({ content }) => {
  return (
    <section id={content.id} className="scroll-mt-24">
      {/* Warning Filter Box - Le Test d'Engagement */}
      <div className="mb-12 p-8 bg-gradient-to-br from-red-900/30 to-orange-900/30 border-2 border-red-500/50 rounded-xl">
        <div className="text-center mb-6">
          <span className="text-4xl">⚠️</span>
        </div>
        <h3 className="text-2xl font-bold text-white mb-4 text-center">
          STOP. Lisez ça avant de continuer.
        </h3>
        <div className="space-y-4 text-gray-300">
          <p className="text-lg">
            Oui, ce guide est <span className="text-white font-bold">très long</span>. 
            Votre cerveau est probablement déjà en train de chercher la sortie. 
            Votre doigt glisse déjà vers le bouton retour.
          </p>
          <p className="text-lg">
            Vous vous dites : <span className="italic text-gray-400">"C'est trop long, j'ai pas le temps, 
            j'ai pas l'attention pour tout lire, je vais juste scroller rapidement..."</span>
          </p>
          <p className="text-lg font-semibold text-orange-400">
            Et c'est EXACTEMENT le problème.
          </p>
          <p className="text-lg">
            Si l'idée de prendre <span className="text-white font-bold">25 minutes</span> pour lire 
            un guide qui pourrait transformer votre vie vous fait déjà fuir, alors vous êtes 
            <span className="text-red-400 font-bold"> plus atteint que vous ne le pensez</span>.
          </p>
          <p className="text-lg">
            Ce guide n'est pas pour les curieux. Il n'est pas pour ceux qui cherchent 
            une solution miracle en 3 bullet points. Il est pour celles et ceux qui ont 
            <span className="text-white font-bold"> vraiment compris qu'ils avaient un problème</span> avec 
            leur consommation digitale et qui sont prêts à faire le travail.
          </p>
          <p className="text-xl font-bold text-white mt-6 text-center">
            Seuls les plus déterminés iront au bout.
          </p>
          <p className="text-lg text-center text-gray-400 mt-4">
            Si vous êtes encore là, félicitations. Vous faites partie des 5% qui ont une chance de s'en sortir.
          </p>
        </div>
      </div>

      {/* Section Header */}
      <div className="mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
          {content.title}
        </h2>
        {content.subtitle && (
          <p className="text-xl text-purple-400">
            {content.subtitle}
          </p>
        )}
      </div>

      {/* Alert Box */}
      <div className="mb-8 p-6 bg-gradient-to-r from-purple-900/20 to-violet-900/20 border-l-4 border-purple-500 rounded-r-lg">
        <div className="flex items-start gap-3">
          <AlertCircle className="text-purple-400 mt-1 flex-shrink-0" size={20} />
          <div>
            <p className="text-lg font-semibold text-white mb-2">
              Fait alarmant
            </p>
            <p className="text-gray-300">
              {content.content.intro}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="prose prose-invert prose-lg max-w-none">
        {content.content.paragraphs?.map((paragraph, index) => (
          <p key={index} className="text-gray-300 leading-relaxed mb-6">
            {paragraph}
          </p>
        ))}
      </div>

      {/* Call to Action */}
      <div className="mt-8 p-6 bg-white/5 rounded-lg border border-white/10">
        <p className="text-white font-semibold mb-2">
          Ce guide n'est pas une énième méthode de "digital detox"
        </p>
        <p className="text-gray-400">
          C'est un manuel de guerre cognitive pour transformer vos pires ennemis numériques en armes de développement personnel.
        </p>
      </div>
    </section>
  );
};

export default GuideIntro;
// src/components/guide/sections/GuideConclusion.tsx
import React from 'react';
import { GuideSection } from '../../../data/guides/digitalDetoxContent';
import { Trophy, ArrowRight, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface GuideConclusionProps {
  content: GuideSection;
}

const GuideConclusion: React.FC<GuideConclusionProps> = ({ content }) => {
  return (
    <section id={content.id} className="scroll-mt-24">
      {/* Section Header */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-500">
            <Trophy size={24} className="text-white" />
          </div>
          <span className="text-yellow-400 font-semibold uppercase tracking-wider text-sm">
            Conclusion
          </span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
          {content.title}
        </h2>
        {content.subtitle && (
          <p className="text-xl text-gray-400">
            {content.subtitle}
          </p>
        )}
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        {content.content.paragraphs?.map((paragraph, index) => (
          <p key={index} className="text-gray-300 leading-relaxed text-lg">
            {paragraph}
          </p>
        ))}
      </div>

      {/* Quote */}
      {content.content.quote && (
        <div className="my-12 p-8 bg-gradient-to-br from-yellow-900/20 to-orange-900/20 rounded-2xl border border-yellow-500/30">
          <div className="text-center">
            <span className="text-6xl text-yellow-500/30 font-serif">"</span>
            <p className="text-xl md:text-2xl text-white font-light italic mb-4">
              {content.content.quote.text}
            </p>
            <p className="text-yellow-400">
              — {content.content.quote.author}
            </p>
          </div>
        </div>
      )}

      {/* Action Items */}
      {content.content.actionItems && (
        <div className="mt-12">
          <h3 className="text-2xl font-bold text-white mb-6">
            Vos prochaines actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {content.content.actionItems.map((item, index) => (
              <div 
                key={index}
                className="flex items-start gap-3 p-4 bg-gradient-to-br from-green-900/20 to-emerald-900/20 rounded-lg border border-green-500/30"
              >
                <CheckCircle className="text-green-400 mt-0.5 flex-shrink-0" size={20} />
                <span className="text-gray-300">{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Final CTA */}
      <div className="mt-16 p-8 bg-gradient-to-br from-purple-900/30 to-violet-900/30 rounded-2xl border border-purple-500/30">
        <div className="text-center">
          <Trophy className="text-yellow-400 mx-auto mb-4" size={48} />
          <h3 className="text-3xl font-bold text-white mb-4">
            Félicitations !
          </h3>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Vous avez maintenant toutes les clés pour reprendre le contrôle de votre vie digitale. 
            Le voyage commence maintenant. Chaque jour est une opportunité de progresser.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/club"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-violet-500 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all"
            >
              Rejoindre la communauté
              <ArrowRight size={18} />
            </Link>
            <Link 
              to="/guides"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition-all"
            >
              Découvrir d'autres guides
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>

      {/* Final Message */}
      <div className="mt-12 text-center">
        <p className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent">
          Votre futur vous en sera éternellement reconnaissant.
        </p>
        <p className="text-gray-500 mt-2">
          Commencez aujourd'hui. 🚀
        </p>
      </div>
    </section>
  );
};

export default GuideConclusion;
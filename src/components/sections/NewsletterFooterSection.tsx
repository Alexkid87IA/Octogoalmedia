import React from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Sparkles, 
  Calendar,
  Users,
  TrendingUp,
  Coffee,
  Zap,
  Star,
  Bell,
  Clock
} from 'lucide-react';

export const NewsletterFooterSection = () => {

  const benefits = [
    {
      icon: TrendingUp,
      text: "Analyses exclusives du marché"
    },
    {
      icon: Zap,
      text: "Stratégies actionnables"
    },
    {
      icon: Coffee,
      text: "5 min de lecture max"
    }
  ];

  return (
    <section className="relative py-32 overflow-hidden">
      {/* Background majestueux */}
      <div className="absolute inset-0">
        {/* Gradient de base */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-neutral-900 to-black" />
        
        {/* Effet aurora borealis */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-500/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-violet-500/20 rounded-full blur-[120px] animate-pulse animation-delay-2000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500/10 rounded-full blur-[150px] animate-pulse animation-delay-4000" />
        </div>

        {/* Grille en perspective */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        
        {/* Étoiles scintillantes */}
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-0.5 h-0.5 bg-white rounded-full"
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: Math.random() * 5,
                ease: "easeInOut"
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`
              }}
            />
          ))}
        </div>
      </div>

      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          {/* Badge Coming Soon */}
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: [0.9, 1.05, 1] }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-full mb-8"
          >
            <Clock className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-medium text-amber-400">Bientôt disponible</span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </motion.div>

          {/* Titre épique */}
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8">
            <span className="block text-white mb-2">La newsletter qui</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-violet-400 to-cyan-400 animate-gradient">
              transforme vos lundis
            </span>
          </h2>

          {/* Description premium */}
          <p className="text-xl md:text-2xl text-gray-300 mb-4 leading-relaxed">
            Chaque lundi matin, recevez <strong className="text-white">l'essentiel</strong> pour 
            démarrer la semaine avec une longueur d'avance
          </p>

          <p className="text-lg text-gray-400 mb-12">
            Insights exclusifs, stratégies actionnables et mindset d'exception.<br />
            Le carburant des entrepreneurs qui performent.
          </p>

          {/* Benefits pills */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full"
                >
                  <Icon className="w-4 h-4 text-blue-400" />
                  <span className="text-sm text-gray-300">{benefit.text}</span>
                </motion.div>
              );
            })}
          </div>

          {/* Coming Soon Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative max-w-xl mx-auto"
          >
            {/* Glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 rounded-2xl blur-lg opacity-30 animate-pulse" />
            
            <div className="relative bg-black/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
              {/* Icône animée */}
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center"
              >
                <Bell className="w-10 h-10 text-black" />
              </motion.div>

              <h3 className="text-2xl font-bold text-white mb-3">
                On prépare quelque chose d'incroyable
              </h3>
              
              <p className="text-gray-400 mb-6">
                Notre newsletter est en cours de préparation. 
                Revenez bientôt pour ne rien manquer !
              </p>

              {/* Badge de lancement */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full">
                <Calendar className="w-4 h-4 text-amber-400" />
                <span className="text-sm text-gray-300">Lancement prévu prochainement</span>
              </div>

              {/* Trust indicators */}
              <div className="mt-6 pt-6 border-t border-white/10">
                <div className="flex items-center justify-center gap-6 text-sm text-gray-400">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>Rejoignez <strong className="text-white">12,847</strong> futurs lecteurs</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-center gap-1 mt-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Testimonial */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-12"
          >
            <blockquote className="relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-6xl text-white/10">"</div>
              <p className="text-lg text-gray-300 italic max-w-2xl mx-auto">
                "Cette newsletter est devenue mon rituel du lundi. 
                <strong className="text-white"> 5 minutes de lecture qui valent 5 heures de recherche.</strong> 
                Un must pour tout entrepreneur sérieux."
              </p>
              <footer className="mt-4">
                <div className="flex items-center justify-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-violet-400" />
                  <div className="text-left">
                    <cite className="text-white font-semibold not-italic">Thomas Reynaud</cite>
                    <p className="text-xs text-gray-500">CEO @TechCorp, 50K MRR</p>
                  </div>
                </div>
              </footer>
            </blockquote>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default NewsletterFooterSection;
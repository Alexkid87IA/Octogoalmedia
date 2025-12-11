import React, { useState } from 'react';
import { 
  Bell,
  CheckCircle,
  ArrowRight,
  Star,
  Zap,
  Trophy,
  Users,
  Flame
} from 'lucide-react';

export const ClubSection = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = () => {
    if (email && email.includes('@')) {
      console.log('Email inscrit à la newsletter:', email);
      setIsSubscribed(true);
      setTimeout(() => {
        setEmail('');
        setIsSubscribed(false);
      }, 5000);
    }
  };

  const features = [
    {
      icon: Zap,
      title: 'Actus en avant-première',
      description: 'Les infos mercato et les scoops avant tout le monde'
    },
    {
      icon: Trophy,
      title: 'Pronostics exclusifs',
      description: 'Nos prédictions et analyses pour les gros matchs'
    },
    {
      icon: Flame,
      title: 'Contenus bonus',
      description: 'Des mèmes, des tops et du contenu inédit'
    },
    {
      icon: Users,
      title: 'Communauté Octogoal',
      description: 'Rejoins la famille des vrais passionnés de foot'
    }
  ];

  return (
    <>
      <style>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
        
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }
        
        .text-gradient-octo {
          background: linear-gradient(135deg, #EC4899 0%, #3B82F6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>

      <section className="relative py-24 overflow-hidden bg-black">
        {/* Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black via-neutral-950 to-black" />
          
          {/* Gradient mesh */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl animate-pulse-slow" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse-slow" style={{animationDelay: '2s'}} />
          </div>
          
          {/* Pattern */}
          <div 
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, #EC4899 1px, transparent 1px)',
              backgroundSize: '40px 40px'
            }}
          />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-16">
            {/* Badge */}
            <div className="inline-block mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-blue-400 rounded-full blur-xl opacity-60 animate-pulse-slow" />
                <div className="relative flex items-center gap-3 px-6 py-3 bg-black/80 backdrop-blur-xl rounded-full border border-pink-500/30">
                  <Bell className="w-5 h-5 text-pink-400" />
                  <span className="text-sm font-bold text-gradient-octo uppercase tracking-wider">
                    Newsletter Octogoal
                  </span>
                  <Bell className="w-5 h-5 text-blue-400" />
                </div>
              </div>
            </div>

            {/* Titre */}
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="text-white">Rejoins la </span>
              <span className="relative inline-block">
                <span className="relative z-10 text-gradient-octo">
                  team Octogoal
                </span>
                <div className="absolute -inset-2 bg-gradient-to-r from-pink-400/30 to-blue-400/30 blur-xl animate-pulse-slow" />
              </span>
            </h2>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-4">
              Reçois les meilleures actus foot, les tops exclusifs et les mèmes qui tuent directement dans ta boîte mail
            </p>
            <p className="text-lg text-pink-400 font-medium">
              ⚽ 100% gratuit • Zéro spam • Que du lourd
            </p>
          </div>

          {/* Form Box */}
          <div className="max-w-2xl mx-auto mb-16">
            <div className="relative">
              {/* Bordure animée */}
              <div className="absolute -inset-[2px] rounded-2xl opacity-80">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-pink-400 via-blue-400 to-pink-400 animate-gradient-x" />
              </div>
              
              <div className="relative bg-black/90 backdrop-blur-2xl rounded-2xl p-8">
                <div className="space-y-4">
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Ton meilleur email"
                      className="w-full px-6 py-4 bg-white/5 backdrop-blur-sm border border-pink-500/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-pink-400 focus:bg-white/10 transition-all text-lg"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleSubscribe();
                        }
                      }}
                    />
                    <Zap className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-pink-400 pointer-events-none" />
                  </div>
                  
                  <button
                    onClick={handleSubscribe}
                    className="relative w-full px-8 py-4 overflow-hidden rounded-xl font-bold text-lg group cursor-pointer transition-transform hover:scale-[1.02]"
                    disabled={isSubscribed}
                  >
                    {/* Background animé */}
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-blue-500 to-pink-500 animate-gradient-x" />
                    
                    <span className="relative flex items-center justify-center gap-3 text-white">
                      {isSubscribed ? (
                        <>
                          <CheckCircle className="w-6 h-6" />
                          <span>Bienvenue dans la team ! 🔥</span>
                        </>
                      ) : (
                        <>
                          <Bell className="w-6 h-6" />
                          <span>Je m'inscris gratuitement</span>
                          <ArrowRight className="w-6 h-6" />
                        </>
                      )}
                    </span>
                  </button>
                </div>
                
                {/* Garanties */}
                <div className="flex items-center justify-center gap-6 mt-6 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-pink-400" />
                    Gratuit pour toujours
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-blue-400" />
                    Désinscription en 1 clic
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="relative group transition-transform hover:-translate-y-1"
                >
                  <div className="relative h-full p-6 bg-black/40 backdrop-blur-xl border border-pink-500/10 hover:border-pink-500/30 rounded-2xl transition-all">
                    <div className="mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Social proof */}
          <div className="text-center">
            <div className="max-w-2xl mx-auto">
              {/* Avatars */}
              <div className="flex justify-center mb-6">
                <div className="flex -space-x-3">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="relative"
                    >
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-blue-500 border-2 border-black flex items-center justify-center shadow-xl">
                        <span className="text-xs font-bold text-white">⚽</span>
                      </div>
                    </div>
                  ))}
                  <div className="w-10 h-10 rounded-full bg-black/80 border-2 border-pink-500/30 flex items-center justify-center ml-2">
                    <span className="text-[10px] text-pink-400 font-bold">+2k</span>
                  </div>
                </div>
              </div>

              {/* Reviews */}
              <div className="flex items-center justify-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-pink-400 text-pink-400" />
                ))}
              </div>
              
              <p className="text-gray-400 mb-2">
                <strong className="text-white text-lg">Déjà +2000 passionnés</strong> reçoivent la newsletter
              </p>
              
              <p className="text-sm text-gray-500">
                "La meilleure newsletter foot, les actus sont toujours au top !" - @FootFan75
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ClubSection;
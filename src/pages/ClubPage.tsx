import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Crown, 
  Sparkles, 
  Users, 
  Zap, 
  Calendar,
  Bell,
  CheckCircle,
  ArrowRight,
  Clock,
  Trophy,
  Star,
  Lock,
  Diamond,
  Gem,
  Award,
  Heart,
  Target,
  Rocket,
  Shield,
  Gift,
  MessageCircle,
  BookOpen,
  Video,
  Headphones,
  TrendingUp,
  DollarSign,
  ChevronRight
} from 'lucide-react';
import { SEO } from '../components/common/SEO';
import { Footer } from '../components/layout/Footer';
import { Link } from 'react-router-dom';

export const ClubPage = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('monthly');

  const handleWaitlist = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // console.log('Email ajouté à la liste d\'attente:', email);
      setIsSubscribed(true);
      setTimeout(() => {
        setEmail('');
        setIsSubscribed(false);
      }, 5000);
    }
  };

  const benefits = [
    {
      icon: Crown,
      title: 'Contenus exclusifs',
      description: 'Articles premium, analyses approfondies et insights réservés aux membres',
      color: 'from-yellow-400 to-amber-500'
    },
    {
      icon: Users,
      title: 'Communauté privée',
      description: 'Accès à notre Discord privé avec des entrepreneurs d\'exception',
      color: 'from-purple-400 to-violet-500'
    },
    {
      icon: Calendar,
      title: 'Events VIP',
      description: 'Masterclass mensuelles, Q&A exclusifs et sessions de networking',
      color: 'from-blue-400 to-cyan-500'
    },
    {
      icon: Zap,
      title: 'Ressources premium',
      description: 'Templates, frameworks et outils utilisés par les leaders du marché',
      color: 'from-green-400 to-emerald-500'
    },
    {
      icon: Video,
      title: 'Replays illimités',
      description: 'Accès à tous les replays des événements et masterclass passés',
      color: 'from-pink-400 to-rose-500'
    },
    {
      icon: MessageCircle,
      title: 'Mentoring collectif',
      description: 'Sessions de groupe avec des entrepreneurs confirmés',
      color: 'from-orange-400 to-red-500'
    }
  ];

  const testimonials = [
    {
      name: "Sarah L.",
      role: "Fondatrice @TechStartup",
      content: "Le Club m'a permis de rencontrer des entrepreneurs incroyables et d'accélérer ma croissance.",
      rating: 5
    },
    {
      name: "Marc D.",
      role: "CEO @ScaleUp",
      content: "Les masterclass sont d'une qualité exceptionnelle. J'ai appliqué les conseils et x2 mon CA.",
      rating: 5
    },
    {
      name: "Julie M.",
      role: "Entrepreneure",
      content: "La communauté est bienveillante et les échanges sont toujours constructifs. Un vrai game-changer.",
      rating: 5
    }
  ];

  const faqs = [
    {
      question: "Quand le Club ouvre-t-il ?",
      answer: "Le lancement officiel est prévu dans 7 jours. Les membres de la liste d'attente auront un accès prioritaire."
    },
    {
      question: "Puis-je annuler à tout moment ?",
      answer: "Oui, vous pouvez annuler votre abonnement à tout moment, sans frais ni justification."
    },
    {
      question: "Y a-t-il une période d'essai ?",
      answer: "Les 100 premiers membres bénéficient d'une garantie satisfait ou remboursé de 30 jours."
    },
    {
      question: "Le prix augmentera-t-il ?",
      answer: "Le prix fondateur de 99€/mois est garanti à vie pour les early adopters. Le prix public sera de 199€/mois."
    }
  ];

  return (
    <>
      <SEO
        title="Le Club Élite | Octogoal Media"
        description="Rejoignez l'écosystème premium pour entrepreneurs d'exception. Contenus exclusifs, communauté privée et ressources premium."
      />

      <div className="min-h-screen bg-black">
        {/* Hero Section Premium */}
        <section className="relative pt-32 pb-20 overflow-hidden">
          {/* Background effects */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-b from-black via-neutral-950 to-black" />
            
            {/* Gradient mesh doré */}
            <div className="absolute inset-0">
              <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-gradient-to-r from-yellow-600/20 to-amber-600/20 rounded-full blur-[150px] animate-pulse" />
              <div className="absolute bottom-0 right-1/4 w-[800px] h-[800px] bg-gradient-to-r from-amber-600/20 to-yellow-600/20 rounded-full blur-[150px] animate-pulse" />
            </div>

            {/* Pattern de fond */}
            <div 
              className="absolute inset-0 opacity-[0.02]"
              style={{
                backgroundImage: `radial-gradient(circle at 2px 2px, gold 1px, transparent 1px)`,
                backgroundSize: '40px 40px'
              }}
            />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              {/* Badge */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 backdrop-blur-sm rounded-full mb-8 border border-yellow-500/30"
              >
                <Crown className="w-5 h-5 text-yellow-400" />
                <span className="text-sm font-bold text-yellow-400 uppercase tracking-wider">
                  Lancement imminent • Liste d'attente ouverte
                </span>
                <Crown className="w-5 h-5 text-yellow-400" />
              </motion.div>

              {/* Titre */}
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6">
                <span className="text-white">Le </span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-400 to-amber-500">
                  Club Élite
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto mb-8">
                L'écosystème premium pour les entrepreneurs d'exception qui transforment leur vision en empire
              </p>

              {/* CTA principal */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-4"
              >
                <Link
                  to="#waitlist"
                  className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-bold rounded-full hover:shadow-2xl hover:shadow-yellow-500/25 transition-all"
                >
                  Rejoindre la liste d'attente
                </Link>
                <Link
                  to="#benefits"
                  className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-medium rounded-full hover:bg-white/20 transition-all"
                >
                  Découvrir les avantages
                </Link>
              </motion.div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-4xl mx-auto">
                {[
                  { value: '500+', label: 'Inscrits', icon: Users },
                  { value: '100', label: 'Places fondateurs', icon: Trophy },
                  { value: '7J', label: 'Avant lancement', icon: Clock },
                  { value: '-50%', label: 'Réduction fondateurs', icon: Gift }
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    className="relative group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative bg-black/40 backdrop-blur-sm border border-yellow-500/20 rounded-2xl p-6 text-center">
                      <stat.icon className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
                      <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-400">
                        {stat.value}
                      </div>
                      <div className="text-sm text-gray-400 uppercase tracking-wider mt-1">
                        {stat.label}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Benefits Section */}
        <section id="benefits" className="py-20 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Tout ce dont vous avez besoin pour
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-500"> réussir</span>
              </h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Des ressources exclusives et une communauté engagée pour accélérer votre croissance
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {benefits.map((benefit, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="relative group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-amber-500/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative h-full p-8 bg-black/40 backdrop-blur-xl border border-yellow-500/10 rounded-3xl hover:border-yellow-500/30 transition-all">
                    <div className={`w-14 h-14 bg-gradient-to-br ${benefit.color} rounded-2xl flex items-center justify-center mb-6`}>
                      <benefit.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">{benefit.title}</h3>
                    <p className="text-gray-400">{benefit.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="waitlist" className="py-20 relative">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              {/* Bordure dorée animée */}
              <div className="absolute -inset-[2px] rounded-3xl opacity-80">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-400" 
                  style={{
                    backgroundSize: '200% 200%',
                    animation: 'gradient-x 3s ease infinite'
                  }}
                />
              </div>
              
              <div className="relative bg-black/90 backdrop-blur-2xl rounded-3xl p-8 md:p-12">
                <div className="text-center mb-8">
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                    Offre de lancement exclusive
                  </h2>
                  <p className="text-gray-400">
                    Rejoignez les 100 premiers membres fondateurs
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-12 items-center">
                  {/* Pricing */}
                  <div className="text-center md:text-left">
                    <div className="mb-6">
                      <span className="inline-block px-5 py-2 bg-gradient-to-r from-red-500 to-orange-500 text-white text-sm font-bold rounded-full">
                        OFFRE FONDATEURS -50%
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-3 justify-center md:justify-start mb-4">
                      <span className="text-3xl text-gray-500 line-through">199€</span>
                      <span className="text-gray-400">/mois</span>
                    </div>
                    
                    <div className="flex items-baseline gap-3 justify-center md:justify-start mb-6">
                      <span className="text-7xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-500">
                        99€
                      </span>
                      <span className="text-2xl text-gray-400">/mois</span>
                    </div>

                    <div className="space-y-3">
                      {[
                        'Prix garanti à vie',
                        'Accès prioritaire au lancement',
                        'Bonus exclusifs early adopters',
                        'Garantie satisfait ou remboursé 30j'
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-yellow-400" />
                          <span className="text-gray-300">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Form */}
                  <div>
                    <form onSubmit={handleWaitlist} className="space-y-4">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Votre meilleur email"
                        required
                        className="w-full px-6 py-4 bg-white/5 backdrop-blur-sm border border-yellow-500/30 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 focus:bg-white/10 transition-all text-lg"
                      />
                      
                      <motion.button
                        type="submit"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full px-8 py-5 bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-bold text-lg rounded-2xl hover:shadow-2xl hover:shadow-yellow-500/25 transition-all"
                        disabled={isSubscribed}
                      >
                        {isSubscribed ? (
                          <span className="flex items-center justify-center gap-2">
                            <CheckCircle className="w-6 h-6" />
                            Inscrit avec succès !
                          </span>
                        ) : (
                          <span className="flex items-center justify-center gap-2">
                            <Bell className="w-6 h-6" />
                            Rejoindre la liste d'attente
                            <ArrowRight className="w-6 h-6" />
                          </span>
                        )}
                      </motion.button>
                    </form>
                    
                    <div className="flex items-center justify-center gap-6 text-xs text-gray-500 mt-4">
                      <span className="flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        Paiement sécurisé
                      </span>
                      <span className="flex items-center gap-1">
                        <Shield className="w-3 h-3" />
                        Sans engagement
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Ils font déjà partie de l'aventure
              </h2>
              <p className="text-xl text-gray-400">
                Découvrez ce que disent les early adopters
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-black/40 backdrop-blur-xl border border-yellow-500/10 rounded-2xl p-8"
                >
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-300 mb-6 italic">"{testimonial.content}"</p>
                  <div>
                    <p className="font-bold text-white">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Questions fréquentes
              </h2>
            </motion.div>

            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-black/40 backdrop-blur-xl border border-yellow-500/10 rounded-2xl p-6"
                >
                  <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                    <ChevronRight className="w-5 h-5 text-yellow-400" />
                    {faq.question}
                  </h3>
                  <p className="text-gray-400 ml-7">{faq.answer}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-gradient-to-r from-yellow-500/10 to-amber-500/10 backdrop-blur-xl border border-yellow-500/20 rounded-3xl p-12"
            >
              <Rocket className="w-16 h-16 text-yellow-400 mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Prêt à passer au niveau supérieur ?
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Rejoignez les entrepreneurs qui transforment leur vision en réalité. Places limitées.
              </p>
              <a
                href="#waitlist"
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-bold text-lg rounded-full hover:shadow-2xl hover:shadow-yellow-500/25 transition-all"
              >
                <Crown className="w-6 h-6" />
                Rejoindre le Club Élite
                <ArrowRight className="w-6 h-6" />
              </a>
            </motion.div>
          </div>
        </section>

        <Footer />
      </div>

      {/* Styles pour animations */}
      <style jsx>{`
        @keyframes gradient-x {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
      `}</style>
    </>
  );
};

export default ClubPage;
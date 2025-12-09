import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  ChevronDown, 
  Plus, 
  Minus, 
  Instagram, 
  Mail,
  PenTool,
  Video,
  Mic,
  Camera,
  Sparkles,
  Users,
  Target,
  Rocket,
  MessageCircle,
  CheckCircle,
  TrendingUp,
  Heart,
  Zap,
  BookOpen,
  Award
} from 'lucide-react';
import { SEO } from '../components/common/SEO';
import { Footer } from '../components/layout/Footer';

export const CreateWithRogerPage = () => {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [selectedTheme, setSelectedTheme] = useState('story');
  
  // Texte animé
  const words = ['échecs', 'succès', 'défis', 'victoires', 'parcours'];
  const [currentWord, setCurrentWord] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % words.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const themes = [
    {
      id: 'story',
      title: 'Story',
      description: 'Parcours inspirants et transformations personnelles',
      icon: BookOpen,
      gradient: 'from-purple-400 to-violet-500',
      bgGlow: 'from-purple-600/20 to-violet-600/20',
      borderColor: 'border-purple-500/20',
      examples: ['Reconversion radicale', 'Première entreprise', 'Moments décisifs']
    },
    {
      id: 'business',
      title: 'Business',
      description: 'Stratégies, innovations et croissance',
      icon: TrendingUp,
      gradient: 'from-blue-400 to-cyan-500',
      bgGlow: 'from-blue-600/20 to-cyan-600/20',
      borderColor: 'border-blue-500/20',
      examples: ['Scaling international', 'Pivot réussi', 'Levée de fonds']
    },
    {
      id: 'mental',
      title: 'Mental',
      description: 'Mindset, résilience et développement',
      icon: Zap,
      gradient: 'from-emerald-400 to-teal-500',
      bgGlow: 'from-emerald-600/20 to-teal-600/20',
      borderColor: 'border-emerald-500/20',
      examples: ['Leadership authentique', 'Gestion du stress', 'Flow state']
    },
    {
      id: 'society',
      title: 'Society',
      description: 'Impact social et vision du futur',
      icon: Users,
      gradient: 'from-pink-400 to-rose-500',
      bgGlow: 'from-pink-600/20 to-rose-600/20',
      borderColor: 'border-pink-500/20',
      examples: ['Tech for good', 'Diversité & inclusion', 'Innovation sociale']
    }
  ];

  const formats = [
    {
      icon: PenTool,
      title: 'Article écrit',
      description: '800-2000 mots pour raconter votre histoire',
      gradient: 'from-indigo-400 to-purple-500'
    },
    {
      icon: Video,
      title: 'Interview vidéo',
      description: 'Une conversation filmée avec notre équipe',
      gradient: 'from-red-400 to-pink-500'
    },
    {
      icon: Mic,
      title: 'Podcast audio',
      description: 'Partagez votre voix et votre passion',
      gradient: 'from-green-400 to-emerald-500'
    },
    {
      icon: Camera,
      title: 'Photo-récit',
      description: 'Une histoire visuelle avec légendes',
      gradient: 'from-yellow-400 to-orange-500'
    }
  ];

  const benefits = [
    {
      icon: Heart,
      title: 'Inspirer',
      description: 'Vos défis d\'aujourd\'hui sont les solutions de demain pour d\'autres',
      gradient: 'from-red-400 to-pink-500'
    },
    {
      icon: Users,
      title: 'Connecter',
      description: 'Créez des liens authentiques avec des personnes qui vous comprennent',
      gradient: 'from-blue-400 to-indigo-500'
    },
    {
      icon: Rocket,
      title: 'Grandir',
      description: 'Clarifiez vos pensées et prenez du recul sur votre parcours',
      gradient: 'from-purple-400 to-violet-500'
    }
  ];

  const faqs = [
    {
      question: "Comment puis-je partager mon histoire?",
      answer: "La plateforme de soumission arrive très bientôt! En attendant, contactez-nous directement sur Instagram @octogoal.media ou par email à contact@octogoal.media"
    },
    {
      question: "Quel format choisir pour mon histoire?",
      answer: "Nous proposons plusieurs formats: article écrit, interview vidéo, podcast audio ou photo-récit. Notre équipe vous aidera à choisir le format qui correspond le mieux à votre histoire."
    },
    {
      question: "Mon histoire est-elle assez intéressante?",
      answer: "Chaque parcours est unique et mérite d'être partagé. L'authenticité prime sur le spectaculaire. Vos expériences peuvent vraiment inspirer quelqu'un."
    },
    {
      question: "Quand la plateforme sera-t-elle disponible?",
      answer: "Nous travaillons activement sur le lancement. Suivez-nous sur Instagram ou inscrivez-vous à notre newsletter pour être informé en priorité."
    },
    {
      question: "Puis-je rester anonyme?",
      answer: "Oui, nous respectons votre choix de confidentialité. Vous pouvez publier sous pseudonyme si votre histoire le nécessite."
    }
  ];

  return (
    <>
      <SEO
        title="Racontez votre histoire | Octogoal Media"
        description="Partagez votre parcours entrepreneurial et inspirez la communauté. Article, vidéo, podcast - choisissez votre format."
      />

      <div className="min-h-screen bg-black">
        {/* Hero Section Premium */}
        <section className="relative pt-32 pb-20 overflow-hidden">
          {/* Background effects */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-b from-black via-neutral-950 to-black" />
            
            {/* Gradient mesh violet/cyan */}
            <div className="absolute inset-0">
              <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-gradient-to-r from-violet-600/20 to-purple-600/20 rounded-full blur-[150px] animate-pulse" />
              <div className="absolute bottom-0 right-1/4 w-[800px] h-[800px] bg-gradient-to-r from-cyan-600/20 to-blue-600/20 rounded-full blur-[150px] animate-pulse" />
            </div>

            {/* Pattern de fond */}
            <div 
              className="absolute inset-0 opacity-[0.02]"
              style={{
                backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 1px)`,
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
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-500/20 to-purple-500/20 backdrop-blur-sm rounded-full mb-8 border border-violet-500/30"
              >
                <Sparkles className="w-5 h-5 text-violet-400" />
                <span className="text-sm font-bold text-violet-400 uppercase tracking-wider">
                  Nouvelle section • Bientôt disponible
                </span>
                <Sparkles className="w-5 h-5 text-violet-400" />
              </motion.div>

              {/* Titre */}
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6">
                <span className="text-white">Votre histoire </span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-300 via-purple-400 to-cyan-400">
                  mérite d'être racontée
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto mb-8">
                Rejoignez des entrepreneurs qui transforment leurs{' '}
                <motion.span
                  key={currentWord}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400 font-bold"
                >
                  {words[currentWord]}
                </motion.span>
                {' '}en inspiration collective
              </p>

              {/* CTA principal */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col items-center gap-4"
              >
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-violet-500 to-cyan-500 rounded-full blur opacity-30 group-hover:opacity-50 transition-opacity" />
                  <button className="relative px-8 py-4 bg-black/90 rounded-full border border-violet-500/30 cursor-default">
                    <span className="text-gray-400">Plateforme en cours de développement</span>
                  </button>
                </div>
                
                <p className="text-sm text-gray-500">En attendant, contactez-nous directement</p>
                
                <div className="flex gap-4">
                  <a 
                    href="https://www.instagram.com/octogoal.media/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-gradient-to-r from-violet-400 to-purple-500 text-white font-bold rounded-full hover:shadow-2xl hover:shadow-violet-500/25 transition-all flex items-center gap-2"
                  >
                    <Instagram className="w-5 h-5" />
                    @octogoal.media
                  </a>
                  <a 
                    href="mailto:contact@octogoal.media"
                    className="px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-medium rounded-full hover:bg-white/20 transition-all flex items-center gap-2"
                  >
                    <Mail className="w-5 h-5" />
                    Email
                  </a>
                </div>
              </motion.div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-4xl mx-auto">
                {[
                  { value: '4', label: 'Thématiques', icon: Target },
                  { value: '4', label: 'Formats', icon: MessageCircle },
                  { value: '∞', label: 'Histoires possibles', icon: BookOpen },
                  { value: '100%', label: 'Authenticité', icon: Award }
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    className="relative group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-violet-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative bg-black/40 backdrop-blur-sm border border-violet-500/20 rounded-2xl p-6 text-center">
                      <stat.icon className="w-8 h-8 text-violet-400 mx-auto mb-3" />
                      <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-purple-400">
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

        {/* Testimonial Section - Types d'histoires */}
        <section className="py-20 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              {/* Background glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-violet-600/10 via-purple-600/10 to-cyan-600/10 rounded-3xl blur-3xl" />
              
              {/* Content */}
              <div className="relative bg-black/40 backdrop-blur-xl border border-violet-500/10 rounded-3xl p-12">
                <div className="max-w-5xl mx-auto text-center">
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
                    Toutes les histoires ont leur place
                  </h2>
                  
                  <p className="text-xl text-gray-300 leading-relaxed mb-12">
                    Que vous ayez vécu un <span className="text-violet-400 font-semibold">échec libérateur</span> ou destructeur, 
                    que vous souhaitiez partager votre <span className="text-cyan-400 font-semibold">état mental</span> face à une situation complexe, 
                    nous offrir une <span className="text-purple-400 font-semibold">étude de cas business</span> utile à la communauté 
                    ou décrypter des <span className="text-pink-400 font-semibold">faits sociétaux et culturels</span> qui façonnent notre époque...
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
                    {[
                      { text: "Reconversion radicale", color: "from-violet-400 to-purple-400" },
                      { text: "Burnout et renaissance", color: "from-cyan-400 to-blue-400" },
                      { text: "Pivot stratégique", color: "from-purple-400 to-pink-400" },
                      { text: "Innovation disruptive", color: "from-pink-400 to-rose-400" },
                      { text: "Leadership en crise", color: "from-blue-400 to-indigo-400" },
                      { text: "Impact social", color: "from-emerald-400 to-green-400" },
                      { text: "Échec constructif", color: "from-orange-400 to-red-400" },
                      { text: "Vision du futur", color: "from-yellow-400 to-amber-400" }
                    ].map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.05 }}
                        className="px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full border border-white/10"
                      >
                        <span className={`text-sm font-medium text-transparent bg-clip-text bg-gradient-to-r ${item.color}`}>
                          {item.text}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                  
                  <p className="text-lg text-gray-400 italic">
                    Chaque parcours est unique. Chaque perspective compte. Votre authenticité est votre force.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Pourquoi partager
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400"> votre histoire?</span>
              </h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Transformez votre expérience en inspiration collective
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {benefits.map((benefit, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="relative group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-purple-500/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative h-full p-8 bg-black/40 backdrop-blur-xl border border-violet-500/10 rounded-3xl hover:border-violet-500/30 transition-all">
                    <div className={`w-14 h-14 bg-gradient-to-br ${benefit.gradient} rounded-2xl flex items-center justify-center mb-6`}>
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

        {/* Themes Section */}
        <section className="py-20 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Choisissez votre
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400"> univers</span>
              </h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                4 thématiques pour raconter votre parcours unique
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {themes.map((theme, i) => (
                <motion.div
                  key={theme.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  onMouseEnter={() => setSelectedTheme(theme.id)}
                  className="relative group cursor-pointer"
                >
                  <div className={`absolute inset-0 bg-gradient-to-r ${theme.bgGlow} rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity`} />
                  <div className={`relative h-full p-8 bg-black/40 backdrop-blur-xl border ${
                    selectedTheme === theme.id ? theme.borderColor : 'border-white/5'
                  } rounded-3xl hover:border-opacity-50 transition-all`}>
                    <div className={`w-14 h-14 bg-gradient-to-br ${theme.gradient} rounded-2xl flex items-center justify-center mb-6`}>
                      <theme.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">{theme.title}</h3>
                    <p className="text-gray-400 mb-6">{theme.description}</p>
                    <div className="space-y-2">
                      {theme.examples.map((example, j) => (
                        <div key={j} className="flex items-center gap-2">
                          <div className={`w-1.5 h-1.5 bg-gradient-to-r ${theme.gradient} rounded-full`} />
                          <span className="text-sm text-gray-500">{example}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Formats Section */}
        <section className="py-20 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Comment raconter
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400"> votre histoire?</span>
              </h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Plusieurs formats pour s'adapter à votre style
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {formats.map((format, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="relative group"
                >
                  <div className="absolute -inset-[1px] rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${format.gradient}`} />
                  </div>
                  <div className="relative h-full p-8 bg-black/90 backdrop-blur-xl rounded-3xl">
                    <div className={`w-14 h-14 bg-gradient-to-br ${format.gradient} rounded-2xl flex items-center justify-center mb-6`}>
                      <format.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">{format.title}</h3>
                    <p className="text-gray-400">{format.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-12 text-center"
            >
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-500/10 to-purple-500/10 backdrop-blur-sm rounded-full border border-violet-500/30">
                <CheckCircle className="w-5 h-5 text-violet-400" />
                <span className="text-violet-400">Tous les formats seront disponibles au lancement</span>
              </div>
            </motion.div>
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
                >
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                    className="w-full bg-black/40 backdrop-blur-xl border border-violet-500/10 rounded-2xl p-6 hover:border-violet-500/30 transition-all"
                  >
                    <div className="flex items-center justify-between text-left">
                      <h3 className="text-lg font-bold text-white pr-4">{faq.question}</h3>
                      {expandedFaq === i ? 
                        <Minus className="w-5 h-5 text-violet-400 flex-shrink-0" /> : 
                        <Plus className="w-5 h-5 text-gray-500 flex-shrink-0" />
                      }
                    </div>
                    {expandedFaq === i && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="text-gray-400 mt-4 text-left"
                      >
                        {faq.answer}
                      </motion.p>
                    )}
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              {/* Bordure animée */}
              <div className="absolute -inset-[2px] rounded-3xl opacity-80">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-violet-400 via-purple-400 to-cyan-400" 
                  style={{
                    backgroundSize: '200% 200%',
                    animation: 'gradient-x 3s ease infinite'
                  }}
                />
              </div>
              
              <div className="relative bg-black/90 backdrop-blur-2xl rounded-3xl p-12 text-center">
                <Rocket className="w-16 h-16 text-violet-400 mx-auto mb-6" />
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Prêt à partager votre histoire?
                </h2>
                <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                  La plateforme arrive bientôt. En attendant, contactez-nous pour être parmi les premiers.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="https://www.instagram.com/octogoal.media/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-violet-400 to-purple-500 text-white font-bold text-lg rounded-full hover:shadow-2xl hover:shadow-violet-500/25 transition-all"
                  >
                    <Instagram className="w-6 h-6" />
                    Contactez-nous sur Instagram
                    <ArrowRight className="w-6 h-6" />
                  </a>
                  
                  <a
                    href="mailto:contact@octogoal.media"
                    className="inline-flex items-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-medium text-lg rounded-full hover:bg-white/20 transition-all"
                  >
                    <Mail className="w-6 h-6" />
                    Envoyez un email
                  </a>
                </div>
                
                <div className="mt-8 flex items-center justify-center gap-2 text-sm text-gray-500">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span>Réponse garantie sous 48h</span>
                </div>
              </div>
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

export default CreateWithRogerPage;
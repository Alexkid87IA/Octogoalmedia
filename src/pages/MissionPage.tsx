import React from 'react';
import { motion } from 'framer-motion';
import { 
  Target, 
  Heart, 
  Zap, 
  Users, 
  TrendingUp,
  Sparkles,
  ArrowRight,
  CheckCircle,
  Globe,
  Lightbulb,
  Shield,
  Rocket,
  Star,
  Award
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Footer } from '../components/layout/Footer';

export const MissionPage = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const values = [
    {
      icon: Heart,
      title: "Authenticité",
      description: "L'authenticité n'est pas négociable. Nous présentons les parcours dans leur vérité - avec leurs doutes, leurs pivots, leurs moments de grâce comme leurs passages à vide. Parce que c'est dans cette sincérité que réside le véritable pouvoir d'inspiration. Nous refusons le storytelling artificiel et les narratifs simplifiés qui gomment la réalité de l'entrepreneuriat.",
      gradient: "from-amber-500 to-orange-500",
      color: "amber"
    },
    {
      icon: Award,
      title: "Excellence",
      description: "L'excellence est notre standard minimum. Chaque article, chaque podcast, chaque analyse doit apporter une valeur exceptionnelle à notre audience. Nous investissons le temps nécessaire pour approfondir, vérifier, affiner. Nous préférons publier moins mais mieux. La médiocrité n'a pas sa place dans notre écosystème.",
      gradient: "from-blue-500 to-cyan-500",
      color: "blue"
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description: "L'innovation guide notre approche éditoriale et technologique. Nous explorons constamment de nouveaux formats, de nouvelles voix, de nouvelles perspectives. Nous questionnons les conventions du média traditionnel et inventons de nouvelles façons de raconter, d'analyser, de connecter. Notre obsession : rester à l'avant-garde sans jamais sacrifier la substance au style.",
      gradient: "from-purple-500 to-violet-500",
      color: "purple"
    },
    {
      icon: Users,
      title: "Communauté",
      description: "La communauté est notre force et notre raison d'être. Nous ne créons pas pour une audience passive mais avec une communauté active. Chaque membre enrichit l'écosystème par ses expériences, ses questions, ses contributions. Nous facilitons les connexions, encourageons les collaborations, célébrons les réussites collectives.",
      gradient: "from-emerald-500 to-teal-500",
      color: "emerald"
    }
  ];

  const commitments = [
    {
      title: "Qualité sans compromis",
      description: "Chaque contenu publié respecte nos standards d'excellence les plus élevés. Nous préférons ne pas publier plutôt que de publier médiocre."
    },
    {
      title: "Vérité sans filtre",
      description: "Nous présentons la réalité de l'entrepreneuriat et du leadership dans toute sa complexité, sans romantisation ni dramatisation excessive."
    },
    {
      title: "Valeur actionnable",
      description: "Chaque article, chaque épisode doit vous apporter des insights que vous pouvez appliquer concrètement dans votre parcours."
    },
    {
      title: "Accessibilité permanente",
      description: "Nous nous engageons à maintenir nos contenus accessibles, à éviter le jargon inutile, à expliquer les concepts complexes."
    },
    {
      title: "Évolution constante",
      description: "Nous restons à l'écoute de notre communauté et évoluons continuellement pour mieux servir vos besoins et ambitions."
    }
  ];

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20">
        {/* Background avec gradients colorés dynamiques */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black" />
          {/* Gradients colorés aux 4 coins */}
          <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-gradient-radial from-amber-500/20 via-amber-500/5 to-transparent blur-3xl" />
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-radial from-blue-500/20 via-blue-500/5 to-transparent blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-radial from-purple-500/20 via-purple-500/5 to-transparent blur-3xl" />
          <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-radial from-emerald-500/20 via-emerald-500/5 to-transparent blur-3xl" />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-blue-400 to-purple-400">
              Notre Mission
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
            Révéler les histoires qui transforment
          </p>
        </motion.div>
      </section>

      {/* Section Introduction */}
      <section className="py-20 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">
                Pourquoi Octogoal Media existe
              </span>
            </h2>
            
            <div className="space-y-6 text-gray-300 leading-relaxed">
              <p className="text-lg">
                Dans un monde saturé d'informations superficielles et de success stories formatées, nous avons créé Octogoal Media avec une conviction profonde : les véritables histoires de transformation méritent d'être racontées dans toute leur authenticité, leur complexité et leur humanité.
              </p>
              
              <p className="text-lg">
                Nous ne sommes pas un énième média business. Nous sommes une plateforme de révélation - un espace où les parcours exceptionnels rencontrent les esprits ambitieux, où les échecs deviennent des leçons, où les réussites inspirent sans intimider.
              </p>
              
              <p className="text-lg">
                Octogoal Media est né de la frustration face aux contenus qui survolent, aux conseils génériques, aux formules toutes faites. Nous croyons que notre audience mérite mieux : des analyses profondes, des récits nuancés, des insights actionnables.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section Vision */}
      <section className="py-20 bg-gradient-to-b from-black via-gray-900/10 to-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                La vision qui nous anime
              </span>
            </h2>
            
            <div className="bg-gradient-to-r from-blue-900/30 to-cyan-900/30 border border-blue-800/50 rounded-2xl p-8 mb-8 backdrop-blur-sm">
              <p className="text-xl text-gray-200 font-medium text-center italic">
                "Nous visons à créer le média de référence pour une nouvelle génération d'entrepreneurs et de leaders - ceux qui refusent le statu quo, qui questionnent les évidences, qui construisent avec conscience et ambition."
              </p>
            </div>
            
            <div className="space-y-6 text-gray-300 leading-relaxed">
              <p className="text-lg">
                Notre vision dépasse la simple création de contenu. Nous construisons un écosystème complet où l'information de qualité rencontre la communauté engagée, où l'inspiration se transforme en action concrète, où chaque membre peut à la fois apprendre et transmettre.
              </p>
              
              <p className="text-lg">
                Nous imaginons un futur où Octogoal Media sera le catalyseur de milliers de projets transformateurs, le point de rencontre des esprits les plus brillants, la source d'inspiration quotidienne pour ceux qui osent voir grand.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section Valeurs */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-violet-400">
                Nos Valeurs Fondamentales
              </span>
            </h2>
            
            <p className="text-lg text-gray-300 text-center max-w-3xl mx-auto mb-16">
              Quatre valeurs fondamentales guident chacune de nos décisions, chacun de nos contenus, chacune de nos interactions avec notre communauté.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8">
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative"
                >
                  <div className={`absolute inset-0 bg-gradient-to-r ${value.gradient} rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-all`} />
                  <div className="relative bg-black border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-all">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 bg-gradient-to-br ${value.gradient} rounded-xl`}>
                        <value.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white mb-4">{value.title}</h3>
                        <p className="text-gray-400 leading-relaxed">
                          {value.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section Approche Éditoriale */}
      <section className="py-20 bg-gradient-to-b from-black via-gray-900/10 to-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
                Comment nous créons la différence
              </span>
            </h2>
            
            <div className="space-y-6 text-gray-300 leading-relaxed">
              <p className="text-lg">
                Notre approche éditoriale repose sur trois piliers : la profondeur d'analyse, la diversité des perspectives et l'applicabilité des insights. Nous ne nous contentons pas de rapporter les faits - nous les contextualisons, les analysons, les connectons pour révéler des patterns et des opportunités.
              </p>
              
              <p className="text-lg">
                Chaque contenu passe par un processus rigoureux de création et de validation. Nous collaborons avec des experts, vérifions nos sources, challengeons nos angles. Nous privilégions les formats longs qui permettent d'explorer véritablement un sujet plutôt que de l'effleurer.
              </p>
              
              <p className="text-lg">
                Nous donnons la parole à ceux qui font, pas seulement à ceux qui parlent. Entrepreneurs en activité, innovateurs sur le terrain, leaders en exercice - nos contributeurs sont sélectionnés pour leur expertise réelle et leur capacité à transmettre des apprentissages concrets.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section Engagement */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-purple-400 to-emerald-400">
                Ce que nous vous promettons
              </span>
            </h2>
            
            <div className="space-y-6">
              {commitments.map((commitment, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex gap-4 p-6 bg-gradient-to-r from-white/5 to-white/10 border border-white/10 rounded-xl hover:border-white/20 transition-all backdrop-blur-sm"
                >
                  <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">{commitment.title}</h3>
                    <p className="text-gray-400 leading-relaxed">{commitment.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section CTA Final */}
      <section className="py-24 relative overflow-hidden">
        {/* Background avec gradients multiples */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/20 to-black" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px]">
            <div className="absolute inset-0 bg-gradient-radial from-blue-500/10 via-purple-500/5 to-transparent blur-3xl" />
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-blue-400 to-purple-400">
              Faites partie de quelque chose de plus grand
            </span>
          </h2>
          
          <p className="text-lg text-gray-300 mb-12 max-w-3xl mx-auto">
            Octogoal Media n'est pas qu'un média - c'est un mouvement. Un mouvement de personnes qui refusent la médiocrité, qui cherchent l'excellence, qui croient au pouvoir de l'action éclairée. Si ces valeurs résonnent avec vous, si cette vision vous inspire, alors votre place est ici, avec nous.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/club"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white rounded-xl font-medium transition-all transform hover:scale-105"
            >
              <Star className="w-5 h-5" />
              Rejoindre le Club Elite
            </Link>
            
            <a
              href="#newsletter"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-black border border-white/20 hover:border-white/30 text-white rounded-xl font-medium transition-all"
            >
              S'inscrire à la Newsletter
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </motion.div>
      </section>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default MissionPage;
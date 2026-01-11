import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Calendar, MapPin, Phone, Facebook, Twitter, Instagram, Youtube, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { NewsletterForm } from '../components/common/NewsletterForm';
import { QuoteBlock } from '../components/common/QuoteBlock';
import { ContactForm } from '../components/common/ContactForm';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

export const AboutPage = () => {
  // Update document title for SEO
  React.useEffect(() => {
    document.title = "À propos de Octogoal | Contact";
  }, []);

  return (
    <div className="relative">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-primary">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(139,92,246,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(6,182,212,0.15),transparent_50%)]" />
        <div className="absolute inset-0 backdrop-blur-[100px]" />
      </div>

      {/* Content */}
      <div className="relative pb-20">
        {/* Hero Section */}
        <motion.header
          initial="initial"
          animate="animate"
          variants={fadeInUp}
          className="container pt-40"
        >
          <nav aria-label="Fil d'ariane" className="mb-6">
            <ol className="flex items-center space-x-2 text-sm text-neutral-400">
              <li>
                <Link to="/" className="hover:text-accent-fuchsia transition-colors">
                  Accueil
                </Link>
              </li>
              <li className="flex items-center space-x-2">
                <span>/</span>
                <span className="text-secondary">À propos</span>
              </li>
            </ol>
          </nav>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-montserrat font-bold leading-tight mb-4">
            À propos de Octogoal
          </h1>
          <p className="text-xl text-tertiary max-w-3xl">
            Un passeur d'histoires, une voix singulière, une vision engagée.
          </p>
        </motion.header>

        {/* Who is Roger Section */}
        <section id="who" className="container py-16">
          <motion.div
            initial="initial"
            animate="animate"
            variants={fadeInUp}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          >
            <div>
              <img
                src="https://yt3.googleusercontent.com/JoLqbdLoPqNLoBUYorqoeyht0KT5uyehGL5ppcCIu5s5PAOeMXi86FoULWWjE2VpJnBKdYPmNj8=s900-c-k-c0x00ffffff-no-rj"
                alt="Octogoal"
                className="w-full h-[600px] object-cover rounded-2xl"
              />
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl font-playfair font-bold">Qui est Roger ?</h2>
              <div className="prose prose-invert prose-lg">
                <p className="font-playfair text-xl leading-relaxed">
                  Entrepreneur passionné et chroniqueur engagé, je parcours depuis plus de 15 ans 
                  les chemins de l'innovation et de l'entrepreneuriat à la recherche des récits 
                  qui façonnent notre époque.
                </p>
                <p className="text-tertiary">
                  Mon parcours m'a mené des salles de rédaction aux plateaux de tournage, 
                  des incubateurs de startups aux conseils d'administration. À chaque étape, 
                  une conviction s'est renforcée : les histoires ont le pouvoir de transformer 
                  le monde.
                </p>
                <p className="text-tertiary">
                  Aujourd'hui, à travers ce média, je souhaite partager ces récits inspirants, 
                  donner la parole à ceux qui osent, et contribuer à façonner un futur plus 
                  audacieux et plus humain.
                </p>
              </div>
              <div className="flex gap-4">
                {[
                  { icon: Facebook, label: 'Facebook' },
                  { icon: Twitter, label: 'Twitter' },
                  { icon: Instagram, label: 'Instagram' },
                  { icon: Youtube, label: 'Youtube' }
                ].map((social, index) => (
                  <motion.a
                    key={index}
                    href="#"
                    whileHover={{ scale: 1.1, y: -2 }}
                    className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center hover:bg-accent-violet/20 hover:text-accent-violet transition-colors"
                    aria-label={social.label}
                  >
                    <social.icon size={20} />
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>
        </section>

        {/* Mission Section */}
        <section id="mission" className="bg-neutral-900/50 backdrop-blur-xl border-y border-white/5 py-16">
          <motion.div
            initial="initial"
            animate="animate"
            variants={fadeInUp}
            className="container"
          >
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl font-playfair font-bold mb-4">Notre mission</h2>
              <p className="text-xl text-tertiary">
                Inspirer, connecter et transformer à travers des récits authentiques.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-neutral-800/50 backdrop-blur-sm border border-white/5 p-8 rounded-2xl">
                <h3 className="text-xl font-bold mb-4">Pour qui ?</h3>
                <p className="text-tertiary">
                  Les entrepreneurs, innovateurs, créateurs et leaders qui cherchent 
                  à avoir un impact positif sur le monde.
                </p>
              </div>
              <div className="bg-neutral-800/50 backdrop-blur-sm border border-white/5 p-8 rounded-2xl">
                <h3 className="text-xl font-bold mb-4">Pourquoi ?</h3>
                <p className="text-tertiary">
                  Parce que chaque histoire inspirante a le pouvoir de déclencher 
                  des vocations et d'encourager l'action.
                </p>
              </div>
              <div className="bg-neutral-800/50 backdrop-blur-sm border border-white/5 p-8 rounded-2xl">
                <h3 className="text-xl font-bold mb-4">Comment ?</h3>
                <p className="text-tertiary">
                  À travers des formats variés et engageants : articles, podcasts, 
                  vidéos et rencontres.
                </p>
              </div>
            </div>

            <div className="mt-12">
              <QuoteBlock
                quote="Le succès n'est pas une destination, c'est un voyage constant d'apprentissage et de dépassement de soi."
              />
            </div>
          </motion.div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="container py-16">
          <motion.div
            initial="initial"
            animate="animate"
            variants={fadeInUp}
            className="max-w-4xl mx-auto"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Une question, une proposition, une idée ?</h2>
              <p className="text-tertiary text-lg">
                Remplissez le formulaire ou contactez-nous directement.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <ContactForm />
              </div>
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-bold mb-4">Informations de contact</h3>
                  <div className="space-y-4">
                    <a href="mailto:contact@octogoal.media" className="flex items-center gap-3 text-tertiary hover:text-accent-fuchsia">
                      <Mail size={20} />
                      <span>contact@octogoal.media</span>
                    </a>
                    <a href="tel:+33600000000" className="flex items-center gap-3 text-tertiary hover:text-accent-fuchsia">
                      <Phone size={20} />
                      <span>+33 6 00 00 00 00</span>
                    </a>
                    <div className="flex items-center gap-3 text-tertiary">
                      <MapPin size={20} />
                      <span>Paris, France</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold mb-4">Prendre rendez-vous</h3>
                  <a
                    href="https://calendly.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-accent-fuchsia hover:text-accent-cyan"
                  >
                    <Calendar size={20} />
                    <span>Réserver un créneau</span>
                    <ArrowRight size={16} />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Newsletter Section */}
        <section className="container">
          <NewsletterForm />
        </section>
      </div>
    </div>
  );
};

export default AboutPage;
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Music, Music2, Youtube } from 'lucide-react';
import { SEO } from '../components/common/SEO';
import { staticSEO } from '../utils/seo.config';
import { PodcastCard } from '../components/common/PodcastCard';
import { QuoteBlock } from '../components/common/QuoteBlock';
import { NewsletterForm } from '../components/common/NewsletterForm';
import { CategoryFilter } from '../components/common/CategoryFilter';

// Mock podcast data
const podcastEpisodes = [
  {
    id: 1,
    title: "L'art de la résilience entrepreneuriale",
    guest: "Marie Dupont",
    duration: "45 min",
    date: "2024-03-15",
    summary: "Une conversation inspirante sur les défis et les succès d'une entrepreneure visionnaire.",
    audioUrl: "#",
    image: "https://images.unsplash.com/photo-1557425493-6f90ae4659fc?auto=format&fit=crop&q=80",
    category: "entrepreneuriat"
  },
  {
    id: 2,
    title: "Innovation et développement durable",
    guest: "Thomas Martin",
    duration: "52 min",
    date: "2024-03-08",
    summary: "Comment concilier croissance et responsabilité environnementale dans le monde des startups.",
    audioUrl: "#",
    image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&q=80",
    category: "innovation"
  },
  {
    id: 3,
    title: "Le mindset des champions",
    guest: "Sarah Cohen",
    duration: "38 min",
    date: "2024-03-01",
    summary: "Les secrets de la réussite et de la performance de haut niveau.",
    audioUrl: "#",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80",
    category: "mindset"
  }
];

const categories = [
  { id: 'all', name: 'Tous les épisodes' },
  { id: 'entrepreneuriat', name: 'Entrepreneuriat' },
  { id: 'innovation', name: 'Innovation' },
  { id: 'mindset', name: 'Mindset' },
  { id: 'culture', name: 'Culture' },
];

export const PodcastPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredEpisodes = podcastEpisodes.filter(episode => {
    const matchesSearch = episode.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         episode.guest.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || episode.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <SEO {...staticSEO.podcasts} />
      <div className="pb-20">
        {/* Header */}
        <motion.header
          initial="initial"
          animate="animate"
          variants={{
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.6 }
          }}
          className="container pt-12 pb-8"
        >
          <h1 className="text-4xl md:text-5xl font-montserrat font-bold leading-tight mb-4">
            Le podcast de Octogoal
          </h1>
          <p className="text-tertiary text-lg max-w-3xl mb-8">
            Des conversations profondes avec des personnalités hors-norme. À écouter partout, à tout moment.
          </p>
          
          {/* Platform Links */}
          <div className="flex gap-4">
            <a
              href="#spotify"
              className="flex items-center gap-2 px-4 py-2 bg-[#1DB954] text-white rounded-full hover:bg-opacity-90 transition-colors"
            >
              <Music size={20} />
              <span>Spotify</span>
            </a>
            <a
              href="#apple"
              className="flex items-center gap-2 px-4 py-2 bg-[#FB5BC5] text-white rounded-full hover:bg-opacity-90 transition-colors"
            >
              <Music2 size={20} />
              <span>Apple Podcasts</span>
            </a>
            <a
              href="#youtube"
              className="flex items-center gap-2 px-4 py-2 bg-[#FF0000] text-white rounded-full hover:bg-opacity-90 transition-colors"
            >
              <Youtube size={20} />
              <span>YouTube</span>
            </a>
          </div>
        </motion.header>

        {/* Search and Filters */}
        <section className="container mb-12">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="w-full md:w-64">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Rechercher un épisode..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2 pl-10 text-secondary placeholder-neutral-500 focus:outline-none focus:border-accent-violet"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500" size={18} />
              </div>
            </div>
            <div className="flex-1">
              <CategoryFilter
                categories={categories}
                selectedCategory={selectedCategory}
                onSelect={setSelectedCategory}
              />
            </div>
          </div>
        </section>

        {/* Episodes List */}
        <motion.section
          initial="initial"
          animate="animate"
          variants={{
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.6 }
          }}
          className="container"
        >
          <div className="space-y-6">
            {filteredEpisodes.map((episode, index) => (
              <motion.div
                key={episode.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <PodcastCard {...episode} />
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Quote Block */}
        <section className="container my-20">
          <motion.div
            initial="initial"
            animate="animate"
            variants={{
              initial: { opacity: 0, y: 20 },
              animate: { opacity: 1, y: 0 },
              transition: { duration: 0.6 }
            }}
          >
            <QuoteBlock
              quote="Le succès n'est pas une destination, c'est un voyage constant d'apprentissage et de dépassement de soi."
              author="Sarah Cohen - Épisode #42"
            />
          </motion.div>
        </section>

        {/* Newsletter */}
        <section className="container">
          <motion.div
            initial="initial"
            animate="animate"
            variants={{
              initial: { opacity: 0, y: 20 },
              animate: { opacity: 1, y: 0 },
              transition: { duration: 0.6 }
            }}
          >
            <NewsletterForm />
          </motion.div>
        </section>
      </div>
    </>
  );
};
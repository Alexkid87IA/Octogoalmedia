import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic2, ChevronDown, X, Play } from 'lucide-react';
import { SEO } from '../components/common/SEO';
import { Footer } from '../components/layout/Footer';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmissionHero, PARTICIPATION_LINK } from '../components/emissions/EmissionHero';
import { LatestEmission } from '../components/emissions/LatestEmission';
import { ShortsCarousel } from '../components/emissions/ShortsCarousel';
import { EmissionCard } from '../components/emissions/EmissionCard';
import {
  getOctogoalEmissions,
  getLatestOctogoalEmission,
  getOctogoalExtraits
} from '../utils/sanityAPI';

// Types
interface Emission {
  _id: string;
  title: string;
  slug?: string;
  episodeNumber?: number;
  youtubeUrl?: string;
  thumbnail?: string;
  duration?: string;
  description?: string;
  publishedAt?: string;
  themes?: string[];
}

interface Extrait {
  _id: string;
  title: string;
  youtubeShortUrl?: string;
  thumbnail?: string;
  duration?: string;
  publishedAt?: string;
  emission?: {
    _id: string;
    title: string;
    episodeNumber?: number;
  };
}

// Données de démo pour les émissions
const mockEmissions: Emission[] = [
  {
    _id: '1',
    title: 'PSG vs OM : Le Classique de tous les dangers',
    episodeNumber: 47,
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnail: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=1200',
    duration: '2h15',
    description: 'Retour sur le match le plus chaud de la saison. Les fans du PSG et de l\'OM s\'affrontent au téléphone !',
    publishedAt: new Date().toISOString(),
    themes: ['PSG', 'OM', 'Ligue 1', 'Classique']
  },
  {
    _id: '2',
    title: 'Mbappé au Real : Faut-il le détester maintenant ?',
    episodeNumber: 46,
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnail: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&q=80&w=1200',
    duration: '1h58',
    description: 'Débat houleux sur le départ de Kylian Mbappé vers le Real Madrid.',
    publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    themes: ['Mbappé', 'Real Madrid', 'Transfert']
  },
  {
    _id: '3',
    title: 'Lyon est-il de retour ? Les fans répondent',
    episodeNumber: 45,
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnail: 'https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&q=80&w=1200',
    duration: '1h42',
    description: 'L\'OL enchaîne les victoires, les supporters lyonnais sont confiants.',
    publishedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    themes: ['OL', 'Lyon', 'Ligue 1']
  },
  {
    _id: '4',
    title: 'Équipe de France : Qui doit partir ?',
    episodeNumber: 44,
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnail: 'https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?auto=format&fit=crop&q=80&w=1200',
    duration: '2h05',
    description: 'Débat sur la composition idéale de l\'équipe de France pour l\'Euro.',
    publishedAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
    themes: ['France', 'Euro', 'Deschamps']
  },
  {
    _id: '5',
    title: 'Monaco champion ? Les fans du PSG en PLS',
    episodeNumber: 43,
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnail: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=1200',
    duration: '1h55',
    description: 'Monaco talonne le PSG au classement, tension maximale.',
    publishedAt: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(),
    themes: ['Monaco', 'PSG', 'Titre']
  },
  {
    _id: '6',
    title: 'Le Ballon d\'Or volé ? Vos théories les plus folles',
    episodeNumber: 42,
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnail: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?auto=format&fit=crop&q=80&w=1200',
    duration: '2h22',
    description: 'Discussion sur les controverses du Ballon d\'Or avec la communauté.',
    publishedAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
    themes: ['Ballon d\'Or', 'Messi', 'Haaland']
  }
];

// Données de démo pour les extraits
const mockExtraits: Extrait[] = [
  {
    _id: 'e1',
    title: 'Fan du PSG vs Fan de l\'OM : ça chauffe !',
    youtubeShortUrl: 'https://youtube.com/shorts/dQw4w9WgXcQ',
    thumbnail: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=600&h=1067',
    duration: '0:58',
    emission: { _id: '1', title: 'PSG vs OM', episodeNumber: 47 }
  },
  {
    _id: 'e2',
    title: 'Momo détruit un fan de Marseille',
    youtubeShortUrl: 'https://youtube.com/shorts/dQw4w9WgXcQ',
    thumbnail: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&q=80&w=600&h=1067',
    duration: '1:12',
    emission: { _id: '1', title: 'PSG vs OM', episodeNumber: 47 }
  },
  {
    _id: 'e3',
    title: 'La rage d\'un supporter lyonnais',
    youtubeShortUrl: 'https://youtube.com/shorts/dQw4w9WgXcQ',
    thumbnail: 'https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&q=80&w=600&h=1067',
    duration: '0:45',
    emission: { _id: '3', title: 'Lyon est de retour', episodeNumber: 45 }
  },
  {
    _id: 'e4',
    title: 'Débat Mbappé : les insultes fusent',
    youtubeShortUrl: 'https://youtube.com/shorts/dQw4w9WgXcQ',
    thumbnail: 'https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?auto=format&fit=crop&q=80&w=600&h=1067',
    duration: '1:05',
    emission: { _id: '2', title: 'Mbappé au Real', episodeNumber: 46 }
  },
  {
    _id: 'e5',
    title: 'Un fan pleure de joie après la victoire',
    youtubeShortUrl: 'https://youtube.com/shorts/dQw4w9WgXcQ',
    thumbnail: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=600&h=1067',
    duration: '0:38',
    emission: { _id: '5', title: 'Monaco champion', episodeNumber: 43 }
  },
  {
    _id: 'e6',
    title: 'Momo raccroche au nez d\'un hater',
    youtubeShortUrl: 'https://youtube.com/shorts/dQw4w9WgXcQ',
    thumbnail: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?auto=format&fit=crop&q=80&w=600&h=1067',
    duration: '0:52',
    emission: { _id: '6', title: 'Ballon d\'Or', episodeNumber: 42 }
  }
];

// Helper pour extraire l'ID YouTube
const getYoutubeId = (url: string): string | null => {
  if (!url) return null;
  const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
  return match ? match[1] : null;
};

export const EmissionsPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [latestEmission, setLatestEmission] = useState<Emission | null>(null);
  const [emissions, setEmissions] = useState<Emission[]>([]);
  const [extraits, setExtraits] = useState<Extrait[]>([]);
  const [page, setPage] = useState(1);
  const [selectedEmission, setSelectedEmission] = useState<Emission | null>(null);
  const emissionsPerPage = 6;

  // Charger les données
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Récupérer les données depuis Sanity
        const [latestData, allEmissionsData, extraitsData] = await Promise.all([
          getLatestOctogoalEmission(),
          getOctogoalEmissions(),
          getOctogoalExtraits()
        ]);

        // Utiliser les données Sanity ou les mocks
        if (latestData) {
          setLatestEmission(latestData);
        } else {
          setLatestEmission(mockEmissions[0]);
        }

        if (allEmissionsData && allEmissionsData.length > 0) {
          setEmissions(allEmissionsData);
        } else {
          setEmissions(mockEmissions);
        }

        if (extraitsData && extraitsData.length > 0) {
          setExtraits(extraitsData);
        } else {
          setExtraits(mockExtraits);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        // Utiliser les données mock en cas d'erreur
        setLatestEmission(mockEmissions[0]);
        setEmissions(mockEmissions);
        setExtraits(mockExtraits);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Paginer les émissions (sans la dernière qui est affichée en haut)
  const archiveEmissions = emissions.slice(1); // Exclure la dernière
  const paginatedEmissions = archiveEmissions.slice(0, page * emissionsPerPage);
  const hasMore = paginatedEmissions.length < archiveEmissions.length;

  // Ouvrir la modal vidéo
  const handlePlayEmission = (emission: Emission) => {
    setSelectedEmission(emission);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <>
      <SEO
        title="L'Émission Octogoal | Débats foot avec Momo"
        description="Rejoins Mohamed Henni et sa communauté pour débattre des matchs, chambrer les adversaires et rigoler ensemble. PSG, OM, OL... personne n'est épargné !"
      />

      <div className="min-h-screen bg-black pt-16">
        {/* Section 1 : Hero */}
        <EmissionHero />

        {/* Section 2 : Dernière émission */}
        <LatestEmission emission={latestEmission} />

        {/* Section 3 : Carousel des extraits/shorts */}
        <ShortsCarousel
          extraits={extraits}
          title="Les meilleurs moments"
          showSeeAll={false}
        />

        {/* Section 4 : Toutes les émissions (archive) */}
        <section className="py-16 bg-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-10"
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                Toutes les émissions
              </h2>
              <p className="text-gray-400">
                {archiveEmissions.length} émissions disponibles
              </p>
            </motion.div>

            {/* Grille des émissions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedEmissions.map((emission, index) => (
                <EmissionCard
                  key={emission._id}
                  emission={emission}
                  index={index}
                  onPlay={handlePlayEmission}
                />
              ))}
            </div>

            {/* Bouton Charger plus */}
            {hasMore && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-center mt-12"
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setPage(prev => prev + 1)}
                  className="flex items-center gap-2 px-8 py-4 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-full transition-colors"
                >
                  <span>Charger plus</span>
                  <ChevronDown className="w-5 h-5" />
                </motion.button>
              </motion.div>
            )}
          </div>
        </section>

        {/* Section 5 : CTA Final */}
        <section className="py-16 bg-gradient-to-b from-black to-gray-950">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative overflow-hidden"
            >
              {/* Formes décoratives */}
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />

              {/* Card */}
              <div className="relative bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-blue-500/20 rounded-3xl p-8 sm:p-12 border border-white/10 backdrop-blur-sm">
                <div className="text-center">
                  {/* Icône */}
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl mb-6 shadow-lg shadow-pink-500/30">
                    <Mic2 className="w-8 h-8 text-white" />
                  </div>

                  {/* Titre */}
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                    Tu veux participer à l'émission ?
                  </h2>

                  {/* Description */}
                  <p className="text-gray-300 text-lg mb-8 max-w-xl mx-auto">
                    Inscris-toi sur la liste d'attente et Momo t'appellera peut-être pour le prochain débat !
                  </p>

                  {/* CTA Button */}
                  <motion.a
                    href={PARTICIPATION_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-pink-500 to-pink-600 text-white text-lg font-bold rounded-full shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50 transition-shadow"
                  >
                    Je veux participer
                  </motion.a>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <Footer />
      </div>

      {/* Modal Video Player */}
      <AnimatePresence>
        {selectedEmission && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedEmission(null)}
              className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-4 sm:inset-10 z-50 flex items-center justify-center"
            >
              <div className="relative w-full max-w-5xl mx-auto">
                {/* Close button */}
                <button
                  onClick={() => setSelectedEmission(null)}
                  className="absolute -top-12 right-0 p-2 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-8 h-8" />
                </button>

                {/* Video container */}
                <div className="relative aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl">
                  {getYoutubeId(selectedEmission.youtubeUrl || '') ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${getYoutubeId(selectedEmission.youtubeUrl || '')}?autoplay=1&rel=0`}
                      title={selectedEmission.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute inset-0 w-full h-full"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <p className="text-gray-400">Vidéo non disponible</p>
                    </div>
                  )}
                </div>

                {/* Title */}
                <div className="mt-4 text-center">
                  <h3 className="text-xl font-bold text-white">{selectedEmission.title}</h3>
                  {selectedEmission.episodeNumber && (
                    <p className="text-gray-400 mt-1">Épisode #{selectedEmission.episodeNumber}</p>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default EmissionsPage;

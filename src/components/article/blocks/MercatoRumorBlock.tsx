// src/components/article/blocks/MercatoRumorBlock.tsx
// Carte rumeur mercato avec fiabilité et timeline

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, ChevronDown, ChevronUp, TrendingUp } from 'lucide-react';
import { urlFor } from '../../../utils/sanityClient';

interface MercatoRumorProps {
  value: {
    playerName?: string;
    playerPhoto?: any;
    playerPhotoUrl?: string;
    currentClubName?: string;
    interestedClubs: InterestedClub[];
    transferType: 'permanent' | 'loan' | 'loan_option' | 'free' | 'loan_return';
    estimatedFee?: number;
    salary?: number;
    contractLength?: string;
    status: 'rumor' | 'confirmed_interest' | 'negotiating' | 'clubs_agreed' | 'medical' | 'official' | 'failed';
    reliability: number;
    source?: string;
    sourceUrl?: string;
    lastUpdate?: string;
    notes?: string;
    showTimeline: boolean;
    timeline?: TimelineEvent[];
  };
}

interface InterestedClub {
  _key: string;
  clubName?: string;
  interestLevel: 'hot' | 'interested' | 'monitoring';
}

interface TimelineEvent {
  _key: string;
  date: string;
  event: string;
  source?: string;
}

const STATUS_CONFIG = {
  rumor: { icon: '💭', label: 'Rumeur', color: 'text-gray-400', bg: 'bg-gray-500/20' },
  confirmed_interest: { icon: '🎯', label: 'Intérêt confirmé', color: 'text-blue-400', bg: 'bg-blue-500/20' },
  negotiating: { icon: '🤝', label: 'En négociation', color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
  clubs_agreed: { icon: '📋', label: 'Accord entre clubs', color: 'text-orange-400', bg: 'bg-orange-500/20' },
  medical: { icon: '🏥', label: 'Visite médicale', color: 'text-purple-400', bg: 'bg-purple-500/20' },
  official: { icon: '✅', label: 'Officiel', color: 'text-green-400', bg: 'bg-green-500/20' },
  failed: { icon: '❌', label: 'Échec', color: 'text-red-400', bg: 'bg-red-500/20' },
};

const INTEREST_CONFIG = {
  hot: { icon: '🔥', label: 'Très chaud', color: 'text-red-400' },
  interested: { icon: '🟡', label: 'Intéressé', color: 'text-yellow-400' },
  monitoring: { icon: '👀', label: 'Surveille', color: 'text-blue-400' },
};

const TRANSFER_LABELS = {
  permanent: 'Transfert définitif',
  loan: 'Prêt',
  loan_option: 'Prêt avec option',
  free: 'Libre',
  loan_return: 'Retour de prêt',
};

const MercatoRumorBlock: React.FC<MercatoRumorProps> = ({ value }) => {
  const {
    playerName,
    playerPhoto,
    playerPhotoUrl,
    currentClubName,
    interestedClubs,
    transferType,
    estimatedFee,
    salary,
    contractLength,
    status,
    reliability,
    source,
    sourceUrl,
    lastUpdate,
    notes,
    showTimeline,
    timeline,
  } = value;

  const [showTimelineSection, setShowTimelineSection] = useState(false);

  const statusConfig = STATUS_CONFIG[status] || STATUS_CONFIG.rumor;
  const photoUrl = playerPhoto ? urlFor(playerPhoto).width(200).url() : playerPhotoUrl;

  const getReliabilityColor = (rel: number) => {
    if (rel >= 80) return '#22c55e';
    if (rel >= 50) return '#f59e0b';
    return '#ef4444';
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="my-10 md:my-14">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
        {/* Header avec statut */}
        <div className={`px-4 py-2 flex items-center justify-between ${statusConfig.bg}`}>
          <div className={`flex items-center gap-2 ${statusConfig.color}`}>
            <span className="text-lg">{statusConfig.icon}</span>
            <span className="font-semibold text-sm">{statusConfig.label}</span>
          </div>
          <span className="text-xs text-gray-400">{TRANSFER_LABELS[transferType]}</span>
        </div>

        <div className="p-5 md:p-6">
          {/* Player info */}
          <div className="flex items-start gap-4 mb-6">
            {/* Photo */}
            {photoUrl ? (
              <img
                src={photoUrl}
                alt={playerName || 'Joueur'}
                className="w-20 h-20 md:w-24 md:h-24 rounded-xl object-cover bg-gray-800"
              />
            ) : (
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl bg-gray-800 flex items-center justify-center text-3xl">
                ⚽
              </div>
            )}

            <div className="flex-1">
              <h3 className="text-xl md:text-2xl font-bold text-white mb-1">{playerName || 'Joueur inconnu'}</h3>
              {currentClubName && (
                <p className="text-gray-400 text-sm mb-3">Actuellement à {currentClubName}</p>
              )}

              {/* Fiabilité */}
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-500 uppercase tracking-wider">Fiabilité</span>
                <div className="flex-1 max-w-[150px] h-2 bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${reliability}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: getReliabilityColor(reliability) }}
                  />
                </div>
                <span
                  className="text-sm font-bold"
                  style={{ color: getReliabilityColor(reliability) }}
                >
                  {reliability}%
                </span>
              </div>
            </div>
          </div>

          {/* Clubs intéressés */}
          {interestedClubs && interestedClubs.length > 0 && (
            <div className="mb-6">
              <h4 className="text-xs text-gray-500 uppercase tracking-wider mb-3">Clubs intéressés</h4>
              <div className="flex flex-wrap gap-2">
                {interestedClubs.map((club) => {
                  const interestConfig = INTEREST_CONFIG[club.interestLevel] || INTEREST_CONFIG.monitoring;
                  return (
                    <div
                      key={club._key}
                      className="flex items-center gap-2 px-3 py-2 bg-gray-800 rounded-lg"
                    >
                      <span>{interestConfig.icon}</span>
                      <span className="text-white font-medium text-sm">{club.clubName}</span>
                      <span className={`text-xs ${interestConfig.color}`}>({interestConfig.label})</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Infos financières */}
          {(estimatedFee || salary || contractLength) && (
            <div className="grid grid-cols-3 gap-4 mb-6">
              {estimatedFee && (
                <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                  <div className="text-2xl font-black text-green-400">{estimatedFee}M€</div>
                  <div className="text-xs text-gray-500 uppercase">Estimation</div>
                </div>
              )}
              {salary && (
                <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                  <div className="text-2xl font-black text-blue-400">{salary}M€</div>
                  <div className="text-xs text-gray-500 uppercase">Salaire/an</div>
                </div>
              )}
              {contractLength && (
                <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                  <div className="text-2xl font-black text-purple-400">{contractLength}</div>
                  <div className="text-xs text-gray-500 uppercase">Contrat</div>
                </div>
              )}
            </div>
          )}

          {/* Notes */}
          {notes && (
            <div className="mb-6 p-4 bg-gray-800/30 rounded-lg border-l-4 border-pink-500">
              <p className="text-gray-300 text-sm italic">{notes}</p>
            </div>
          )}

          {/* Timeline toggle */}
          {showTimeline && timeline && timeline.length > 0 && (
            <div className="border-t border-gray-700 pt-4">
              <button
                onClick={() => setShowTimelineSection(!showTimelineSection)}
                className="flex items-center justify-between w-full text-left"
              >
                <span className="text-sm font-medium text-gray-400">Timeline du transfert</span>
                {showTimelineSection ? (
                  <ChevronUp size={18} className="text-gray-500" />
                ) : (
                  <ChevronDown size={18} className="text-gray-500" />
                )}
              </button>

              <AnimatePresence>
                {showTimelineSection && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-4 space-y-3">
                      {timeline.map((event, index) => (
                        <div key={event._key} className="flex gap-3">
                          <div className="flex flex-col items-center">
                            <div className="w-2 h-2 bg-pink-500 rounded-full" />
                            {index < timeline.length - 1 && (
                              <div className="w-0.5 flex-1 bg-gray-700 mt-1" />
                            )}
                          </div>
                          <div className="flex-1 pb-3">
                            <div className="text-xs text-gray-500 mb-1">{formatDate(event.date)}</div>
                            <div className="text-sm text-gray-300">{event.event}</div>
                            {event.source && (
                              <div className="text-xs text-gray-600 mt-1">Source: {event.source}</div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Source & date */}
          <div className="flex items-center justify-between text-xs text-gray-500 mt-4 pt-4 border-t border-gray-800">
            {source && (
              <div className="flex items-center gap-1">
                Source:
                {sourceUrl ? (
                  <a
                    href={sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-pink-400 hover:underline flex items-center gap-1"
                  >
                    {source}
                    <ExternalLink size={12} />
                  </a>
                ) : (
                  <span>{source}</span>
                )}
              </div>
            )}
            {lastUpdate && (
              <div>Mis à jour: {formatDate(lastUpdate)}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MercatoRumorBlock;

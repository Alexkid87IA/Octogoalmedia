// src/components/football/CalendarWidget.tsx
// Calendrier interactif pour la navigation des matchs

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, X } from 'lucide-react';

interface CalendarWidgetProps {
  selectedDate: string; // format YYYY-MM-DD
  onDateSelect: (date: string) => void;
  matchDays?: Set<string>; // jours avec des matchs
  liveDays?: Set<string>; // jours avec matchs live
}

// Helpers
function getDateString(date: Date): string {
  return date.toISOString().split('T')[0];
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  // 0 = dimanche, on veut lundi = 0
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1;
}

const MONTHS_FR = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
];

const DAYS_FR = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

export const CalendarWidget: React.FC<CalendarWidgetProps> = ({
  selectedDate,
  onDateSelect,
  matchDays = new Set(),
  liveDays = new Set(),
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const today = new Date();
  const todayStr = getDateString(today);

  // État pour le mois affiché
  const selectedDateObj = new Date(selectedDate);
  const [viewMonth, setViewMonth] = useState(selectedDateObj.getMonth());
  const [viewYear, setViewYear] = useState(selectedDateObj.getFullYear());

  const handlePrevMonth = useCallback(() => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  }, [viewMonth, viewYear]);

  const handleNextMonth = useCallback(() => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  }, [viewMonth, viewYear]);

  const handleDateClick = useCallback((dateStr: string) => {
    onDateSelect(dateStr);
    setIsOpen(false);
  }, [onDateSelect]);

  const handleGoToToday = useCallback(() => {
    setViewMonth(today.getMonth());
    setViewYear(today.getFullYear());
    onDateSelect(todayStr);
    setIsOpen(false);
  }, [today, todayStr, onDateSelect]);

  // Générer les jours du mois
  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);
  const days: (number | null)[] = [];

  // Jours vides avant le 1er du mois
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  // Jours du mois
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  // Format date complète
  const formatDisplayDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });
  };

  return (
    <div className="relative">
      {/* Bouton pour ouvrir le calendrier */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 hover:bg-gray-800 border border-gray-700 rounded-xl text-gray-300 hover:text-white transition-all"
      >
        <CalendarIcon className="w-4 h-4" />
        <span className="text-sm font-medium capitalize">
          {formatDisplayDate(selectedDate)}
        </span>
      </button>

      {/* Calendrier popup */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />

            {/* Calendrier */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="absolute top-full mt-2 left-0 z-50 w-80 bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800 bg-gradient-to-r from-pink-500/10 to-violet-500/10">
                <button
                  onClick={handlePrevMonth}
                  className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-400" />
                </button>

                <h3 className="text-white font-semibold">
                  {MONTHS_FR[viewMonth]} {viewYear}
                </h3>

                <button
                  onClick={handleNextMonth}
                  className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {/* Jours de la semaine */}
              <div className="grid grid-cols-7 gap-1 px-2 py-2 border-b border-gray-800">
                {DAYS_FR.map(day => (
                  <div
                    key={day}
                    className="text-center text-xs font-medium text-gray-500 py-1"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Grille des jours */}
              <div className="grid grid-cols-7 gap-1 p-2">
                {days.map((day, index) => {
                  if (day === null) {
                    return <div key={`empty-${index}`} className="aspect-square" />;
                  }

                  const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                  const isToday = dateStr === todayStr;
                  const isSelected = dateStr === selectedDate;
                  const hasMatches = matchDays.has(dateStr);
                  const hasLive = liveDays.has(dateStr);
                  const isPast = new Date(dateStr) < new Date(todayStr);

                  return (
                    <button
                      key={dateStr}
                      onClick={() => handleDateClick(dateStr)}
                      className={`
                        relative aspect-square flex flex-col items-center justify-center rounded-lg text-sm font-medium transition-all
                        ${isSelected
                          ? 'bg-gradient-to-br from-pink-500 to-violet-500 text-white shadow-lg shadow-pink-500/25'
                          : isToday
                            ? 'bg-pink-500/20 text-pink-400 ring-1 ring-pink-500/50'
                            : hasMatches
                              ? isPast
                                ? 'bg-violet-500/10 text-violet-400 hover:bg-violet-500/20'
                                : 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
                              : isPast
                                ? 'text-gray-600 hover:bg-gray-800'
                                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                        }
                      `}
                    >
                      <span>{day}</span>

                      {/* Indicateur matchs */}
                      {hasMatches && !isSelected && (
                        <span className={`absolute bottom-1 w-1 h-1 rounded-full ${
                          hasLive ? 'bg-red-500 animate-pulse' : isPast ? 'bg-violet-500' : 'bg-green-500'
                        }`} />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Footer avec légende et bouton Aujourd'hui */}
              <div className="px-4 py-3 border-t border-gray-800 space-y-3">
                {/* Légende */}
                <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-green-500" />
                    <span>Matchs à venir</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-violet-500" />
                    <span>Résultats</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <span>Live</span>
                  </div>
                </div>

                {/* Bouton Aujourd'hui */}
                <button
                  onClick={handleGoToToday}
                  className="w-full py-2 bg-pink-500/10 hover:bg-pink-500/20 text-pink-400 rounded-lg text-sm font-medium transition-colors"
                >
                  Aller à aujourd'hui
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CalendarWidget;

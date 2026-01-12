// src/components/article/ui/TableOfContents.tsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, ChevronDown, Eye } from "lucide-react";
import { TableOfContentsHeading, VerticalColors } from "../../../types/article.types";

interface TableOfContentsProps {
  headings: TableOfContentsHeading[] | null;
  activeSection: string;
  scrollProgress: number;
  colors: VerticalColors;
  variant?: 'desktop' | 'mobile';
  mobileMenuOpen?: boolean;
  setMobileMenuOpen?: (open: boolean) => void;
}

const TableOfContents: React.FC<TableOfContentsProps> = ({
  headings,
  activeSection,
  scrollProgress,
  colors,
  variant = 'desktop',
  mobileMenuOpen = false,
  setMobileMenuOpen
}) => {
  const [expandedSections, setExpandedSections] = useState<{[key: string]: boolean}>({});
  const [isCollapsed, setIsCollapsed] = useState(true); // Réduit par défaut

  if (!headings || headings.length === 0) return null;

  const handleSectionClick = (sectionId: string) => {
    if (variant === 'mobile' && setMobileMenuOpen) {
      setMobileMenuOpen(false);
    }
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Version mobile
  if (variant === 'mobile') {
    return (
      <div className="lg:hidden container mx-auto px-4 py-8">
        <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-md rounded-2xl border border-gray-700/50 overflow-hidden">
          {/* Header avec toggle */}
          <button
            onClick={() => setMobileMenuOpen && setMobileMenuOpen(!mobileMenuOpen)}
            className="w-full p-5 border-b flex items-center justify-between"
            style={{ borderColor: colors.borderColor + '30' }}
          >
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: colors.bgGradient }}
              >
                <BookOpen size={18} className="text-white" />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-semibold text-white">
                  Table des matières
                </h3>
                <p className="text-xs text-gray-500">
                  {headings.length} chapitres
                </p>
              </div>
            </div>
            <ChevronDown 
              size={20} 
              className={`text-gray-400 transition-transform ${mobileMenuOpen ? 'rotate-180' : ''}`}
            />
          </button>
          
          {/* Contenu repliable */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.nav
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="p-4 max-h-[400px] overflow-y-auto overflow-x-hidden custom-scrollbar"
              >
                <div className="space-y-2 max-w-full">
                  {headings.map((section, sectionIndex) => {
                    const isActive = activeSection === section.id;
                    const hasSubheadings = section.subheadings.length > 0;
                    const isExpanded = expandedSections[section.id];
                    
                    return (
                      <div key={section.id}>
                        {/* Section H2 */}
                        <div className="flex items-center gap-2">
                          <a
                            href={`#${section.id}`}
                            onClick={(e) => {
                              e.preventDefault();
                              handleSectionClick(section.id);
                            }}
                            className={`flex-1 flex items-center gap-3 py-3 px-3 rounded-xl transition-all ${
                              isActive ? 'bg-white/10' : 'hover:bg-white/5'
                            }`}
                            style={{
                              borderLeft: isActive ? `3px solid ${colors.primary}` : '3px solid transparent'
                            }}
                          >
                            <div 
                              className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
                              style={{
                                background: isActive ? colors.primary : colors.bgLight,
                                color: isActive ? '#000' : colors.textColor
                              }}
                            >
                              {sectionIndex + 1}
                            </div>
                            <span className={`text-sm ${isActive ? 'text-white font-medium' : 'text-gray-300'} break-words line-clamp-2`}>
                              {section.text}
                            </span>
                          </a>
                          
                          {/* Bouton toggle SÉPARÉ du lien */}
                          {hasSubheadings && (
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setExpandedSections(prev => ({
                                  ...prev,
                                  [section.id]: !prev[section.id]
                                }));
                              }}
                              className="p-2 rounded-lg hover:bg-white/10 transition-all"
                            >
                              <ChevronDown 
                                size={16} 
                                className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                                style={{ color: colors.textColor }}
                              />
                            </button>
                          )}
                        </div>
                        
                        {/* Sous-sections H3 */}
                        {hasSubheadings && isExpanded && (
                          <div className="ml-8 mt-1 space-y-1">
                            {section.subheadings.map((sub) => (
                              <a
                                key={sub.id}
                                href={`#${sub.id}`}
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleSectionClick(sub.id);
                                }}
                                className="flex items-center gap-2 py-2 px-3 rounded-lg text-sm hover:bg-white/5"
                                style={{
                                  color: activeSection === sub.id ? colors.textColor : '#9ca3af'
                                }}
                              >
                                <div 
                                  className="w-1.5 h-1.5 rounded-full"
                                  style={{
                                    background: activeSection === sub.id ? colors.primary : '#4b5563'
                                  }}
                                />
                                {sub.text}
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </motion.nav>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  // Version desktop
  return (
    <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-md rounded-2xl border border-gray-700/50 overflow-hidden">
      {/* Header cliquable pour ouvrir/fermer */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="w-full p-5 flex items-center justify-between hover:bg-white/5 transition-colors"
        style={{ borderBottom: isCollapsed ? 'none' : `1px solid ${colors.borderColor}30` }}
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: colors.bgGradient }}
            >
              <BookOpen size={18} className="text-white" />
            </div>
            {!isCollapsed && (
              <div
                className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-white/20 animate-pulse"
                style={{ background: colors.primary + '40' }}
              />
            )}
          </div>
          <div className="text-left">
            <h3 className="text-lg font-semibold text-white">
              Table des matières
            </h3>
            <p className="text-xs text-gray-500">
              {headings.length} chapitres
            </p>
          </div>
        </div>
        <ChevronDown
          size={20}
          className={`text-gray-400 transition-transform duration-300 ${!isCollapsed ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Contenu repliable */}
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
      <nav className="p-4 max-h-[600px] overflow-y-auto custom-scrollbar">
        <div className="space-y-2">
          {headings.map((section, sectionIndex) => {
            const isActive = activeSection === section.id;
            const hasSubheadings = section.subheadings.length > 0;
            const isExpanded = expandedSections[section.id];
            const hasActiveChild = section.subheadings.some((sub) => activeSection === sub.id);
            
            return (
              <div key={section.id} className="group">
                {/* Section principale H2 */}
                <div className="relative flex items-center gap-2">
                  <a
                    href={`#${section.id}`}
                    className={`
                      flex-1 flex items-center gap-3 py-3 px-4 rounded-xl
                      transition-all duration-300 relative overflow-hidden
                      ${isActive ? 'bg-gradient-to-r' : 'hover:bg-white/5'}
                    `}
                    style={{
                      background: isActive 
                        ? `linear-gradient(90deg, ${colors.bgLight}, transparent)` 
                        : hasActiveChild 
                        ? colors.bgLight + '50'
                        : undefined,
                      borderLeft: isActive ? `3px solid ${colors.primary}` : '3px solid transparent'
                    }}
                  >
                    {/* Indicateur numéroté */}
                    <div 
                      className={`
                        w-7 h-7 rounded-lg flex items-center justify-center
                        text-xs font-bold transition-all duration-300
                        ${isActive ? 'scale-110' : ''}
                      `}
                      style={{
                        background: isActive ? colors.primary : colors.bgLight,
                        color: isActive ? '#000' : colors.textColor
                      }}
                    >
                      {sectionIndex + 1}
                    </div>
                    
                    {/* Texte de la section */}
                    <span 
                      className={`
                        flex-1 font-medium transition-colors duration-300
                        ${isActive ? 'text-white' : 'text-gray-300 group-hover:text-white'}
                      `}
                    >
                      {section.text}
                    </span>
                    
                    {/* Badge de lecture si actif */}
                    {isActive && (
                      <div className="flex items-center gap-1 text-xs">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-green-500">En cours</span>
                      </div>
                    )}
                  </a>
                  
                  {/* Bouton toggle SÉPARÉ - En dehors du lien */}
                  {hasSubheadings && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setExpandedSections(prev => ({
                          ...prev,
                          [section.id]: !prev[section.id]
                        }));
                      }}
                      className="p-1.5 rounded-lg transition-all duration-300 hover:bg-white/10"
                      style={{ color: colors.textColor }}
                    >
                      <div className="relative">
                        <ChevronDown 
                          size={16} 
                          className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                        />
                        {!isExpanded && section.subheadings.length > 0 && (
                          <div 
                            className="absolute -top-1 -right-1 w-2 h-2 rounded-full"
                            style={{ background: colors.primary + '60' }}
                          />
                        )}
                      </div>
                    </button>
                  )}
                </div>
                
                {/* Sous-sections H3 repliables */}
                <AnimatePresence>
                  {hasSubheadings && isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="ml-8 mt-1 space-y-1 border-l-2 border-gray-700/50 pl-4">
                        {section.subheadings.map((sub) => {
                          const isSubActive = activeSection === sub.id;
                          return (
                            <a
                              key={sub.id}
                              href={`#${sub.id}`}
                              className={`
                                flex items-center gap-2 py-2 px-3 rounded-lg
                                text-sm transition-all duration-200
                                ${isSubActive ? 'bg-white/10' : 'hover:bg-white/5'}
                              `}
                              style={{
                                color: isSubActive ? colors.textColor : '#9ca3af'
                              }}
                            >
                              <div 
                                className="w-1.5 h-1.5 rounded-full"
                                style={{
                                  background: isSubActive ? colors.primary : '#4b5563'
                                }}
                              />
                              <span className="line-clamp-1">
                                {sub.text}
                              </span>
                              {isSubActive && (
                                <Eye size={12} className="ml-auto" style={{ color: colors.primary }} />
                              )}
                            </a>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </nav>

            {/* Footer avec progression */}
            <div
              className="p-4 border-t"
              style={{ borderColor: colors.borderColor + '30' }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-500">Progression de lecture</span>
                <span className="text-xs font-medium" style={{ color: colors.textColor }}>
                  {Math.round(scrollProgress)}%
                </span>
              </div>
              <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    background: colors.bgGradient,
                    width: `${scrollProgress}%`
                  }}
                  transition={{ duration: 0.1 }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TableOfContents;
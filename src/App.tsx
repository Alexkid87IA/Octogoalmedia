// src/App.tsx
import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ResponsiveNavbar } from './components/layout/ResponsiveNavbar';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Analytics } from './components/common/Analytics';
import { DataProvider } from './context/DataContext';

// Import du background skin
import momoSkinBg from './assets/backgrounds/momo-henni-skin.jpg';

// Code Splitting - Lazy loading des pages
const HomePage = lazy(() => import('./pages/HomePage').then(m => ({ default: m.HomePage })));
const ArticlePageNEW = lazy(() => import('./pages/ArticlePageNEW'));
const CategoryPage = lazy(() => import('./pages/CategoryPage').then(m => ({ default: m.CategoryPage })));
const SubcategoryPage = lazy(() => import('./pages/SubcategoryPage').then(m => ({ default: m.SubcategoryPage })));
const PodcastPage = lazy(() => import('./pages/PodcastPage').then(m => ({ default: m.PodcastPage })));
const EmissionsPage = lazy(() => import('./pages/EmissionsPage'));
const EmissionPage = lazy(() => import('./pages/EmissionPage').then(m => ({ default: m.EmissionPage })));
const AboutPage = lazy(() => import('./pages/AboutPage').then(m => ({ default: m.AboutPage })));
const AllArticlesPage = lazy(() => import('./pages/AllArticlesPage').then(m => ({ default: m.AllArticlesPage })));
const MissionPage = lazy(() => import('./pages/MissionPage').then(m => ({ default: m.MissionPage })));
const NotFound = lazy(() => import('./pages/NotFound').then(m => ({ default: m.NotFound })));
const StandingsPage = lazy(() => import('./pages/StandingsPage'));
const FootballClubPage = lazy(() => import('./pages/FootballClubPage'));
const MatchsPage = lazy(() => import('./pages/MatchsPage'));
const MatchDetailPage = lazy(() => import('./pages/MatchDetailPage'));
const MatchdayPage = lazy(() => import('./pages/MatchdayPage'));
const TopScorersPage = lazy(() => import('./pages/TopScorersPage'));
const ClubsPage = lazy(() => import('./pages/ClubsPage'));
const PlayerPage = lazy(() => import('./pages/PlayerPage'));
const EuropeanRankingsPage = lazy(() => import('./pages/EuropeanRankingsPage'));
const JoueursPage = lazy(() => import('./pages/JoueursPage'));
const FormatsPage = lazy(() => import('./pages/FormatsPage'));
const BettingPage = lazy(() => import('./pages/BettingPage'));
const SearchPage = lazy(() => import('./pages/SearchPage'));

// Composant de chargement optimisé
const PageLoader = () => (
  <div className="min-h-screen bg-black flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />
      <span className="text-white/60 text-sm">Chargement...</span>
    </div>
  </div>
);

// Composant principal avec gestion du skin
const AppContent = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <ErrorBoundary>
      {/* Site Skin Background - Uniquement sur la homepage */}
      {isHomePage && (
        <>
          <div
            className="site-skin"
            style={{ backgroundImage: `url(${momoSkinBg})` }}
          />
          {/* Zones cliquables pour le skin (pub) */}
          <a
            href="https://discord.gg/octogoal"
            target="_blank"
            rel="noopener noreferrer"
            className="site-skin-clickable top"
            aria-label="Publicité - header"
          />
          <a
            href="https://discord.gg/octogoal"
            target="_blank"
            rel="noopener noreferrer"
            className="site-skin-clickable left"
            aria-label="Publicité Momo Henni - gauche"
          />
          <a
            href="https://discord.gg/octogoal"
            target="_blank"
            rel="noopener noreferrer"
            className="site-skin-clickable right"
            aria-label="Publicité Momo Henni - droite"
          />
        </>
      )}

      {/* Contenu principal du site */}
      <div className={isHomePage ? "site-content-wrapper" : ""}>
        <div className="relative min-h-screen bg-black overflow-x-hidden">
          {/* Skip navigation pour accessibilité */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-white focus:text-black focus:rounded-lg focus:font-medium"
          >
            Aller au contenu principal
          </a>
          <ResponsiveNavbar />
          <main id="main-content" className="relative z-[1]">
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* Pages principales */}
                <Route path="/" element={<HomePage />} />
                <Route path="/articles" element={<AllArticlesPage />} />
                <Route path="/article/:slug" element={<ArticlePageNEW />} />
                <Route path="/emission/:slug" element={<EmissionPage />} />
                <Route path="/rubrique/:categorySlug" element={<CategoryPage />} />
                <Route path="/rubrique/:categorySlug/:subcategorySlug" element={<SubcategoryPage />} />
                <Route path="/podcasts" element={<PodcastPage />} />
                <Route path="/emissions" element={<EmissionsPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/mission" element={<MissionPage />} />

                {/* Route Classements - Tableaux, buteurs, passeurs */}
                <Route path="/classements" element={<StandingsPage />} />
                <Route path="/classements/europe" element={<EuropeanRankingsPage />} />
                <Route path="/classements/club/:teamId" element={<FootballClubPage />} />
                <Route path="/classements/matchday/:leagueId" element={<MatchdayPage />} />
                <Route path="/classements/scorers/:leagueId" element={<TopScorersPage />} />

                {/* Redirections pour compatibilité */}
                <Route path="/football" element={<Navigate to="/classements" replace />} />
                <Route path="/football/*" element={<Navigate to="/classements" replace />} />

                {/* Redirection /rubrique/joueurs vers la vraie page Joueurs */}
                <Route path="/rubrique/joueurs" element={<Navigate to="/joueurs" replace />} />
                <Route path="/rubrique/joueurs/*" element={<Navigate to="/joueurs" replace />} />

                {/* Route Matchs - Match Center Live */}
                <Route path="/matchs" element={<MatchsPage />} />
                <Route path="/match/:id" element={<MatchDetailPage />} />

                {/* Route Paris / Cotes Winamax */}
                <Route path="/actus/paris" element={<BettingPage />} />
                <Route path="/paris" element={<BettingPage />} />

                {/* Route Clubs - Club Universe */}
                <Route path="/clubs" element={<ClubsPage />} />

                {/* Route Joueur - Fiche joueur */}
                <Route path="/player/:id" element={<PlayerPage />} />

                {/* Route Joueurs - Hub principal */}
                <Route path="/joueurs" element={<JoueursPage />} />

                {/* Route Formats Octogoal - Hub principal */}
                <Route path="/formats" element={<FormatsPage />} />
                <Route path="/rubrique/formats-octogoal" element={<FormatsPage />} />

                {/* Redirections anciennes pages vers accueil */}
                <Route path="/coaching" element={<Navigate to="/" replace />} />
                <Route path="/club" element={<Navigate to="/" replace />} />
                <Route path="/create-with-roger" element={<Navigate to="/" replace />} />
                <Route path="/success-stories" element={<Navigate to="/" replace />} />
                <Route path="/business-ideas" element={<Navigate to="/" replace />} />
                <Route path="/guides" element={<Navigate to="/" replace />} />
                <Route path="/guides/*" element={<Navigate to="/" replace />} />

                {/* Route Recherche */}
                <Route path="/recherche" element={<SearchPage />} />

                {/* Route 404 - DOIT ÊTRE EN DERNIER */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </main>
          <Analytics />
        </div>
      </div>
    </ErrorBoundary>
  );
};

function App() {
  return (
    <HelmetProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <DataProvider>
          <AppContent />
        </DataProvider>
      </Router>
    </HelmetProvider>
  );
}

export default App;

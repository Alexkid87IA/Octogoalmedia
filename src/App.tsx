// src/App.tsx
import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ResponsiveNavbar } from './components/layout/ResponsiveNavbar';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Analytics } from './components/common/Analytics';
import { DataProvider } from './context/DataContext';

// Code Splitting - Lazy loading des pages
const HomePage = lazy(() => import('./pages/HomePage').then(m => ({ default: m.HomePage })));
const ArticlePageNEW = lazy(() => import('./pages/ArticlePageNEW'));
const CategoryPage = lazy(() => import('./pages/CategoryPage').then(m => ({ default: m.CategoryPage })));
const SubcategoryPage = lazy(() => import('./pages/SubcategoryPage').then(m => ({ default: m.SubcategoryPage })));
const PodcastPage = lazy(() => import('./pages/PodcastPage').then(m => ({ default: m.PodcastPage })));
const EmissionsPage = lazy(() => import('./pages/EmissionsPage'));
const EmissionPage = lazy(() => import('./pages/EmissionPage').then(m => ({ default: m.EmissionPage })));
const CreateWithRogerPage = lazy(() => import('./pages/CreateWithRogerPage').then(m => ({ default: m.CreateWithRogerPage })));
const AboutPage = lazy(() => import('./pages/AboutPage').then(m => ({ default: m.AboutPage })));
const AllArticlesPage = lazy(() => import('./pages/AllArticlesPage').then(m => ({ default: m.AllArticlesPage })));
const CoachingPage = lazy(() => import('./pages/CoachingPage').then(m => ({ default: m.CoachingPage })));
const ClubPage = lazy(() => import('./pages/ClubPage').then(m => ({ default: m.ClubPage })));
const MissionPage = lazy(() => import('./pages/MissionPage').then(m => ({ default: m.MissionPage })));
const NotFound = lazy(() => import('./pages/NotFound').then(m => ({ default: m.NotFound })));
const SuccessStoriesPage = lazy(() => import('./pages/SuccessStoriesPage'));
const BusinessIdeasPage = lazy(() => import('./pages/BusinessIdeasPage'));
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

// Composant de chargement optimisé
const PageLoader = () => (
  <div className="min-h-screen bg-black flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />
      <span className="text-white/60 text-sm">Chargement...</span>
    </div>
  </div>
);

// Page de test simple
const TestPage = () => (
  <div className="min-h-screen bg-black text-white flex items-center justify-center">
    <h1 className="text-4xl">Page de Test</h1>
  </div>
);

function App() {
  return (
    <HelmetProvider>
      <Router>
        <DataProvider>
          <ErrorBoundary>
            <div className="relative min-h-screen bg-black overflow-x-hidden">
              <ResponsiveNavbar />
              <main className="relative z-[1]">
                <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/articles" element={<AllArticlesPage />} />
                  <Route path="/article/:slug" element={<ArticlePageNEW />} />
                  <Route path="/emission/:slug" element={<EmissionPage />} />
                  <Route path="/rubrique/:categorySlug" element={<CategoryPage />} />
                  <Route path="/rubrique/:categorySlug/:subcategorySlug" element={<SubcategoryPage />} />
                  <Route path="/podcasts" element={<PodcastPage />} />
                  <Route path="/emissions" element={<EmissionsPage />} />
                  <Route path="/club" element={<ClubPage />} />
                  <Route path="/create-with-roger" element={<CreateWithRogerPage />} />
                  <Route path="/coaching" element={<CoachingPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/mission" element={<MissionPage />} />
                  
                  {/* Nouvelles routes */}
                  <Route path="/success-stories" element={<SuccessStoriesPage />} />
                  <Route path="/business-ideas" element={<BusinessIdeasPage />} />

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

                  {/* Route Clubs - Club Universe */}
                  <Route path="/clubs" element={<ClubsPage />} />

                  {/* Route Joueur - Fiche joueur */}
                  <Route path="/player/:id" element={<PlayerPage />} />

                  {/* Route Joueurs - Hub principal */}
                  <Route path="/joueurs" element={<JoueursPage />} />

                  {/* Route Formats Octogoal - Hub principal */}
                  <Route path="/formats" element={<FormatsPage />} />
                  <Route path="/rubrique/formats-octogoal" element={<FormatsPage />} />

                  {/* Route de test */}
                  <Route path="/test" element={<TestPage />} />
                  
                  {/* Route 404 - DOIT ÊTRE EN DERNIER */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
                </Suspense>
              </main>
              <Analytics />
            </div>
          </ErrorBoundary>
        </DataProvider>
      </Router>
    </HelmetProvider>
  );
}

export default App;
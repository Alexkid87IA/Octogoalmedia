// src/App.tsx
import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
const GuidesHub = lazy(() => import('./pages/GuidesHub'));
const GuideDigitalDetox = lazy(() => import('./pages/GuideDigitalDetox'));
const FootballPage = lazy(() => import('./pages/FootballPage'));
const FootballClubPage = lazy(() => import('./pages/FootballClubPage'));
const MatchsPage = lazy(() => import('./pages/MatchsPage'));
const ClubsPage = lazy(() => import('./pages/ClubsPage'));

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
                  
                  {/* Routes des guides */}
                  <Route path="/guides" element={<GuidesHub />} />
                  <Route path="/guides/maitrise-digitale" element={<GuideDigitalDetox />} />
                  
                  {/* Route Football - Classements et résultats en direct */}
                  <Route path="/football" element={<FootballPage />} />
                  <Route path="/football/club/:teamId" element={<FootballClubPage />} />

                  {/* Route Matchs - Match Center Live */}
                  <Route path="/matchs" element={<MatchsPage />} />

                  {/* Route Clubs - Club Universe */}
                  <Route path="/clubs" element={<ClubsPage />} />
                  
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
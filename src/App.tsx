// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ResponsiveNavbar } from './components/layout/ResponsiveNavbar';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Analytics } from './components/common/Analytics';
import { ChatWidget } from './components/chat/ChatWidget';
import { DataProvider } from './context/DataContext';
import { HomePage } from './pages/HomePage';
import ArticlePageNEW from './pages/ArticlePageNEW';
import { CategoryPage } from './pages/CategoryPage';
import { SubcategoryPage } from './pages/SubcategoryPage';
import { PodcastPage } from './pages/PodcastPage';
import EmissionsPage from './pages/EmissionsPage';
import { EmissionPage } from './pages/EmissionPage';
import { CreateWithRogerPage } from './pages/CreateWithRogerPage';
import { AboutPage } from './pages/AboutPage';
import { AllArticlesPage } from './pages/AllArticlesPage';
import { CoachingPage } from './pages/CoachingPage';
import { ClubPage } from './pages/ClubPage';
import { NotFound } from './pages/NotFound';

// Import des nouvelles pages
import SuccessStoriesPage from './pages/SuccessStoriesPage';
import BusinessIdeasPage from './pages/BusinessIdeasPage';

// Import des pages de guides
import GuidesHub from './pages/GuidesHub';
import GuideDigitalDetox from './pages/GuideDigitalDetox';

// Page de test simple
const TestPage = () => {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <h1 className="text-4xl">Page de Test</h1>
    </div>
  );
};

function App() {
  return (
    <HelmetProvider>
      <Router>
        <DataProvider>
          <ErrorBoundary>
            <div className="relative min-h-screen bg-black overflow-x-hidden">
              <ResponsiveNavbar />
              <main className="relative z-[1]">
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
                  
                  {/* Nouvelles routes */}
                  <Route path="/success-stories" element={<SuccessStoriesPage />} />
                  <Route path="/business-ideas" element={<BusinessIdeasPage />} />
                  
                  {/* Routes des guides */}
                  <Route path="/guides" element={<GuidesHub />} />
                  <Route path="/guides/maitrise-digitale" element={<GuideDigitalDetox />} />
                  
                  {/* Route de test */}
                  <Route path="/test" element={<TestPage />} />
                  
                  {/* Route 404 - DOIT ÊTRE EN DERNIER */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Analytics />
              <ChatWidget />
            </div>
          </ErrorBoundary>
        </DataProvider>
      </Router>
    </HelmetProvider>
  );
}

export default App;
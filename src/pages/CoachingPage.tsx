import React from 'react';
import { SEO } from '../components/common/SEO';
import { NewsletterForm } from '../components/common/NewsletterForm';
import { CoachingHeroSection } from '../components/sections/CoachingHeroSection';
import { CoachingPhilosophySection } from '../components/sections/CoachingPhilosophySection';
import { CoachingExpertiseSection } from '../components/sections/CoachingExpertiseSection';
import { CoachingOffersSection } from '../components/sections/CoachingOffersSection';
import { CoachingResultsSection } from '../components/sections/CoachingResultsSection';
import { CoachingProcessSection } from '../components/sections/CoachingProcessSection';
import { CoachingTestimonialsSection } from '../components/sections/CoachingTestimonialsSection';
import { CoachingFAQSection } from '../components/sections/CoachingFAQSection';
import { CoachingBookingSection } from '../components/sections/CoachingBookingSection';

const CoachingPage = () => {
  return (
    <>
      <SEO
        title="Coaching avec Octogoal | Accompagnement stratégique et aligné"
        description="Découvrez les offres de coaching de Octogoal pour vous aligner, entreprendre et avancer avec clarté."
        image="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80"
      />
      <div className="pb-20">
        <CoachingHeroSection />
        <CoachingPhilosophySection />
        <CoachingExpertiseSection />
        <CoachingOffersSection />
        <CoachingResultsSection />
        <CoachingProcessSection />
        <CoachingTestimonialsSection />
        <CoachingFAQSection />
        <CoachingBookingSection />
        
        {/* Newsletter */}
        <section className="container py-20">
          <NewsletterForm />
        </section>
      </div>
    </>
  );
};

export default CoachingPage;

export { CoachingPage };
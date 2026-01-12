import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle, AlertTriangle } from 'lucide-react';

export const NewsletterForm = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    // Simulation d'un appel API
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Validation email avec regex proper
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(email)) {
      console.log('Newsletter subscription:', email);
      setStatus('success');
      setMessage('Merci ! Votre inscription a bien été prise en compte.');
      setEmail(''); // Réinitialiser le champ email
    } else {
      setStatus('error');
      setMessage('Oups ! Veuillez entrer une adresse email valide.');
    }
  };

  return (
    <section className="bg-gradient-to-br from-gray-800/70 to-gray-900/50 p-6 md:p-10 rounded-2xl shadow-2xl border border-gray-700/50 selection:bg-accent-violet selection:text-white">
      <div className="max-w-2xl mx-auto text-center">
        <motion.h3 
          className="text-3xl md:text-4xl font-bold text-white mb-3"
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Restez Inspiré, Chaque Semaine.
        </motion.h3>
        <motion.p 
          className="text-gray-300 mb-8 md:text-lg leading-relaxed"
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Abonnez-vous à notre newsletter pour recevoir une dose hebdomadaire d'inspiration, les meilleurs articles, des conseils exclusifs et les actualités de notre communauté.
        </motion.p>
        
        {status === 'success' && (
          <motion.div 
            className="flex items-center justify-center gap-2 bg-green-500/10 text-green-400 border border-green-500/30 p-3 rounded-lg mb-6 text-sm"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          >
            <CheckCircle size={20} /> {message}
          </motion.div>
        )}
        {status === 'error' && (
          <motion.div 
            className="flex items-center justify-center gap-2 bg-red-500/10 text-red-400 border border-red-500/30 p-3 rounded-lg mb-6 text-sm"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          >
            <AlertTriangle size={20} /> {message}
          </motion.div>
        )}

        {(status === 'idle' || status === 'loading' || status === 'error') && (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 items-stretch">
            <label htmlFor="newsletter-email" className="sr-only">Adresse email</label>
            <motion.input
              id="newsletter-email"
              initial={{ opacity: 0, width: '80%' }}
              animate={{ opacity: 1, width: '100%' }}
              transition={{ duration: 0.5, delay: 0.3 }}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Votre adresse e-mail"
              aria-describedby="newsletter-privacy"
              className="flex-grow bg-gray-800/60 border border-gray-700/80 rounded-lg px-5 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-violet focus:border-accent-violet transition-all duration-200 shadow-sm text-base"
              required
              disabled={status === 'loading'}
            />
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }} 
              transition={{ duration: 0.5, delay: 0.4 }}
              whileHover={{ scale: 1.03, boxShadow: "0px 0px 15px rgba(138, 43, 226, 0.5)" }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              className="relative group flex items-center justify-center gap-2 bg-accent-violet hover:bg-accent-violet-dark text-white font-semibold px-6 py-3.5 rounded-lg transition-all duration-300 ease-in-out shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-accent-violet focus:ring-offset-2 focus:ring-offset-background-dark disabled:opacity-70 disabled:cursor-not-allowed"
              disabled={status === 'loading'}
            >
              {status === 'loading' ? (
                <>
                  <motion.div 
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"
                    initial={{ opacity:0 }} animate={{ opacity:1}} exit={{ opacity:0 }}
                  />
                  <span>Envoi...</span>
                </>
              ) : (
                <>
                  <span>S'inscrire</span>
                  <Send size={18} className="transform group-hover:translate-x-1 transition-transform duration-200" />
                </>
              )}
            </motion.button>
          </form>
        )}
        <motion.p
          id="newsletter-privacy"
          className="text-xs text-gray-500 mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          Nous respectons votre vie privée. Désinscription possible à tout moment.
        </motion.p>
      </div>
    </section>
  );
};

// src/utils/sanityCache.ts
// Ce fichier gère le cache pour éviter de charger les mêmes données plusieurs fois

import { sanityClient } from './sanityClient';

/**
 * Système de cache simple pour les requêtes Sanity
 * Évite de recharger les mêmes données plusieurs fois
 */
class SanityCache {
  private cache: Map<string, { data: unknown; timestamp: number }>;
  private CACHE_DURATION: number;

  constructor() {
    this.cache = new Map();
    this.CACHE_DURATION = 5 * 60 * 1000; // 5 minutes de cache
  }

  /**
   * Récupère les données depuis le cache ou Sanity
   * @param query - La requête GROQ à exécuter
   * @param params - Les paramètres optionnels de la requête
   * @returns Les données ou null en cas d'erreur
   */
  async fetch<T>(query: string, params?: Record<string, unknown>): Promise<T | null> {
    // Créer une clé unique pour cette requête
    const key = JSON.stringify({ query, params });
    
    // Vérifier si on a déjà ces données en cache
    if (this.cache.has(key)) {
      const cached = this.cache.get(key)!;
      const age = Date.now() - cached.timestamp;
      
      // Si le cache est encore valide (moins de 5 minutes)
      if (age < this.CACHE_DURATION) {
        // console.log('📦 Données récupérées depuis le cache');
        return cached.data;
      }
    }

    try {
      // Récupérer les données depuis Sanity
      // console.log('🔄 Chargement des données depuis Sanity...');
      const data = await sanityClient.fetch<T>(query, params);
      
      // Mettre en cache pour les prochaines fois
      this.cache.set(key, {
        data,
        timestamp: Date.now()
      });
      
      return data;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des données:', error);
      
      // Si on a une version en cache (même expirée), on la retourne
      if (this.cache.has(key)) {
        // console.log('⚠️ Utilisation du cache expiré suite à une erreur');
        return this.cache.get(key)!.data;
      }
      
      return null;
    }
  }

  /**
   * Vide le cache (utile après une mise à jour de contenu)
   */
  clear(): void {
    this.cache.clear();
    // console.log('🗑️ Cache vidé');
  }

  /**
   * Supprime une entrée spécifique du cache
   */
  invalidate(pattern: string): void {
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
      }
    }
    // console.log(`🗑️ Cache invalidé pour: ${pattern}`);
  }

  /**
   * Obtient la taille actuelle du cache
   */
  getSize(): number {
    return this.cache.size;
  }

  /**
   * Affiche les statistiques du cache (pour debug)
   */
  getStats(): void {
    // console.log(`📊 Cache stats: ${this.cache.size} entrées`);
    for (const [key, value] of this.cache.entries()) {
      const age = Math.floor((Date.now() - value.timestamp) / 1000);
      // console.log(`  - ${key.substring(0, 50)}... (âge: ${age}s)`);
    }
  }
}

// Créer une instance unique du cache
export const sanityCache = new SanityCache();

// Exporter aussi une version simplifiée pour les composants
export const fetchWithCache = <T>(query: string, params?: Record<string, unknown>): Promise<T | null> => {
  return sanityCache.fetch<T>(query, params);
};
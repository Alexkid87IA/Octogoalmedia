// Importation des schémas
import universe from './universe'
import clubFeature from './clubFeature'
import clubPricing from './clubPricing'
import debate from './debate'
import emission from './emission'
import extrait from './extrait'
import vsPoll from './vsPoll'
import seo from './seo'
import category from './category'
import subcategory from './subcategory'
import player from './player'
import article from './article'

// Export de tous les schémas
export const schemaTypes = [
  // Schémas SEO et navigation
  seo,
  category,
  subcategory,

  // Schémas de contenu
  article,
  universe,
  clubFeature,
  clubPricing,
  debate,
  emission,
  extrait,
  vsPoll,

  // Schémas joueurs
  player,
]

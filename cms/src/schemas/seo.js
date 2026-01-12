// Schema SEO réutilisable pour Sanity
// Ajouter ce schéma comme objet dans vos types category, article, etc.

export default {
  name: 'seo',
  title: 'SEO',
  type: 'object',
  fields: [
    {
      name: 'metaTitle',
      title: 'Titre SEO',
      type: 'string',
      description: 'Titre pour Google (50-60 caractères recommandés)',
      validation: Rule => Rule.max(60).warning('Le titre devrait faire moins de 60 caractères')
    },
    {
      name: 'metaDescription',
      title: 'Description SEO',
      type: 'text',
      rows: 3,
      description: 'Description pour Google (150-160 caractères recommandés)',
      validation: Rule => Rule.max(160).warning('La description devrait faire moins de 160 caractères')
    },
    {
      name: 'ogImage',
      title: 'Image Open Graph',
      type: 'image',
      description: 'Image pour le partage social (1200x630px recommandé)',
      options: {
        hotspot: true
      }
    },
    {
      name: 'keywords',
      title: 'Mots-clés',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Mots-clés pour le SEO (optionnel)'
    },
    {
      name: 'noIndex',
      title: 'Ne pas indexer',
      type: 'boolean',
      description: 'Cocher pour empêcher Google d\'indexer cette page',
      initialValue: false
    }
  ]
}

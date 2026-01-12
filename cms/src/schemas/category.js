// Schema Category avec SEO pour Sanity
// À importer dans votre index.js

export default {
  name: 'category',
  title: 'Catégorie',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Titre',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      description: 'Description courte de la catégorie'
    },
    {
      name: 'icon',
      title: 'Icône',
      type: 'string',
      description: 'Nom de l\'icône Lucide (ex: Zap, Trophy, Users)'
    },
    {
      name: 'color',
      title: 'Couleur',
      type: 'string',
      description: 'Couleur Tailwind (ex: pink, blue, purple)'
    },
    {
      name: 'image',
      title: 'Image de couverture',
      type: 'image',
      options: {
        hotspot: true
      }
    },
    // Champs SEO
    {
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        {
          name: 'metaTitle',
          title: 'Titre SEO',
          type: 'string',
          description: 'Titre pour Google (50-60 caractères). Ex: "Actus Football - Transferts et Résultats | Octogoal"',
          validation: Rule => Rule.max(60).warning('Le titre devrait faire moins de 60 caractères')
        },
        {
          name: 'metaDescription',
          title: 'Description SEO',
          type: 'text',
          rows: 3,
          description: 'Description pour Google (150-160 caractères). Incluez des mots-clés naturellement.',
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
          description: 'Mots-clés principaux (ex: football, transferts, ligue 1)'
        }
      ]
    },
    // Ordre d'affichage
    {
      name: 'order',
      title: 'Ordre',
      type: 'number',
      description: 'Ordre d\'affichage dans le menu'
    }
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'seo.metaTitle'
    }
  }
}

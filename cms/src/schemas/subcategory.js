// Schema Subcategory avec SEO pour Sanity
// À importer dans votre index.js

export default {
  name: 'subcategory',
  title: 'Sous-catégorie',
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
      name: 'parentCategory',
      title: 'Catégorie parente',
      type: 'reference',
      to: [{ type: 'category' }],
      validation: Rule => Rule.required()
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      description: 'Description courte de la sous-catégorie'
    },
    {
      name: 'icon',
      title: 'Icône',
      type: 'string',
      description: 'Nom de l\'icône Lucide (ex: RefreshCw, Trophy, Globe)'
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
          description: 'Titre pour Google (50-60 caractères). Ex: "Mercato Football - Transferts et Rumeurs | Octogoal"',
          validation: Rule => Rule.max(60).warning('Le titre devrait faire moins de 60 caractères')
        },
        {
          name: 'metaDescription',
          title: 'Description SEO',
          type: 'text',
          rows: 3,
          description: 'Description pour Google (150-160 caractères). Soyez spécifique à cette sous-catégorie.',
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
          description: 'Mots-clés spécifiques (ex: mercato, transferts, rumeurs)'
        }
      ]
    },
    // Ordre d'affichage
    {
      name: 'order',
      title: 'Ordre',
      type: 'number',
      description: 'Ordre d\'affichage dans la catégorie parente'
    }
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'parentCategory.title',
      media: 'image'
    },
    prepare({ title, subtitle }) {
      return {
        title,
        subtitle: subtitle ? `Dans: ${subtitle}` : 'Sans catégorie parente'
      }
    }
  }
}

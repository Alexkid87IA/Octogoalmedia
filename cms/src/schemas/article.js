/**
 * Schéma Article pour Octogoal CMS
 * Avec support hotspot pour le positionnement des images
 */

export default {
  name: 'article',
  title: 'Article',
  type: 'document',
  groups: [
    { name: 'content', title: 'Contenu' },
    { name: 'media', title: 'Média' },
    { name: 'metadata', title: 'Métadonnées' },
    { name: 'seo', title: 'SEO' },
    { name: 'links', title: 'Liens' }
  ],
  fields: [
    // === CONTENU ===
    {
      name: 'title',
      title: 'Titre',
      type: 'string',
      group: 'content',
      validation: Rule => Rule.required().max(120)
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'content',
      options: {
        source: 'title',
        maxLength: 96
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'excerpt',
      title: 'Résumé',
      type: 'text',
      group: 'content',
      rows: 3,
      description: 'Résumé court de l\'article (150-200 caractères)',
      validation: Rule => Rule.max(300)
    },
    {
      name: 'keyPoints',
      title: 'Points clés',
      type: 'array',
      group: 'content',
      of: [{ type: 'string' }],
      description: 'Points clés à afficher en haut de l\'article (max 5)',
      validation: Rule => Rule.max(5)
    },
    {
      name: 'body',
      title: 'Contenu',
      type: 'array',
      group: 'content',
      of: [
        { type: 'block' },
        { type: 'image', options: { hotspot: true } },
        { type: 'callout' },
        { type: 'styledQuote' },
        { type: 'topList' },
        { type: 'quickPoll' },
        { type: 'footballQuiz' },
        { type: 'teamLineup' },
        { type: 'mercatoRumor' },
        { type: 'youtube' }
      ]
    },

    // === MÉDIA ===
    {
      name: 'mainImage',
      title: 'Image de couverture',
      type: 'image',
      group: 'media',
      options: {
        hotspot: true  // Active l'éditeur de point focal
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Texte alternatif',
          description: 'Important pour l\'accessibilité et le SEO'
        },
        {
          name: 'caption',
          type: 'string',
          title: 'Légende'
        }
      ],
      validation: Rule => Rule.required()
    },
    {
      name: 'videoUrl',
      title: 'URL Vidéo',
      type: 'url',
      group: 'media',
      description: 'URL YouTube ou autre plateforme vidéo'
    },
    {
      name: 'duration',
      title: 'Durée',
      type: 'string',
      group: 'media',
      description: 'Durée de la vidéo (ex: 12:34)'
    },

    // === MÉTADONNÉES ===
    {
      name: 'author',
      title: 'Auteur',
      type: 'reference',
      group: 'metadata',
      to: [{ type: 'author' }]
    },
    {
      name: 'publishedAt',
      title: 'Date de publication',
      type: 'datetime',
      group: 'metadata',
      initialValue: () => new Date().toISOString()
    },
    {
      name: 'readingTime',
      title: 'Temps de lecture',
      type: 'string',
      group: 'metadata',
      description: 'Ex: 5 min'
    },
    {
      name: 'contentType',
      title: 'Type de contenu',
      type: 'string',
      group: 'metadata',
      options: {
        list: [
          { title: 'Article', value: 'article' },
          { title: 'News', value: 'news' },
          { title: 'Portrait', value: 'portrait' },
          { title: 'Analyse', value: 'analyse' },
          { title: 'Interview', value: 'interview' },
          { title: 'Vidéo', value: 'video' },
          { title: 'Top/Liste', value: 'top' },
          { title: 'Quiz', value: 'quiz' }
        ]
      }
    },
    {
      name: 'playerPosition',
      title: 'Position du joueur',
      type: 'string',
      group: 'metadata',
      description: 'Pour les articles de type portrait',
      options: {
        list: [
          { title: 'Gardien', value: 'gardien' },
          { title: 'Défenseur', value: 'defenseur' },
          { title: 'Milieu', value: 'milieu' },
          { title: 'Attaquant', value: 'attaquant' }
        ]
      },
      hidden: ({ document }) => document?.contentType !== 'portrait'
    },

    // === FLAGS ===
    {
      name: 'isFeatured',
      title: 'À la une',
      type: 'boolean',
      group: 'metadata',
      initialValue: false
    },
    {
      name: 'isTrending',
      title: 'Tendance',
      type: 'boolean',
      group: 'metadata',
      initialValue: false
    },
    {
      name: 'isEssential',
      title: 'Essentiel',
      type: 'boolean',
      group: 'metadata',
      initialValue: false
    },

    // === CATÉGORISATION ===
    {
      name: 'categories',
      title: 'Catégories',
      type: 'array',
      group: 'links',
      of: [{ type: 'reference', to: [{ type: 'category' }] }],
      validation: Rule => Rule.required().min(1)
    },
    {
      name: 'subcategories',
      title: 'Sous-catégories',
      type: 'array',
      group: 'links',
      of: [{ type: 'reference', to: [{ type: 'subcategory' }] }]
    },
    {
      name: 'tags',
      title: 'Tags',
      type: 'array',
      group: 'links',
      of: [{ type: 'reference', to: [{ type: 'tag' }] }]
    },

    // === LIENS JOUEURS/CLUBS ===
    {
      name: 'linkedPlayers',
      title: 'Joueurs concernés',
      type: 'array',
      group: 'links',
      of: [
        {
          type: 'object',
          name: 'playerLink',
          fields: [
            {
              name: 'player',
              title: 'Joueur',
              type: 'reference',
              to: [{ type: 'player' }]
            }
          ],
          preview: {
            select: {
              title: 'player.name',
              media: 'player.photo'
            }
          }
        }
      ],
      description: 'Joueurs mentionnés dans l\'article (liés à API-Football)'
    },
    {
      name: 'linkedClubs',
      title: 'Clubs concernés',
      type: 'array',
      group: 'links',
      of: [{ type: 'reference', to: [{ type: 'club' }] }]
    },

    // === SEO ===
    {
      name: 'seoTitle',
      title: 'Titre SEO',
      type: 'string',
      group: 'seo',
      description: 'Titre optimisé pour les moteurs de recherche (60 caractères max)',
      validation: Rule => Rule.max(60)
    },
    {
      name: 'seoDescription',
      title: 'Description SEO',
      type: 'text',
      group: 'seo',
      rows: 2,
      description: 'Description pour les moteurs de recherche (160 caractères max)',
      validation: Rule => Rule.max(160)
    }
  ],

  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      media: 'mainImage',
      publishedAt: 'publishedAt',
      isFeatured: 'isFeatured'
    },
    prepare({ title, author, media, publishedAt, isFeatured }) {
      const date = publishedAt ? new Date(publishedAt).toLocaleDateString('fr-FR') : 'Non publié'
      return {
        title: `${isFeatured ? '⭐ ' : ''}${title || 'Sans titre'}`,
        subtitle: `${author || 'Auteur inconnu'} • ${date}`,
        media
      }
    }
  },

  orderings: [
    {
      title: 'Date de publication (récent)',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }]
    },
    {
      title: 'Titre A-Z',
      name: 'titleAsc',
      by: [{ field: 'title', direction: 'asc' }]
    }
  ]
}

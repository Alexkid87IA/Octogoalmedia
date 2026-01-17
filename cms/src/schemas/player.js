export default {
  name: 'player',
  title: 'Joueur',
  type: 'document',
  groups: [
    { name: 'identity', title: 'Identité' },
    { name: 'editorial', title: 'Contenu Éditorial' },
    { name: 'flags', title: 'Flags' },
    { name: 'links', title: 'Liens' }
  ],
  fields: [
    // Identité
    {
      name: 'name',
      title: 'Nom du joueur',
      type: 'string',
      group: 'identity',
      validation: Rule => Rule.required()
    },
    {
      name: 'apiFootballId',
      title: 'ID API-Football',
      type: 'number',
      group: 'identity',
      description: 'ID du joueur sur API-Football pour récupérer les stats',
      validation: Rule => Rule.required().positive().integer()
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'identity',
      options: {
        source: 'name',
        maxLength: 96
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'photo',
      title: 'Photo du joueur',
      type: 'image',
      group: 'identity',
      options: {
        hotspot: true
      },
      description: 'Photo custom (sinon celle de API-Football sera utilisée)'
    },

    // Contenu Éditorial Octogoal
    {
      name: 'customBio',
      title: 'Bio Octogoal',
      type: 'text',
      group: 'editorial',
      rows: 4,
      description: 'Présentation du joueur par Octogoal'
    },
    {
      name: 'playingStyle',
      title: 'Style de jeu',
      type: 'text',
      group: 'editorial',
      rows: 3,
      description: 'Description du style de jeu du joueur'
    },
    {
      name: 'strengths',
      title: 'Points forts',
      type: 'array',
      group: 'editorial',
      of: [{ type: 'string' }],
      validation: Rule => Rule.max(5),
      description: 'Points forts du joueur (max 5)'
    },
    {
      name: 'weaknesses',
      title: 'Points faibles',
      type: 'array',
      group: 'editorial',
      of: [{ type: 'string' }],
      validation: Rule => Rule.max(5),
      description: 'Points faibles du joueur (max 5)'
    },
    {
      name: 'funFacts',
      title: 'Anecdotes',
      type: 'array',
      group: 'editorial',
      of: [{ type: 'text' }],
      description: 'Anecdotes amusantes sur le joueur'
    },
    {
      name: 'famousQuotes',
      title: 'Citations célèbres',
      type: 'array',
      group: 'editorial',
      of: [{ type: 'text' }],
      description: 'Citations célèbres du ou sur le joueur'
    },
    {
      name: 'octogoalVerdict',
      title: 'Verdict Octogoal',
      type: 'text',
      group: 'editorial',
      rows: 3,
      description: 'Notre verdict final sur le joueur'
    },

    // Flags éditoriaux
    {
      name: 'isPepite',
      title: 'Pépite',
      type: 'boolean',
      group: 'flags',
      description: 'Jeune talent à suivre',
      initialValue: false
    },
    {
      name: 'isLegend',
      title: 'Légende',
      type: 'boolean',
      group: 'flags',
      description: 'Joueur légendaire',
      initialValue: false
    },
    {
      name: 'isFeatured',
      title: 'Mis en avant',
      type: 'boolean',
      group: 'flags',
      description: 'Mettre en avant ce joueur',
      initialValue: false
    },

    // Liens
    {
      name: 'relatedArticles',
      title: 'Articles liés',
      type: 'array',
      group: 'links',
      of: [
        {
          type: 'reference',
          to: [{ type: 'article' }]
        }
      ]
    },
    {
      name: 'tags',
      title: 'Tags',
      type: 'array',
      group: 'links',
      of: [
        {
          type: 'reference',
          to: [{ type: 'tag' }]
        }
      ]
    }
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'apiFootballId',
      media: 'photo',
      isPepite: 'isPepite',
      isLegend: 'isLegend'
    },
    prepare({ title, subtitle, media, isPepite, isLegend }) {
      let badges = []
      if (isPepite) badges.push('Pépite')
      if (isLegend) badges.push('Légende')

      return {
        title: title || 'Sans nom',
        subtitle: `ID: ${subtitle || 'Non défini'} ${badges.length ? `| ${badges.join(', ')}` : ''}`,
        media
      }
    }
  },
  orderings: [
    {
      title: 'Nom',
      name: 'nameAsc',
      by: [{ field: 'name', direction: 'asc' }]
    },
    {
      title: 'Pépites d\'abord',
      name: 'pepitesFirst',
      by: [
        { field: 'isPepite', direction: 'desc' },
        { field: 'name', direction: 'asc' }
      ]
    }
  ]
}

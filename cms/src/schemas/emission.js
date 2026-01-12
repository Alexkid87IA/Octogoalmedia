// Schema pour les émissions Octogoal (format long YouTube)
export default {
  name: 'emission',
  title: 'Émission Octogoal',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Titre de l\'émission',
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
      name: 'episodeNumber',
      title: 'Numéro d\'épisode',
      type: 'number',
      description: 'Ex: 47 pour le 47ème épisode'
    },
    {
      name: 'youtubeUrl',
      title: 'URL YouTube',
      type: 'url',
      description: 'Lien vers la vidéo complète sur YouTube',
      validation: Rule => Rule.required()
    },
    {
      name: 'thumbnail',
      title: 'Miniature',
      type: 'image',
      description: 'Image de couverture de l\'émission (format 16:9)',
      options: {
        hotspot: true
      }
    },
    {
      name: 'duration',
      title: 'Durée',
      type: 'string',
      description: 'Durée au format "1h23" ou "58min"'
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'Courte description ou résumé de l\'émission'
    },
    {
      name: 'themes',
      title: 'Thèmes abordés',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Tags des sujets abordés (Ex: PSG, OM, Mercato...)'
    },
    {
      name: 'publishedAt',
      title: 'Date de publication',
      type: 'datetime',
      validation: Rule => Rule.required()
    }
  ],
  orderings: [
    {
      title: 'Date de publication (récent)',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }]
    },
    {
      title: 'Numéro d\'épisode',
      name: 'episodeNumberDesc',
      by: [{ field: 'episodeNumber', direction: 'desc' }]
    }
  ],
  preview: {
    select: {
      title: 'title',
      episodeNumber: 'episodeNumber',
      date: 'publishedAt',
      media: 'thumbnail'
    },
    prepare({ title, episodeNumber, date, media }) {
      return {
        title: episodeNumber ? `#${episodeNumber} - ${title}` : title,
        subtitle: date ? new Date(date).toLocaleDateString('fr-FR') : 'Non publié',
        media
      }
    }
  }
}

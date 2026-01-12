// Schema pour les extraits/shorts (format vertical 9:16)
export default {
  name: 'extrait',
  title: 'Extrait / Short',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Titre de l\'extrait',
      type: 'string',
      description: 'Titre court et accrocheur',
      validation: Rule => Rule.required()
    },
    {
      name: 'youtubeShortUrl',
      title: 'URL YouTube Shorts',
      type: 'url',
      description: 'Lien vers le Short YouTube ou vidéo courte',
      validation: Rule => Rule.required()
    },
    {
      name: 'thumbnail',
      title: 'Miniature',
      type: 'image',
      description: 'Image verticale de couverture (format 9:16)',
      options: {
        hotspot: true
      }
    },
    {
      name: 'duration',
      title: 'Durée',
      type: 'string',
      description: 'Durée au format "0:58" ou "1:15"'
    },
    {
      name: 'emission',
      title: 'Émission source',
      type: 'reference',
      to: [{ type: 'emission' }],
      description: 'L\'émission d\'où provient cet extrait (optionnel)'
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
    }
  ],
  preview: {
    select: {
      title: 'title',
      duration: 'duration',
      date: 'publishedAt',
      media: 'thumbnail',
      emissionTitle: 'emission.title',
      episodeNumber: 'emission.episodeNumber'
    },
    prepare({ title, duration, date, media, emissionTitle, episodeNumber }) {
      const subtitle = episodeNumber
        ? `Ep. #${episodeNumber} • ${duration || ''}`
        : duration || '';
      return {
        title,
        subtitle: subtitle || (date ? new Date(date).toLocaleDateString('fr-FR') : 'Non publié'),
        media
      }
    }
  }
}

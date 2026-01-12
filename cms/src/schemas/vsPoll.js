// cms/src/schemas/vsPoll.js
// VS Poll - Sondage VS pour faire voter la communauté (Barça vs Real, Messi vs Ronaldo, etc.)
export default {
  name: 'vsPoll',
  title: 'VS Poll',
  type: 'document',
  icon: () => '⚔️',
  fields: [
    {
      name: 'title',
      title: 'Titre',
      description: 'Ex: "El Clásico", "Le GOAT Debate"',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'question',
      title: 'Question',
      description: 'Ex: "Qui va remporter le Classico ?", "Qui est le GOAT ?"',
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
    // Option 1 (gauche)
    {
      name: 'option1',
      title: 'Option 1 (Gauche)',
      type: 'object',
      fields: [
        {
          name: 'name',
          title: 'Nom',
          description: 'Ex: "FC Barcelone", "Messi"',
          type: 'string',
          validation: Rule => Rule.required()
        },
        {
          name: 'subtitle',
          title: 'Sous-titre (optionnel)',
          description: 'Ex: "La Liga", "Argentine"',
          type: 'string'
        },
        {
          name: 'image',
          title: 'Image',
          type: 'image',
          options: { hotspot: true },
          validation: Rule => Rule.required()
        },
        {
          name: 'color',
          title: 'Couleur dominante',
          description: 'Code hex (ex: #A50044 pour le Barça)',
          type: 'string',
          initialValue: '#ec4899' // pink-500
        },
        {
          name: 'votes',
          title: 'Nombre de votes',
          type: 'number',
          initialValue: 0,
          readOnly: true
        }
      ]
    },
    // Option 2 (droite)
    {
      name: 'option2',
      title: 'Option 2 (Droite)',
      type: 'object',
      fields: [
        {
          name: 'name',
          title: 'Nom',
          description: 'Ex: "Real Madrid", "Ronaldo"',
          type: 'string',
          validation: Rule => Rule.required()
        },
        {
          name: 'subtitle',
          title: 'Sous-titre (optionnel)',
          description: 'Ex: "La Liga", "Portugal"',
          type: 'string'
        },
        {
          name: 'image',
          title: 'Image',
          type: 'image',
          options: { hotspot: true },
          validation: Rule => Rule.required()
        },
        {
          name: 'color',
          title: 'Couleur dominante',
          description: 'Code hex (ex: #FFFFFF pour le Real)',
          type: 'string',
          initialValue: '#3b82f6' // blue-500
        },
        {
          name: 'votes',
          title: 'Nombre de votes',
          type: 'number',
          initialValue: 0,
          readOnly: true
        }
      ]
    },
    {
      name: 'context',
      title: 'Contexte (optionnel)',
      description: 'Texte additionnel pour expliquer le VS',
      type: 'text',
      rows: 3
    },
    {
      name: 'featured',
      title: 'À la une',
      description: 'Afficher ce VS sur la page d\'accueil',
      type: 'boolean',
      initialValue: false
    },
    {
      name: 'active',
      title: 'Vote actif',
      description: 'Les utilisateurs peuvent voter',
      type: 'boolean',
      initialValue: true
    },
    {
      name: 'publishedAt',
      title: 'Date de publication',
      type: 'datetime',
      initialValue: () => new Date().toISOString()
    },
    {
      name: 'endsAt',
      title: 'Date de fin (optionnel)',
      description: 'Le vote se fermera automatiquement à cette date',
      type: 'datetime'
    }
  ],
  preview: {
    select: {
      title: 'title',
      option1: 'option1.name',
      option2: 'option2.name',
      media: 'option1.image'
    },
    prepare({ title, option1, option2, media }) {
      return {
        title: title || 'VS Poll',
        subtitle: `${option1 || '?'} vs ${option2 || '?'}`,
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
      title: 'À la une en premier',
      name: 'featuredFirst',
      by: [
        { field: 'featured', direction: 'desc' },
        { field: 'publishedAt', direction: 'desc' }
      ]
    }
  ]
}

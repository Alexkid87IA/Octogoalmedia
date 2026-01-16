// src/utils/articleUtils.ts
import { SanityArticle, VerticalColors, TableOfContentsHeading } from '../types/article.types';
import type { PortableTextBlock, PortableTextSpan } from '../types/sanity';

// Type pour les valeurs Portable Text
interface PortableTextValue {
  _type?: string;
  children?: Array<{ text?: string }>;
  text?: string;
}

// Fonction utilitaire pour nettoyer les champs Portable Text
export const cleanPortableText = (value: unknown): string => {
  if (!value) return '';
  if (typeof value === 'string') return value;

  const ptValue = value as PortableTextValue;

  // Si c'est un objet Portable Text unique
  if (ptValue._type === 'block' && ptValue.children) {
    return ptValue.children
      .map((child) => child.text || '')
      .join('');
  }

  // Si c'est un tableau de blocs Portable Text
  if (Array.isArray(value)) {
    return (value as PortableTextValue[])
      .map(block => {
        if (block._type === 'block' && block.children) {
          return block.children
            .map((child) => child.text || '')
            .join('');
        }
        return '';
      })
      .join(' ');
  }

  // Si c'est un objet avec une propriété text
  if (ptValue.text) return ptValue.text;

  return '';
};

// Couleurs OCTOGOAL unifiées - Pink/Rose pour TOUS les articles
export const getVerticalColors = (article?: SanityArticle | null): VerticalColors => {
  // Couleur unique Octogoal - Pink/Rose
  return {
    gradient: 'from-pink-500 to-rose-600',
    bgGradient: 'linear-gradient(135deg, rgb(236 72 153), rgb(225 29 72))',
    primary: '#ec4899',
    secondary: '#e11d48',
    bgLight: 'rgba(236, 72, 153, 0.1)',
    bgMedium: 'rgba(236, 72, 153, 0.2)',
    borderColor: 'rgba(236, 72, 153, 0.3)',
    textColor: '#f472b6'
  };
};

// Fonction pour construire l'URL de l'image Sanity
export const buildSanityImageUrl = (imageRef: string): string => {
  const cleanRef = imageRef
    .replace('image-', '')
    .replace('-jpg', '.jpg')
    .replace('-png', '.png')
    .replace('-webp', '.webp');
  return `https://cdn.sanity.io/images/5rn8u6ed/production/${cleanRef}?w=1920&h=1080&fit=crop&auto=format`;
};

// Fonction pour générer la table des matières
export const generateTableOfContents = (article: SanityArticle | null): TableOfContentsHeading[] | null => {
  if (!article?.body) return null;

  const headings: TableOfContentsHeading[] = [];
  let currentH2: TableOfContentsHeading | null = null;

  article.body
    .filter((block): block is PortableTextBlock => block._type === 'block' && ['h2', 'h3'].includes(block.style || ''))
    .forEach((heading) => {
      const text = heading.children?.[0]?.text || '';
      // Utiliser la même logique de génération d'ID que dans les composants
      const prefix = heading.style === 'h2' ? 'h2-' : 'h3-';
      const id = `${prefix}${text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`;

      if (heading.style === 'h2') {
        currentH2 = {
          id,
          text,
          subheadings: []
        };
        headings.push(currentH2);
      } else if (heading.style === 'h3') {
        // Si on a un H3 sans H2 parent, on le traite comme un heading principal
        if (!currentH2) {
          headings.push({
            id,
            text,
            subheadings: []
          });
        } else {
          // Sinon on l'ajoute comme sous-heading du H2 courant
          currentH2.subheadings.push({ id, text });
        }
      }
    });

  return headings.length > 0 ? headings : null;
};

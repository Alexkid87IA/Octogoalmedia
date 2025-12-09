// src/utils/articleUtils.ts
import { SanityArticle, VerticalColors, TableOfContentsHeading } from '../types/article.types';

// Fonction utilitaire pour nettoyer les champs Portable Text
export const cleanPortableText = (value: any): string => {
  if (!value) return '';
  if (typeof value === 'string') return value;
  
  // Si c'est un objet Portable Text unique
  if (value._type === 'block' && value.children) {
    return value.children
      .map((child: any) => child.text || '')
      .join('');
  }
  
  // Si c'est un tableau de blocs Portable Text
  if (Array.isArray(value)) {
    return value
      .map(block => {
        if (block._type === 'block' && block.children) {
          return block.children
            .map((child: any) => child.text || '')
            .join('');
        }
        return '';
      })
      .join(' ');
  }
  
  // Si c'est un objet avec une propriété text
  if (value.text) return value.text;
  
  return '';
};

// Déterminer les couleurs selon la verticale
export const getVerticalColors = (article?: SanityArticle | null): VerticalColors => {
  const category = article?.categories?.[0]?.slug?.current?.toLowerCase();
  
  switch(category) {
    case 'story':
    case 'recits':
      return {
        gradient: 'from-amber-500 to-orange-500',
        bgGradient: 'linear-gradient(135deg, rgb(245 158 11), rgb(249 115 22))',
        primary: '#f59e0b',
        secondary: '#fb923c',
        bgLight: 'rgba(245, 158, 11, 0.1)',
        bgMedium: 'rgba(245, 158, 11, 0.2)',
        borderColor: 'rgba(245, 158, 11, 0.3)',
        textColor: '#fbbf24'
      };
    case 'business':
      return {
        gradient: 'from-blue-500 to-cyan-500',
        bgGradient: 'linear-gradient(135deg, rgb(59 130 246), rgb(6 182 212))',
        primary: '#3b82f6',
        secondary: '#06b6d4',
        bgLight: 'rgba(59, 130, 246, 0.1)',
        bgMedium: 'rgba(59, 130, 246, 0.2)',
        borderColor: 'rgba(59, 130, 246, 0.3)',
        textColor: '#60a5fa'
      };
    case 'mental':
    case 'psycho':
      return {
        gradient: 'from-purple-500 to-violet-500',
        bgGradient: 'linear-gradient(135deg, rgb(168 85 247), rgb(139 92 246))',
        primary: '#a855f7',
        secondary: '#8b5cf6',
        bgLight: 'rgba(168, 85, 247, 0.1)',
        bgMedium: 'rgba(168, 85, 247, 0.2)',
        borderColor: 'rgba(168, 85, 247, 0.3)',
        textColor: '#c084fc'
      };
    case 'society':
      return {
        gradient: 'from-emerald-500 to-teal-500',
        bgGradient: 'linear-gradient(135deg, rgb(16 185 129), rgb(20 184 166))',
        primary: '#10b981',
        secondary: '#14b8a6',
        bgLight: 'rgba(16, 185, 129, 0.1)',
        bgMedium: 'rgba(16, 185, 129, 0.2)',
        borderColor: 'rgba(16, 185, 129, 0.3)',
        textColor: '#34d399'
      };
    default:
      // Par défaut, utiliser bleu
      return {
        gradient: 'from-blue-500 to-cyan-500',
        bgGradient: 'linear-gradient(135deg, rgb(59 130 246), rgb(6 182 212))',
        primary: '#3b82f6',
        secondary: '#06b6d4',
        bgLight: 'rgba(59, 130, 246, 0.1)',
        bgMedium: 'rgba(59, 130, 246, 0.2)',
        borderColor: 'rgba(59, 130, 246, 0.3)',
        textColor: '#60a5fa'
      };
  }
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
    .filter((block: any) => block._type === 'block' && ['h2', 'h3'].includes(block.style))
    .forEach((heading: any) => {
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
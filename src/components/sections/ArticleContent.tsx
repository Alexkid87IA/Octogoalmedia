import React from 'react';
import { urlFor } from '../../utils/imageUrlBuilder';
import { SanityReference } from '../../types/sanity';

interface MarkDef {
  _key: string;
  _type: string;
  href?: string;
}

interface ContentBlock {
  _type: string;
  _key?: string;
  style?: string;
  children?: Array<{
    text: string;
    _type: string;
    marks?: string[];
  }>;
  asset?: SanityReference;
  alt?: string;
  caption?: string;
  listItem?: string;
  level?: number;
  markDefs?: MarkDef[];
  code?: string;
  language?: string;
  filename?: string;
}

interface ArticleContentProps {
  content?: ContentBlock[];
  keyPoints?: string[];
}

const ArticleContent: React.FC<ArticleContentProps> = ({ content, keyPoints }) => {
  console.log("🎯 ARTICLECONTENT APPELÉ!");
  console.log("- content reçu:", content);
  console.log("- keyPoints reçus:", keyPoints);
  
  if (!content || !Array.isArray(content)) {
    return (
      <div className="prose prose-invert max-w-none">
        <div className="p-6 bg-gray-800/50 rounded-lg border border-gray-700">
          <p className="text-gray-400 mb-2">📄 Contenu de l'article en cours de chargement...</p>
          <p className="text-sm text-gray-500">Si le problème persiste, veuillez rafraîchir la page.</p>
        </div>
      </div>
    );
  }

  // Filtrer les points clés valides
  const validKeyPoints = keyPoints?.filter(point => point && point.trim() !== '') || [];

  // Fonction pour rendre le contenu inline (gras, italique, etc.)
  const renderInlineContent = (children: ContentBlock['children']) => {
    if (!Array.isArray(children)) return null;
    
    return (
      <>
        {children.map((child, idx) => {
          if (!child || typeof child !== 'object') return null;
          
          const text = child.text || '';
          
          // Appliquer les marques (gras, italique, etc.)
          if (child.marks && child.marks.length > 0) {
            let element = <span key={idx}>{text}</span>;
            
            child.marks.forEach(mark => {
              switch (mark) {
                case 'strong':
                  element = <strong key={`${idx}-strong`}>{element}</strong>;
                  break;
                case 'em':
                case 'italic':
                  element = <em key={`${idx}-em`}>{element}</em>;
                  break;
                case 'underline':
                  element = <u key={`${idx}-u`}>{element}</u>;
                  break;
                case 'code':
                  element = <code key={`${idx}-code`} className="bg-gray-800 px-1 py-0.5 rounded text-sm">{element}</code>;
                  break;
              }
            });
            
            return element;
          }
          
          return <span key={idx}>{text}</span>;
        })}
      </>
    );
  };

  // Grouper les éléments de liste consécutifs
  const groupedContent: React.ReactNode[] = [];
  let currentList: { type: 'ul' | 'ol', items: React.ReactNode[] } | null = null;

  content.forEach((block, index) => {
    console.log(`Block ${index}:`, block._type, block.listItem, block.style);
    
    // Ignorer les blocs vides
    if (block._type === 'block' && block.children) {
      const text = block.children.map(child => child?.text || '').join('');
      if (!text.trim() && !block.listItem) {
        console.log(`Block ${index} ignoré car vide`);
        return;
      }
    }

    // Gestion des listes
    if (block.listItem === 'bullet' || block.listItem === 'number') {
      const listType = block.listItem === 'bullet' ? 'ul' : 'ol';
      
      if (!currentList || currentList.type !== listType) {
        if (currentList) {
          groupedContent.push(
            React.createElement(
              currentList.type,
              {
                key: `list-${groupedContent.length}`,
                className: currentList.type === 'ul' 
                  ? 'my-4 space-y-2'
                  : 'my-4 space-y-2',
                style: currentList.type === 'ul' 
                  ? { listStyle: 'disc', paddingLeft: '1.5rem' }
                  : { listStyle: 'decimal', paddingLeft: '1.5rem' }
              },
              currentList.items
            )
          );
        }
        currentList = { type: listType, items: [] };
      }
      
      currentList.items.push(
        <li 
          key={`li-${index}`} 
          className="text-gray-300 leading-relaxed"
          style={{ display: 'list-item' }}
        >
          {renderInlineContent(block.children || [])}
        </li>
      );
    } else {
      // Finaliser la liste en cours si elle existe
      if (currentList) {
        groupedContent.push(
          React.createElement(
            currentList.type,
            {
              key: `list-${groupedContent.length}`,
              className: currentList.type === 'ul' 
                ? 'my-4 space-y-2'
                : 'my-4 space-y-2',
              style: currentList.type === 'ul' 
                ? { listStyle: 'disc', paddingLeft: '1.5rem' }
                : { listStyle: 'decimal', paddingLeft: '1.5rem' }
            },
            currentList.items
          )
        );
        currentList = null;
      }

      // Traiter les autres types de blocs
      if (block._type === 'block' && block.children) {
        const style = block.style || 'normal';
        const inlineContent = renderInlineContent(block.children);
        
        switch (style) {
          case 'h1':
            groupedContent.push(
              <h1 key={`h1-${index}`} className="text-4xl font-bold text-white mb-6 mt-8">
                {inlineContent}
              </h1>
            );
            break;
          case 'h2':
            groupedContent.push(
              <h2 key={`h2-${index}`} className="text-3xl font-bold text-white mb-4 mt-8 border-b border-gray-700 pb-2">
                {inlineContent}
              </h2>
            );
            break;
          case 'h3':
            groupedContent.push(
              <h3 key={`h3-${index}`} className="text-2xl font-semibold text-gray-100 mb-3 mt-6">
                {inlineContent}
              </h3>
            );
            break;
          case 'h4':
            groupedContent.push(
              <h4 key={`h4-${index}`} className="text-xl font-semibold text-gray-200 mb-2 mt-4">
                {inlineContent}
              </h4>
            );
            break;
          case 'blockquote':
            groupedContent.push(
              <blockquote key={`quote-${index}`} className="border-l-4 border-blue-500 pl-4 py-2 my-6 bg-gray-900/50 rounded-r-lg">
                <p className="text-gray-300 italic text-lg">{inlineContent}</p>
              </blockquote>
            );
            break;
          default:
            groupedContent.push(
              <p key={`p-${index}`} className="text-gray-300 mb-4 leading-relaxed text-lg">
                {inlineContent}
              </p>
            );
        }
      }
      
      // Images
      else if (block._type === 'image' && block.asset) {
        try {
          const imageUrl = urlFor(block.asset).url();
          groupedContent.push(
            <figure key={`img-${index}`} className="my-8">
              <img 
                src={imageUrl} 
                alt={block.alt || 'Image de l\'article'} 
                className="w-full rounded-lg shadow-2xl"
              />
              {block.caption && (
                <figcaption className="text-center text-gray-400 text-sm mt-2 italic">
                  {block.caption}
                </figcaption>
              )}
            </figure>
          );
        } catch (error) {
          console.error("Erreur lors du traitement de l'image:", error);
        }
      }
      
      // Blocs de code
      else if (block._type === 'code') {
        groupedContent.push(
          <div key={`code-${index}`} className="my-6">
            {block.filename && (
              <div className="bg-gray-800 text-gray-300 px-4 py-2 text-sm rounded-t-lg font-mono">
                {block.filename}
              </div>
            )}
            <pre className={`bg-gray-900 p-4 rounded-lg overflow-x-auto ${block.filename ? 'rounded-t-none' : ''}`}>
              <code className={`language-${block.language || 'text'} text-gray-300`}>
                {block.code}
              </code>
            </pre>
          </div>
        );
      }
    }
  });

  // Ajouter la dernière liste si elle existe
  if (currentList) {
    groupedContent.push(
      React.createElement(
        currentList.type,
        {
          key: `list-${groupedContent.length}`,
          className: currentList.type === 'ul' 
            ? 'my-4 space-y-2'
            : 'my-4 space-y-2',
          style: currentList.type === 'ul' 
            ? { listStyle: 'disc', paddingLeft: '1.5rem' }
            : { listStyle: 'decimal', paddingLeft: '1.5rem' }
        },
        currentList.items
      )
    );
  }

  return (
    <div className="article-content">
      {groupedContent}
      
      {/* Points clés - version simplifiée */}
      {validKeyPoints.length > 0 && (
        <div className="mt-12 p-6 bg-gradient-to-br from-blue-900/10 to-purple-900/10 rounded-xl">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <span className="text-2xl">💡</span>
            Points clés à retenir
          </h3>
          <ul style={{ listStyle: 'disc', paddingLeft: '1.5rem' }} className="space-y-2 text-gray-300">
            {validKeyPoints.map((point, index) => (
              <li key={index} style={{ display: 'list-item' }}>{point}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ArticleContent;
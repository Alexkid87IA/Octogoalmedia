import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { formatDate } from '../../utils/dateUtils';
import SafeImage from './SafeImage';
import ErrorBoundary from './ErrorBoundary';
import { SanityImage } from '../../types/sanity';

interface Category {
  _id: string;
  title: string;
  slug?: {
    current: string;
  };
}

interface ArticleCardProps {
  article: {
    _id: string;
    title: string;
    slug?: {
      current: string;
    };
    mainImage?: SanityImage;
    excerpt?: string;
    publishedAt?: string;
    categories?: Category[];
  };
  variant?: 'default' | 'compact' | 'featured';
  className?: string;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  variant = 'default',
  className = '',
}) => {
  if (!article) return null;

  const isFeatured = variant === 'featured';
  const isCompact = variant === 'compact';
  
  return (
    <ErrorBoundary>
      <article className={`group ${className}`}>
        <div className={`
          ${isFeatured ? 'flex flex-col md:flex-row gap-6 p-4' : 'p-3'} 
          ${isCompact ? 'border-b border-hv-card-border/30 pb-4 mb-4 last:border-0 last:mb-0 last:pb-0' : 'rounded-lg border border-transparent'} 
          hover:bg-hv-card-bg/50 transition-colors h-full flex flex-col hover:border-hv-blue-accent/30
        `}>
          {article.mainImage && !isCompact && (
            <div className={`${isFeatured ? 'md:w-2/5' : ''} overflow-hidden rounded-lg mb-4`}>
              <SafeImage
                source={article.mainImage}
                alt={article.title || "Article image"}
                width={isFeatured ? 400 : 300}
                height={isFeatured ? 300 : 200}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          )}
          
          <div className={`flex flex-col flex-grow ${isFeatured ? 'md:w-3/5' : ''}`}>
            {article.categories && article.categories.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2 self-start">
                {article.categories.map((category, index) => (
                  category.slug?.current && (
                    <Link 
                      key={category._id} 
                      to={`/rubrique/${category.slug.current}`} 
                      className={`inline-block ${["bg-purple-600", "bg-pink-600", "bg-blue-500", "bg-green-500"][index % 4]} px-2 py-0.5 text-xs font-medium text-white rounded hover:opacity-90 transition-opacity`}
                    >
                      {category.title}
                    </Link>
                  )
                ))}
              </div>
            )}
            
            <Link to={`/article/${article.slug?.current || '#'}`} className="block">
              <h3 className={`
                ${isFeatured ? 'text-xl' : isCompact ? 'text-base' : 'text-md'} 
                font-semibold mb-2 text-hv-text-primary-maquette group-hover:text-hv-blue-accent transition-colors 
                ${isCompact ? 'line-clamp-2' : 'line-clamp-3'} flex-grow
              `}>
                {article.title}
              </h3>
            </Link>
            
            {article.excerpt && !isCompact && (
              <p className="text-hv-text-secondary-maquette text-sm mb-4 line-clamp-2">
                {article.excerpt}
              </p>
            )}
            
            <div className="flex items-center justify-between mt-auto pt-2 border-t border-hv-card-border/50">
              <span className="text-xs text-hv-text-secondary-maquette">
                {formatDate(article.publishedAt)}
              </span>
              <Link 
                to={`/article/${article.slug?.current || '#'}`} 
                className="text-xs text-hv-blue-accent group-hover:text-hv-text-white transition-colors flex items-center opacity-0 group-hover:opacity-100"
              >
                Lire
                <ArrowRight className="ml-1 w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </article>
    </ErrorBoundary>
  );
};

export default ArticleCard;
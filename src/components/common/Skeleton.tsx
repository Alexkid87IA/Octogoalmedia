import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'rectangular',
  width,
  height,
  animation = 'pulse'
}) => {
  const baseClasses = 'bg-white/5';

  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-shimmer',
    none: ''
  };

  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg'
  };

  const style: React.CSSProperties = {
    width: width,
    height: height
  };

  return (
    <div
      className={`${baseClasses} ${animationClasses[animation]} ${variantClasses[variant]} ${className}`}
      style={style}
    />
  );
};

// Skeleton pour une carte d'article
export const ArticleCardSkeleton: React.FC = () => (
  <div className="bg-white/5 rounded-xl overflow-hidden">
    <Skeleton className="w-full h-48" />
    <div className="p-4 space-y-3">
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-6 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <div className="flex gap-2 pt-2">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  </div>
);

// Skeleton pour une grille d'articles
export const ArticleGridSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <ArticleCardSkeleton key={i} />
    ))}
  </div>
);

// Skeleton pour un article featured
export const FeaturedArticleSkeleton: React.FC = () => (
  <div className="bg-white/5 rounded-2xl overflow-hidden">
    <div className="grid md:grid-cols-2 gap-6">
      <Skeleton className="w-full h-64 md:h-full" />
      <div className="p-6 space-y-4">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-4/5" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <div className="flex gap-3 pt-4">
          <Skeleton variant="circular" className="w-10 h-10" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Skeleton pour la section hero
export const HeroSkeleton: React.FC = () => (
  <div className="relative h-[70vh] bg-black">
    <Skeleton className="absolute inset-0" animation="wave" />
    <div className="absolute bottom-0 left-0 right-0 p-8 space-y-4">
      <Skeleton className="h-6 w-32" />
      <Skeleton className="h-12 w-3/4" />
      <Skeleton className="h-12 w-1/2" />
      <Skeleton className="h-5 w-2/3" />
    </div>
  </div>
);

// Skeleton pour les émissions
export const EmissionCardSkeleton: React.FC = () => (
  <div className="bg-white/5 rounded-xl overflow-hidden">
    <div className="relative">
      <Skeleton className="w-full aspect-video" />
      <Skeleton className="absolute bottom-2 right-2 h-6 w-16 rounded" />
    </div>
    <div className="p-4 space-y-2">
      <Skeleton className="h-5 w-full" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  </div>
);

// Skeleton pour le footer de stats
export const StatsSkeleton: React.FC = () => (
  <div className="flex gap-8">
    {Array.from({ length: 3 }).map((_, i) => (
      <div key={i} className="text-center space-y-2">
        <Skeleton className="h-8 w-16 mx-auto" />
        <Skeleton className="h-3 w-20 mx-auto" />
      </div>
    ))}
  </div>
);

export default Skeleton;

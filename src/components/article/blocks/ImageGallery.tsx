// src/components/article/blocks/ImageGallery.tsx
// Galerie d'images avec différents layouts
import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { ImageGalleryBlock, GalleryImage } from '../../../types/sanity';
import { urlFor } from '../../../utils/sanityClient';

interface ImageGalleryProps {
  value: ImageGalleryBlock;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ value }) => {
  const { title, images, layout = 'grid-3', showCaptions = true, lightbox = true } = value;
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [carouselIndex, setCarouselIndex] = useState(0);

  // Récupérer l'URL d'une image
  const getImageUrl = (img: GalleryImage, size: number = 800) => {
    if (!img?.image?.asset) return null;
    try {
      if (img.image.asset.url) return img.image.asset.url;
      if (img.image.asset._ref) return urlFor(img.image).width(size).url();
      return null;
    } catch {
      return null;
    }
  };

  const openLightbox = (index: number) => {
    if (lightbox) {
      setCurrentIndex(index);
      setLightboxOpen(true);
    }
  };

  const closeLightbox = () => setLightboxOpen(false);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const nextCarousel = () => {
    setCarouselIndex((prev) => Math.min(prev + 1, images.length - 1));
  };

  const prevCarousel = () => {
    setCarouselIndex((prev) => Math.max(prev - 1, 0));
  };

  // Layout classes
  const getGridClasses = () => {
    switch (layout) {
      case 'grid-2': return 'grid grid-cols-2 gap-4';
      case 'grid-3': return 'grid grid-cols-2 md:grid-cols-3 gap-4';
      case 'masonry': return 'columns-2 md:columns-3 gap-4 space-y-4';
      default: return 'grid grid-cols-2 md:grid-cols-3 gap-4';
    }
  };

  // Carousel layout
  if (layout === 'carousel') {
    return (
      <div className="my-10">
        {title && (
          <h3 className="text-lg font-bold text-white mb-4">{title}</h3>
        )}

        <div className="relative">
          {/* Image principale */}
          <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-900">
            {images[carouselIndex] && (
              <>
                <img
                  src={getImageUrl(images[carouselIndex], 1200) || ''}
                  alt={images[carouselIndex].caption || ''}
                  className="w-full h-full object-cover cursor-pointer"
                  onClick={() => openLightbox(carouselIndex)}
                />
                {lightbox && (
                  <button
                    onClick={() => openLightbox(carouselIndex)}
                    className="absolute top-4 right-4 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
                  >
                    <ZoomIn size={20} className="text-white" />
                  </button>
                )}
              </>
            )}
          </div>

          {/* Navigation */}
          {images.length > 1 && (
            <>
              <button
                onClick={prevCarousel}
                disabled={carouselIndex === 0}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 rounded-full hover:bg-black/70 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={24} className="text-white" />
              </button>
              <button
                onClick={nextCarousel}
                disabled={carouselIndex === images.length - 1}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 rounded-full hover:bg-black/70 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronRight size={24} className="text-white" />
              </button>
            </>
          )}

          {/* Caption */}
          {showCaptions && images[carouselIndex]?.caption && (
            <p className="text-sm text-gray-400 mt-3 text-center italic">
              {images[carouselIndex].caption}
            </p>
          )}

          {/* Indicateurs */}
          {images.length > 1 && (
            <div className="flex justify-center gap-2 mt-4">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCarouselIndex(idx)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    idx === carouselIndex ? 'bg-pink-500' : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Lightbox */}
        {lightboxOpen && <Lightbox />}
      </div>
    );
  }

  // Composant Lightbox
  const Lightbox = () => (
    <div
      className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
      onClick={closeLightbox}
    >
      {/* Bouton fermer */}
      <button
        onClick={closeLightbox}
        className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full z-50"
      >
        <X size={32} className="text-white" />
      </button>

      {/* Navigation */}
      {images.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); prevImage(); }}
            className="absolute left-4 p-3 bg-white/10 rounded-full hover:bg-white/20"
          >
            <ChevronLeft size={32} className="text-white" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); nextImage(); }}
            className="absolute right-4 p-3 bg-white/10 rounded-full hover:bg-white/20"
          >
            <ChevronRight size={32} className="text-white" />
          </button>
        </>
      )}

      {/* Image */}
      <div
        className="max-w-5xl max-h-[80vh] px-4"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={getImageUrl(images[currentIndex], 1600) || ''}
          alt={images[currentIndex]?.caption || ''}
          className="max-w-full max-h-[80vh] object-contain"
        />
        {showCaptions && images[currentIndex]?.caption && (
          <p className="text-white text-center mt-4">
            {images[currentIndex].caption}
          </p>
        )}
        <p className="text-gray-500 text-center mt-2 text-sm">
          {currentIndex + 1} / {images.length}
        </p>
      </div>
    </div>
  );

  // Grid/Masonry layout
  return (
    <div className="my-10">
      {title && (
        <h3 className="text-lg font-bold text-white mb-4">{title}</h3>
      )}

      <div className={getGridClasses()}>
        {images.map((img, idx) => {
          const imageUrl = getImageUrl(img);
          if (!imageUrl) return null;

          return (
            <figure
              key={img._key || idx}
              className={`relative group overflow-hidden rounded-lg bg-gray-900 ${
                layout === 'masonry' ? 'break-inside-avoid' : ''
              }`}
            >
              <img
                src={imageUrl}
                alt={img.caption || ''}
                className={`w-full object-cover cursor-pointer transition-transform duration-300 group-hover:scale-105 ${
                  layout === 'masonry' ? '' : 'aspect-square'
                }`}
                onClick={() => openLightbox(idx)}
              />

              {/* Overlay au hover */}
              {lightbox && (
                <div
                  className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                  onClick={() => openLightbox(idx)}
                >
                  <ZoomIn size={32} className="text-white" />
                </div>
              )}

              {/* Caption */}
              {showCaptions && img.caption && (
                <figcaption className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                  <p className="text-sm text-white">{img.caption}</p>
                </figcaption>
              )}
            </figure>
          );
        })}
      </div>

      {/* Lightbox */}
      {lightboxOpen && <Lightbox />}
    </div>
  );
};

export default ImageGallery;

// src/components/guide/GuideShareBar.tsx
import React, { useState } from 'react';
import { Guide } from '../../data/guidesData';
import { Share2, Twitter, Linkedin, Copy, Check, Download, Bookmark } from 'lucide-react';

interface GuideShareBarProps {
  guide: Guide;
  mobile?: boolean;
}

const GuideShareBar: React.FC<GuideShareBarProps> = ({ guide, mobile = false }) => {
  const [copied, setCopied] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareTitle = `${guide.title} - ${guide.subtitle}`;
  const shareText = guide.excerpt;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (platform: string) => {
    let url = '';
    
    switch(platform) {
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'linkedin':
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'native':
        if (navigator.share) {
          navigator.share({
            title: shareTitle,
            text: shareText,
            url: shareUrl
          });
          return;
        }
        break;
    }
    
    if (url) {
      window.open(url, '_blank', 'width=600,height=400');
    }
  };

  const handleBookmark = () => {
    setBookmarked(!bookmarked);
    // Ici tu pourrais ajouter la logique pour sauvegarder en localStorage
  };

  const handleDownload = () => {
    // Logique pour télécharger en PDF
    alert('Fonction de téléchargement PDF à venir !');
  };

  if (mobile) {
    // Version mobile horizontale
    return (
      <div className="flex items-center justify-between">
        <button
          onClick={() => handleShare('native')}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-violet-500 text-white rounded-lg font-medium"
        >
          <Share2 size={18} />
          Partager
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={handleBookmark}
            className={`p-2 rounded-lg transition-all ${
              bookmarked 
                ? 'bg-purple-500/20 text-purple-400' 
                : 'bg-white/10 text-gray-400 hover:text-white'
            }`}
          >
            <Bookmark size={18} fill={bookmarked ? 'currentColor' : 'none'} />
          </button>
          <button
            onClick={handleDownload}
            className="p-2 bg-white/10 hover:bg-white/20 text-gray-400 hover:text-white rounded-lg transition-all"
          >
            <Download size={18} />
          </button>
        </div>
      </div>
    );
  }

  // Version desktop verticale
  return (
    <div className="space-y-6">
      {/* Share Section */}
      <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
        <h3 className="text-lg font-bold text-white mb-4">Partager ce guide</h3>
        
        <div className="space-y-3">
          <button
            onClick={() => handleShare('twitter')}
            className="w-full flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-all group"
          >
            <Twitter size={18} className="text-gray-400 group-hover:text-[#1DA1F2]" />
            <span className="text-sm text-gray-300">Twitter</span>
          </button>
          
          <button
            onClick={() => handleShare('linkedin')}
            className="w-full flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-all group"
          >
            <Linkedin size={18} className="text-gray-400 group-hover:text-[#0077B5]" />
            <span className="text-sm text-gray-300">LinkedIn</span>
          </button>
          
          <button
            onClick={handleCopy}
            className="w-full flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-all group"
          >
            {copied ? (
              <Check size={18} className="text-green-400" />
            ) : (
              <Copy size={18} className="text-gray-400 group-hover:text-purple-400" />
            )}
            <span className="text-sm text-gray-300">
              {copied ? 'Copié !' : 'Copier le lien'}
            </span>
          </button>
        </div>
      </div>

      {/* Actions Section */}
      <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
        <h3 className="text-lg font-bold text-white mb-4">Actions</h3>
        
        <div className="space-y-3">
          <button
            onClick={handleBookmark}
            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
              bookmarked 
                ? 'bg-purple-500/20 text-purple-400' 
                : 'bg-white/5 hover:bg-white/10 text-gray-300'
            }`}
          >
            <Bookmark size={18} fill={bookmarked ? 'currentColor' : 'none'} />
            <span className="text-sm">
              {bookmarked ? 'Sauvegardé' : 'Sauvegarder'}
            </span>
          </button>
          
          <button
            onClick={handleDownload}
            className="w-full flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-all text-gray-300"
          >
            <Download size={18} />
            <span className="text-sm">Télécharger PDF</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-gradient-to-br from-purple-900/20 to-violet-900/20 rounded-2xl p-6 border border-purple-500/30">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Temps de lecture</span>
            <span className="text-sm font-bold text-purple-400">{guide.readingTime} min</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Catégorie</span>
            <span className="text-sm font-bold text-purple-400">{guide.category}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Statut</span>
            <span className="text-sm font-bold text-green-400">Publié</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuideShareBar;
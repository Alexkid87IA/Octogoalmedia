// src/components/article/blocks/CtaButton.tsx
// Lien d'appel à l'action - Style éditorial épuré
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface CtaButtonProps {
  value: {
    _type?: string;
    text?: string;
    label?: string;
    url?: string;
    link?: string;
    href?: string;
    style?: string;
    openInNewTab?: boolean;
    newTab?: boolean;
  };
}

const CtaButton: React.FC<CtaButtonProps> = ({ value }) => {
  // Gérer différents noms de champs possibles depuis Sanity
  const text = value.text || value.label || 'Lien';
  const url = value.url || value.link || value.href || '#';
  const openInNewTab = value.openInNewTab || value.newTab || false;

  const isExternal = url.startsWith('http') || openInNewTab;

  const content = (
    <>
      <span>{text}</span>
      <ArrowRight
        size={16}
        className="opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200"
      />
    </>
  );

  const baseStyles = "group inline-flex items-center gap-2 text-lg text-gray-300 hover:text-white transition-colors cursor-pointer";

  // Lien externe
  if (isExternal) {
    return (
      <p className="my-4">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className={baseStyles}
        >
          {content}
        </a>
      </p>
    );
  }

  // Lien interne
  return (
    <p className="my-4">
      <Link to={url} className={baseStyles}>
        {content}
      </Link>
    </p>
  );
};

export default CtaButton;

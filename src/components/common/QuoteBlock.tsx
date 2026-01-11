import React from 'react';
import { Quote } from 'lucide-react';

interface QuoteBlockProps {
  quote: string;
  author?: string;
}

export const QuoteBlock = ({ quote, author = 'Octogoal' }: QuoteBlockProps) => {
  return (
    <blockquote className="relative p-8 bg-neutral-900 rounded-lg">
      <Quote className="absolute top-4 left-4 text-accent-violet opacity-20" size={40} />
      <p className="font-playfair text-xl italic text-center px-8">
        "{quote}"
      </p>
      <footer className="mt-4 text-center text-tertiary">
        — {author}
      </footer>
    </blockquote>
  );
};
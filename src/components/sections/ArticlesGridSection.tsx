import React from "react";
import { motion } from "framer-motion";
import { ArticleCard } from "../common/ArticleCard";
import SafeImage from "../common/SafeImage";
import { SanityImage } from "../../types/sanity";

interface SanityArticle {
  slug: string;
  title: string;
  mainImage?: SanityImage;
  tag?: string;
  summary?: string;
}

interface ArticlesGridSectionProps {
  articles: SanityArticle[];
  bookmarkedArticles: string[];
  onBookmark: (slug: string) => void;
}

export const ArticlesGridSection = ({
  articles,
  bookmarkedArticles,
  onBookmark
}: ArticlesGridSectionProps) => {

  if (!articles || articles.length === 0) {
    return <p className="container text-center text-tertiary">Aucun article à afficher pour le moment.</p>;
  }

  return (
    <motion.section
      initial="initial"
      animate="animate"
      variants={{
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
      }}
      className="container"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {articles.map((article) => (
          <ArticleCard
            key={article.slug}
            article={article}
            variant="default"
          />
        ))}
      </div>
    </motion.section>
  );
};

export default ArticlesGridSection;
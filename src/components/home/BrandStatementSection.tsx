import React from "react";

interface BrandStatementProps {
  content?: {
    tagline?: string;
    paragraph?: string;
  };
}

export const BrandStatementSection: React.FC<BrandStatementProps> = ({ content }) => {
  const tagline = content?.tagline || "WHERE STYLE BECOMES EXPRESSION.";
  const paragraph =
    content?.paragraph ||
    "Every creation is an exercise in quiet confidence, balancing timeless high-fashion architecture with immaculate modern precision.";

  return (
    <section className="bg-cream py-20 md:py-32 px-4 sm:px-6 lg:px-8 border-b border-gold/20">
      <div className="max-w-4xl mx-auto text-center">
        <span className="text-[11px] tracking-ultra uppercase text-gold/70 block mb-4 font-serif">
          THE PHILOSOPHY
        </span>
        <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl tracking-luxury text-gold uppercase font-normal leading-tight">
          MAHALEELA
          <br />
          <span className="italic font-light">{tagline}</span>
        </h2>
        <div className="w-16 h-[1px] bg-gold mx-auto my-8 opacity-60" />
        <p className="text-xs sm:text-sm md:text-base uppercase tracking-luxury text-gold/80 max-w-2xl mx-auto font-light leading-relaxed">
          {paragraph}
        </p>
      </div>
    </section>
  );
};

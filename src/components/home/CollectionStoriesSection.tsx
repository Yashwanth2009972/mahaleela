import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface CollectionItem {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  heroImage?: string | null;
}

interface CollectionStoriesSectionProps {
  collections?: CollectionItem[];
}

export const CollectionStoriesSection: React.FC<CollectionStoriesSectionProps> = ({ collections = [] }) => {
  return (
    <section className="bg-white py-20 md:py-32 px-4 sm:px-6 lg:px-8 border-b border-gold/20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[10px] tracking-ultra uppercase text-gold/70 font-serif block mb-2">
            EDITORIAL NARRATIVES
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-gold uppercase tracking-luxury font-normal">
            COLLECTION STORIES
          </h2>
          <div className="w-12 h-[1px] bg-gold mx-auto my-4" />
          <p className="text-xs uppercase tracking-luxury text-gold/80 font-light">
            EACH ARCHIVE TELLS A STORY OF UNCOMPROMISING FORM AND PURITY.
          </p>
        </div>

        {collections.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {collections.map((c) => (
              <div
                key={c.id}
                className="border border-gold/30 bg-cream p-8 sm:p-10 flex flex-col justify-between hover:border-gold transition-colors"
              >
                <div>
                  <span className="text-[9px] uppercase tracking-ultra text-gold/60 block mb-2 font-serif">
                    MAHALEELA ARCHIVE
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl text-gold uppercase tracking-luxury">
                    {c.name}
                  </h3>
                  {c.description && (
                    <p className="mt-3 text-xs uppercase tracking-luxury text-gold/80 font-light leading-relaxed line-clamp-2">
                      {c.description}
                    </p>
                  )}
                </div>

                <div className="mt-8 pt-6 border-t border-gold/20">
                  <Link
                    href={`/collection/${c.slug}`}
                    className="inline-flex items-center gap-2 text-xs uppercase tracking-luxury text-gold hover:underline underline-offset-4"
                  >
                    <span>ENTER COLLECTION</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Graceful Empty State — No fake collections */
          <div className="border border-gold/30 bg-cream p-12 text-center max-w-2xl mx-auto">
            <h4 className="font-serif text-xl text-gold uppercase tracking-luxury">
              STORIES FORTHCOMING
            </h4>
            <p className="mt-2 text-xs uppercase tracking-luxury text-gold/70 font-light">
              Curated collection stories will be unveiled upon the debut of our upcoming season.
            </p>
            <Link
              href="/collections"
              className="mt-6 inline-block px-5 py-2 border border-gold bg-white text-gold text-xs uppercase tracking-luxury hover:bg-cream"
            >
              EXPLORE ALL COLLECTIONS
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

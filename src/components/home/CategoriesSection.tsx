import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
}

interface CategoriesSectionProps {
  categories?: CategoryItem[];
}

export const CategoriesSection: React.FC<CategoriesSectionProps> = ({ categories = [] }) => {
  return (
    <section className="bg-cream py-20 md:py-32 px-4 sm:px-6 lg:px-8 border-b border-gold/20">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-gold/20 pb-6">
          <div>
            <span className="text-[10px] tracking-ultra uppercase text-gold/70 font-serif block mb-2">
              ARCHITECTURAL DEPARTMENTS
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-gold uppercase tracking-luxury font-normal">
              CURATED CATEGORIES
            </h2>
          </div>
          <p className="mt-4 md:mt-0 text-xs uppercase tracking-luxury text-gold/80 max-w-sm">
            DISCIPLINED EDITIONS DESIGNED FOR MODERN ELEVATION.
          </p>
        </div>

        {/* Editorial Typography Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-gold/20 border border-gold/30">
          {categories.map((cat, idx) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className="group relative bg-white p-8 md:p-10 flex flex-col justify-between hover:bg-cream transition-all duration-300 min-h-[160px]"
            >
              <div className="flex items-start justify-between">
                <span className="text-[10px] font-serif tracking-widest text-gold/50">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <div className="w-7 h-7 border border-gold/30 flex items-center justify-center bg-white group-hover:border-gold group-hover:bg-gold group-hover:text-white transition-all text-gold">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
              </div>

              <div>
                <h3 className="font-serif text-xl md:text-2xl text-gold uppercase tracking-wider group-hover:translate-x-1 transition-transform">
                  {cat.name}
                </h3>
                {cat.description && (
                  <p className="mt-2 text-[11px] uppercase tracking-luxury text-gold/70 line-clamp-1 font-light">
                    {cat.description}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

import React from "react";
import Link from "next/link";
import { ProductCard, ProductCardData } from "../product/ProductCard";
import { ArrowRight, Sparkles } from "lucide-react";

interface NewArrivalsSectionProps {
  products?: ProductCardData[];
}

export const NewArrivalsSection: React.FC<NewArrivalsSectionProps> = ({ products = [] }) => {
  return (
    <section className="bg-white py-20 md:py-32 px-4 sm:px-6 lg:px-8 border-b border-gold/20">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-gold/20 pb-6">
          <div>
            <span className="text-[10px] tracking-ultra uppercase text-gold/70 font-serif block mb-2">
              CURATED RELEASES
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-gold uppercase tracking-luxury font-normal">
              NEW ARRIVALS
            </h2>
          </div>
          <Link
            href="/collections"
            className="mt-4 md:mt-0 text-xs uppercase tracking-luxury text-gold inline-flex items-center gap-1.5 hover:underline underline-offset-4"
          >
            <span>VIEW COMPLETE CATALOGUE</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          /* Graceful Luxury Empty State — Zero Fake Products */
          <div className="border border-gold/30 bg-cream p-12 md:p-16 text-center flex flex-col items-center justify-center">
            <div className="w-12 h-12 border border-gold flex items-center justify-center mb-6 bg-white">
              <Sparkles className="w-5 h-5 text-gold" />
            </div>
            <h3 className="font-serif text-2xl md:text-3xl text-gold uppercase tracking-luxury font-normal">
              ATELIER CURATION IN PROGRESS
            </h3>
            <p className="mt-4 text-xs uppercase tracking-luxury text-gold/80 max-w-lg font-light leading-relaxed">
              Our master tailors and artisans are finalizing the forthcoming limited release. New editions will appear here upon publication.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
              <Link
                href="/exclusive"
                className="px-6 py-2.5 border border-gold bg-gold text-white text-xs uppercase tracking-luxury hover:bg-white hover:text-gold transition-colors font-medium"
              >
                REQUEST EXCLUSIVE ACCESS
              </Link>
              <Link
                href="/collections"
                className="px-6 py-2.5 border border-gold bg-white text-gold text-xs uppercase tracking-luxury hover:bg-cream transition-colors font-medium"
              >
                BROWSE ARCHIVES
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

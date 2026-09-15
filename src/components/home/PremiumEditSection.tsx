import React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";

interface PremiumEditSectionProps {
  content?: {
    highlightText?: string;
  };
}

export const PremiumEditSection: React.FC<PremiumEditSectionProps> = ({ content }) => {
  const highlight =
    content?.highlightText ||
    "Crafted strictly in three timeless tones: Pure Black, Charcoal Grey, and Champagne Luxury Gold.";

  return (
    <section className="bg-cream py-20 md:py-28 px-4 sm:px-6 lg:px-8 border-b border-gold/20">
      <div className="max-w-4xl mx-auto text-center border border-gold/30 p-8 sm:p-12 md:p-16 bg-white shadow-sm">
        <span className="text-[10px] tracking-ultra uppercase text-gold/70 font-serif block mb-3">
          DISCIPLINE & RESTRAINT
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl text-gold uppercase tracking-luxury font-normal leading-snug">
          THE PREMIUM EDIT
        </h2>
        <div className="w-12 h-[1px] bg-gold mx-auto my-6" />
        <p className="font-serif italic text-lg sm:text-xl text-gold/90 max-w-xl mx-auto leading-relaxed">
          "{highlight}"
        </p>
        <p className="mt-4 text-xs uppercase tracking-luxury text-gold/70 max-w-md mx-auto font-light">
          DISCIPLINED HARMONY OF PURE BLACK, CHARCOAL GREY, AND LUXURY GOLD.
        </p>

        <div className="mt-8">
          <Link
            href="/collections"
            className="px-6 py-2.5 border border-gold bg-cream text-gold text-xs uppercase tracking-luxury hover:bg-gold hover:text-white transition-colors inline-flex items-center gap-2 font-medium"
          >
            <span>DISCOVER THE PALETTE</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

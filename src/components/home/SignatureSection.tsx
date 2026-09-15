import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

interface SignatureSectionProps {
  content?: {
    title?: string;
    description?: string;
    ctaText?: string;
    ctaUrl?: string;
  };
}

export const SignatureSection: React.FC<SignatureSectionProps> = ({ content }) => {
  const title = content?.title || "THE GOLDEN SIGNATURE";
  const description =
    content?.description ||
    "An uncompromising collection forged for those who understand that less is infinitely more.";
  const ctaText = content?.ctaText || "VIEW SIGNATURE";
  const ctaUrl = content?.ctaUrl || "/collections";

  return (
    <section className="bg-cream py-20 md:py-28 px-4 sm:px-6 lg:px-8 border-b border-gold/20">
      <div className="max-w-6xl mx-auto border border-gold/40 p-8 sm:p-12 md:p-16 bg-white relative overflow-hidden">
        {/* Subtle geometric background */}
        <div className="absolute top-0 right-0 w-96 h-96 border-b border-l border-gold/10 pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 text-gold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="text-[10px] tracking-ultra uppercase">MAHALEELA SIGNATURE</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-gold uppercase tracking-luxury font-normal leading-tight">
            {title}
          </h2>

          <p className="mt-4 text-xs sm:text-sm uppercase tracking-luxury text-gold/80 font-light leading-relaxed">
            {description}
          </p>

          <div className="mt-8">
            <Link
              href={ctaUrl}
              className="px-6 py-3 border border-gold bg-gold text-white text-xs uppercase tracking-luxury hover:bg-white hover:text-gold transition-colors inline-flex items-center gap-2 font-medium"
            >
              <span>{ctaText}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

import React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";

interface ExclusiveSectionProps {
  content?: {
    headline?: string;
    subtext?: string;
    ctaText?: string;
    ctaUrl?: string;
  };
}

export const ExclusiveSection: React.FC<ExclusiveSectionProps> = ({ content }) => {
  const headline = content?.headline || "PRIVATE CLIENT SALON";
  const subtext =
    content?.subtext ||
    "Gain access to limited allocation pieces, bespoke concierge sizing, and private atelier showings.";
  const ctaText = content?.ctaText || "JOIN EXCLUSIVE";
  const ctaUrl = content?.ctaUrl || "/exclusive/join";

  return (
    <section className="bg-white py-20 md:py-32 px-4 sm:px-6 lg:px-8 border-b border-gold/20">
      <div className="max-w-5xl mx-auto border-2 border-gold p-8 sm:p-14 md:p-20 bg-cream text-center relative overflow-hidden">
        {/* Subtle geometric framing */}
        <div className="absolute inset-2 border border-gold/40 pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 border border-gold/40 bg-white mb-6">
            <Sparkles className="w-3.5 h-3.5 text-gold" />
            <span className="text-[10px] tracking-ultra uppercase text-gold font-medium">
              PRIVILEGED ACCESS
            </span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl text-gold uppercase tracking-luxury font-normal leading-tight">
            {headline}
          </h2>

          <p className="mt-6 text-xs sm:text-sm uppercase tracking-luxury text-gold/80 font-light leading-relaxed">
            {subtext}
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href={ctaUrl}
              className="px-8 py-3.5 border border-gold bg-gold text-white text-xs uppercase tracking-luxury hover:bg-white hover:text-gold transition-colors font-medium inline-flex items-center gap-2"
            >
              <span>{ctaText}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/exclusive"
              className="px-8 py-3.5 border border-gold bg-white text-gold text-xs uppercase tracking-luxury hover:bg-cream transition-colors font-medium"
            >
              SALON OVERVIEW
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";

interface HeroSectionProps {
  content?: {
    headline?: string;
    subheading?: string;
    ctaPrimaryText?: string;
    ctaPrimaryUrl?: string;
    ctaSecondaryText?: string;
    ctaSecondaryUrl?: string;
    imageDesktop?: string;
    imageMobile?: string;
  };
}

export const HeroSection: React.FC<HeroSectionProps> = ({ content }) => {
  const headline = content?.headline || "A NEW LANGUAGE OF STYLE.";
  const subheading = content?.subheading || "DISCOVER THE WORLD OF MAHALEELA.";
  const ctaPrimaryText = content?.ctaPrimaryText || "EXPLORE ATELIER";
  const ctaPrimaryUrl = content?.ctaPrimaryUrl || "/collections";
  const ctaSecondaryText = content?.ctaSecondaryText || "EXCLUSIVE ACCESS";
  const ctaSecondaryUrl = content?.ctaSecondaryUrl || "/exclusive";

  return (
    <section className="relative w-full min-h-[85vh] flex items-center justify-center bg-white border-b border-gold/20 overflow-hidden py-16 md:py-24">
      {/* Background Architectural Geometry in strict Cream */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-40">
        <div className="w-[600px] h-[600px] md:w-[800px] md:h-[800px] border border-gold/30 rounded-full" />
        <div className="absolute w-[400px] h-[400px] md:w-[600px] md:h-[600px] border border-gold/20" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center flex flex-col items-center">
        {/* Supplied Official Logo Crest */}
        <div className="w-24 h-24 md:w-32 md:h-32 border border-gold/40 p-2 bg-cream/60 backdrop-blur-sm mb-6 flex items-center justify-center">
          <Image
            src="/assets/mahaleela-logo.jpg"
            alt="MAHALEELA Official Crest"
            width={112}
            height={112}
            className="object-contain"
            priority
          />
        </div>

        {/* Brand Tag & Typography */}
        <div className="inline-flex items-center gap-2 px-3 py-1 border border-gold/30 bg-cream mb-4">
          <Sparkles className="w-3 h-3 text-gold" />
          <span className="text-[10px] tracking-ultra uppercase text-gold">
            HAUTE COUTURE & LUXURY GOODS
          </span>
        </div>

        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-luxury text-gold uppercase font-normal max-w-4xl leading-tight">
          {headline}
        </h1>

        <p className="mt-6 text-xs sm:text-sm md:text-base tracking-luxury text-gold/80 uppercase max-w-xl font-light">
          {subheading}
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
          <Link
            href={ctaPrimaryUrl}
            className="px-8 py-3.5 border border-gold bg-gold text-white text-xs uppercase tracking-luxury hover:bg-white hover:text-gold transition-all duration-300 inline-flex items-center gap-2 font-medium"
          >
            <span>{ctaPrimaryText}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            href={ctaSecondaryUrl}
            className="px-8 py-3.5 border border-gold bg-cream text-gold text-xs uppercase tracking-luxury hover:bg-gold hover:text-white transition-all duration-300 font-medium"
          >
            {ctaSecondaryText}
          </Link>
        </div>

        {/* Editorial Footnote */}
        <div className="mt-16 pt-6 border-t border-gold/20 flex items-center justify-center gap-8 text-[10px] tracking-ultra uppercase text-gold/70">
          <span>CURATED SILHOUETTES</span>
          <span>•</span>
          <span>DISCREET CRAFTSMANSHIP</span>
          <span>•</span>
          <span>PAN-INDIA DISPATCH</span>
        </div>
      </div>
    </section>
  );
};

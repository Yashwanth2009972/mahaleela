import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

interface EditorialStoryProps {
  content?: {
    heading?: string;
    quote?: string;
    ctaText?: string;
    ctaUrl?: string;
    imagePrimary?: string;
    imageSecondary?: string;
  };
}

export const EditorialStorySection: React.FC<EditorialStoryProps> = ({ content }) => {
  const heading = content?.heading || "A REFINED FORM OF EXPRESSION";
  const quote =
    content?.quote ||
    "True luxury never shouts. It lingers in the geometry of a cut, the weight of the fabric, and the warmth of subtle gold.";
  const ctaText = content?.ctaText || "EXPLORE THE ARCHIVE";
  const ctaUrl = content?.ctaUrl || "/collections";

  return (
    <section className="bg-white py-20 md:py-32 px-4 sm:px-6 lg:px-8 border-b border-gold/20 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Asymmetrical Editorial Composition (Left) */}
          <div className="lg:col-span-7 relative">
            <div className="relative w-full aspect-[4/5] bg-cream border border-gold/30 p-4 md:p-8 flex flex-col justify-between">
              <div className="flex justify-between items-start text-[10px] tracking-ultra uppercase text-gold">
                <span>VOL. 01 / ED. 26</span>
                <span>MAHALEELA MONOGRAPH</span>
              </div>
              
              <div className="my-auto flex flex-col items-center text-center p-6 border border-gold/20 bg-white/70">
                <div className="w-16 h-16 border border-gold/40 p-2 mb-4 bg-white">
                  <Image
                    src="/assets/mahaleela-logo.jpg"
                    alt="MAHALEELA Emblem"
                    width={64}
                    height={64}
                    className="object-contain"
                  />
                </div>
                <h3 className="font-serif text-xl sm:text-2xl text-gold uppercase tracking-luxury">
                  ARCHITECTURAL MINIMALISM
                </h3>
                <p className="text-xs uppercase tracking-wider text-gold/70 mt-2 max-w-sm">
                  Precision tailoring harmonized with understated gold accents.
                </p>
              </div>

              <div className="text-[9px] tracking-widest text-gold/60 uppercase text-right">
                CHIKKABANAVARA ATELIER • BENGALURU
              </div>
            </div>

            {/* Overlapping Secondary Geometric Accent Panel */}
            <div className="hidden sm:block absolute -bottom-6 -right-6 w-48 h-56 bg-cream border border-gold p-4 shadow-sm z-10">
              <div className="w-full h-full border border-gold/30 flex flex-col items-center justify-center p-3 text-center">
                <span className="font-serif text-xs uppercase tracking-luxury text-gold">
                  MAHALEELA
                </span>
                <span className="text-[8px] uppercase tracking-widest text-gold/70 mt-1">
                  100% DISCREET LUXURY
                </span>
              </div>
            </div>
          </div>

          {/* Editorial Discourse Text (Right) */}
          <div className="lg:col-span-5 lg:pl-8 flex flex-col items-start">
            <span className="text-[10px] tracking-ultra uppercase text-gold/70 font-serif mb-3">
              EDITORIAL DISCOURSE
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-gold uppercase tracking-luxury font-normal leading-tight">
              {heading}
            </h2>
            <div className="w-12 h-[1px] bg-gold my-6" />
            <blockquote className="font-serif italic text-base sm:text-lg text-gold/90 leading-relaxed">
              "{quote}"
            </blockquote>
            <p className="mt-6 text-xs uppercase tracking-luxury text-gold/70 leading-relaxed font-light">
              MAHALEELA discards seasonal ephemera in pursuit of singular permanence. Each piece is designed as an enduring architectural artifact for your wardrobe.
            </p>

            <Link
              href={ctaUrl}
              className="mt-8 px-6 py-3 border border-gold bg-cream text-gold text-xs uppercase tracking-luxury hover:bg-gold hover:text-white transition-all inline-flex items-center gap-2 font-medium"
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

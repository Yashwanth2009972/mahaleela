"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

interface HeroBannerProps {
  banner?: {
    desktopImage: string;
    mobileImage?: string | null;
    headline?: string | null;
    subtitle?: string | null;
    ctaText?: string | null;
    ctaUrl?: string | null;
  } | null;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ banner }) => {
  // If no custom banner uploaded, display the refined luxury default hero
  if (!banner) {
    return (
      <section className="relative w-full bg-black border-b border-gold/30 overflow-hidden">
        {/* Desktop 21:9 Ultra-Wide Default Hero */}
        <div className="hidden md:flex relative w-full aspect-[21/9] items-center justify-center p-8 text-center bg-black">
          <div className="absolute inset-0 bg-[radial-gradient(#1E1E1E_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />
          <div className="relative z-10 max-w-4xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 border border-gold/40 bg-cream text-gold text-[10px] tracking-ultra uppercase font-semibold">
              <Sparkles className="w-3 h-3 text-gold" />
              <span>MAHALEELA ATELIER • HAUTE COUTURE & LUXURY GOODS</span>
            </div>
            <h1 className="font-serif text-4xl lg:text-6xl text-gold uppercase tracking-luxury font-normal leading-none">
              WHERE STYLE BECOMES EXPRESSION
            </h1>
            <p className="text-xs lg:text-sm uppercase tracking-ultra text-gold/80 max-w-xl mx-auto font-light">
              CURATED SILHOUETTES CRAFTED STRICTLY IN PURE BLACK, CHARCOAL GREY, AND LUXURY GOLD.
            </p>
            <div className="pt-2">
              <a
                href="#catalogue"
                className="px-8 py-3.5 border border-gold bg-gold text-black text-xs uppercase tracking-luxury font-bold hover:bg-black hover:text-gold transition-all duration-300 inline-flex items-center gap-2"
              >
                <span>EXPLORE CATALOGUE</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Mobile 9:16 Vertical Default Hero */}
        <div className="flex md:hidden relative w-full aspect-[9/16] items-center justify-center p-6 text-center bg-black">
          <div className="absolute inset-0 bg-[radial-gradient(#1E1E1E_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />
          <div className="relative z-10 space-y-5 max-w-xs mx-auto">
            <div className="w-24 h-24 mx-auto border border-gold/40 p-2 bg-cream flex items-center justify-center">
              <img
                src="/assets/mahaleela-logo.jpg"
                alt="MAHALEELA"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="inline-block px-3 py-1 border border-gold/40 bg-cream text-gold text-[9px] tracking-ultra uppercase font-semibold">
              WHERE STYLE BECOMES EXPRESSION
            </span>
            <h1 className="font-serif text-2xl text-gold uppercase tracking-luxury font-normal leading-snug">
              MAHALEELA
            </h1>
            <p className="text-[10px] uppercase tracking-ultra text-gold/80 font-light">
              HAUTE COUTURE & PRIVATE ACCESS ALLOCATIONS
            </p>
            <div>
              <a
                href="#catalogue"
                className="w-full py-3.5 border border-gold bg-gold text-black text-xs uppercase tracking-luxury font-bold hover:bg-black hover:text-gold transition-colors inline-flex items-center justify-center gap-2"
              >
                <span>SHOP ALL PIECES</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const ctaTarget = banner.ctaUrl || "#catalogue";

  return (
    <section className="relative w-full bg-black border-b border-gold/30 overflow-hidden">
      {/* DESKTOP HERO BANNER: STRICT 21:9 ULTRA-WIDE RATIO */}
      <div className="hidden md:block relative w-full aspect-[21/9] overflow-hidden group">
        <img
          src={banner.desktopImage}
          alt={banner.headline || "MAHALEELA Hero Banner"}
          className="w-full h-full object-cover object-center"
        />
        {(banner.headline || banner.subtitle || banner.ctaText) && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end p-8 lg:p-14">
            <div className="max-w-2xl space-y-3">
              {banner.subtitle && (
                <span className="text-[10px] uppercase tracking-ultra text-gold font-serif block">
                  {banner.subtitle}
                </span>
              )}
              {banner.headline && (
                <h2 className="font-serif text-3xl lg:text-5xl text-gold uppercase tracking-luxury leading-tight">
                  {banner.headline}
                </h2>
              )}
              {banner.ctaText && (
                <div className="pt-2">
                  <a
                    href={ctaTarget}
                    className="px-8 py-3.5 border border-gold bg-gold text-black text-xs uppercase tracking-luxury font-bold hover:bg-black hover:text-gold transition-all duration-300 inline-flex items-center gap-2"
                  >
                    <span>{banner.ctaText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* MOBILE HERO BANNER: STRICT 9:16 FULL VERTICAL RATIO */}
      <div className="block md:hidden relative w-full aspect-[9/16] overflow-hidden">
        <img
          src={banner.mobileImage || banner.desktopImage}
          alt={banner.headline || "MAHALEELA Mobile Banner"}
          className="w-full h-full object-cover object-center"
        />
        {(banner.headline || banner.subtitle || banner.ctaText) && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex items-end p-6">
            <div className="w-full space-y-3 text-center pb-4">
              {banner.subtitle && (
                <span className="text-[9px] uppercase tracking-ultra text-gold font-serif block">
                  {banner.subtitle}
                </span>
              )}
              {banner.headline && (
                <h2 className="font-serif text-2xl text-gold uppercase tracking-luxury leading-snug">
                  {banner.headline}
                </h2>
              )}
              {banner.ctaText && (
                <div className="pt-2">
                  <a
                    href={ctaTarget}
                    className="w-full py-3.5 border border-gold bg-gold text-black text-xs uppercase tracking-luxury font-bold hover:bg-black hover:text-gold transition-colors inline-flex items-center justify-center gap-2"
                  >
                    <span>{banner.ctaText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

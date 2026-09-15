"use client";

import React from "react";
import { Sparkles, Instagram } from "lucide-react";
import { BRAND } from "@/lib/constants";

interface PhotoGallerySectionProps {
  items: { id: string; url: string; title?: string | null; subtitle?: string | null }[];
}

export const PhotoGallerySection: React.FC<PhotoGallerySectionProps> = ({ items }) => {
  // If no items uploaded, provide 4 default editorial placeholder cards in 9:16 ratio
  const displayItems = items.length > 0 ? items : [
    { id: "1", url: "/assets/mahaleela-logo.jpg", title: "HAUTE COUTURE", subtitle: "AUTUMN / WINTER" },
    { id: "2", url: "/assets/mahaleela-logo.jpg", title: "ATELIER PERSPECTIVE", subtitle: "EDITION VII" },
    { id: "3", url: "/assets/mahaleela-logo.jpg", title: "ARCHITECTURAL FIT", subtitle: "SILHOUETTE 01" },
    { id: "4", url: "/assets/mahaleela-logo.jpg", title: "MONOCHROME ESSENCE", subtitle: "LOOKBOOK" },
  ];

  return (
    <section className="w-full bg-black py-16 border-t border-gold/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-gold/20 pb-4">
          <div>
            <span className="text-[10px] uppercase tracking-ultra text-gold/70 font-serif block mb-1">
              VISUAL REEL ARCHIVE (9:16)
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-gold uppercase tracking-luxury font-normal">
              ATELIER PHOTO GALLERY
            </h2>
          </div>
          <a
            href={BRAND.socials.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs uppercase tracking-luxury text-gold underline hover:opacity-80 inline-flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Instagram className="w-3.5 h-3.5" />
            <span>FOLLOW @MAHALEELAFASHION</span>
          </a>
        </div>

        {/* 9:16 Aspect Ratio Photo Grid / Horizontal Carousel */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 sm:gap-6">
          {displayItems.map((item) => (
            <div
              key={item.id}
              className="relative aspect-[9/16] border border-gold/30 bg-cream overflow-hidden group flex flex-col justify-end shadow-lg"
            >
              <img
                src={item.url}
                alt={item.title || "MAHALEELA Lookbook"}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
              <div className="relative z-10 p-4 space-y-1">
                <span className="text-[8px] uppercase tracking-ultra text-gold/80 block font-serif">
                  {item.subtitle || "MAHALEELA SOCIETY"}
                </span>
                <p className="font-serif text-xs sm:text-sm text-gold uppercase tracking-wider font-semibold">
                  {item.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

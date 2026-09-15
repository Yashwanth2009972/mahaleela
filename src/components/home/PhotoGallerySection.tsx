"use client";

import React from "react";
import { Instagram } from "lucide-react";
import { BRAND } from "@/lib/constants";

interface PhotoGallerySectionProps {
  items: { id: string; url: string }[];
}

export const PhotoGallerySection: React.FC<PhotoGallerySectionProps> = ({ items }) => {
  const displayItems = items.length > 0 ? items : [
    { id: "1", url: "/assets/mahaleela-logo.jpg" },
    { id: "2", url: "/assets/mahaleela-logo.jpg" },
    { id: "3", url: "/assets/mahaleela-logo.jpg" },
    { id: "4", url: "/assets/mahaleela-logo.jpg" },
  ];

  return (
    <section className="w-full bg-black py-14 border-t border-gold/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-gold/20 pb-4">
          <div>
            <span className="text-[10px] uppercase tracking-ultra text-gold/70 font-serif block mb-1">
              9:16 VERTICAL GALLERY
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

        {/* 9:16 Aspect Ratio Photo Grid — Pure visual photos, no text overlays */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
          {displayItems.map((item) => (
            <div
              key={item.id}
              className="relative aspect-[9/16] border border-gold/30 bg-black overflow-hidden group shadow-lg"
            >
              <img
                src={item.url}
                alt="MAHALEELA Gallery Photo"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
"use client";

import React, { useRef } from "react";
import { Instagram, ChevronLeft, ChevronRight } from "lucide-react";
import { BRAND } from "@/lib/constants";

interface PhotoGallerySectionProps {
  items: { id: string; url: string }[];
}

export const PhotoGallerySection: React.FC<PhotoGallerySectionProps> = ({ items }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const displayItems = items.length > 0 ? items : [
    { id: "1", url: "/assets/mahaleela-logo.jpg" },
    { id: "2", url: "/assets/mahaleela-logo.jpg" },
    { id: "3", url: "/assets/mahaleela-logo.jpg" },
    { id: "4", url: "/assets/mahaleela-logo.jpg" },
    { id: "5", url: "/assets/mahaleela-logo.jpg" },
    { id: "6", url: "/assets/mahaleela-logo.jpg" },
  ];

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -300 : 300;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section className="w-full bg-black py-14 border-t border-gold/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header with Title and Scroll Controls */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-gold/20 pb-4">
          <div>
            <span className="text-[10px] uppercase tracking-ultra text-gold/70 font-serif block mb-1">
              9:16 VERTICAL ARCHIVE
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-gold uppercase tracking-luxury font-normal">
              ATELIER PHOTO GALLERY
            </h2>
          </div>

          <div className="flex items-center gap-4 self-start sm:self-auto">
            <a
              href={BRAND.socials.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs uppercase tracking-luxury text-gold underline hover:opacity-80 inline-flex items-center gap-1.5"
            >
              <Instagram className="w-3.5 h-3.5" />
              <span>FOLLOW @MAHALEELAFASHION</span>
            </a>

            {/* Desktop Left/Right Navigation Arrows */}
            <div className="hidden sm:flex items-center gap-2 pl-4 border-l border-gold/30">
              <button
                type="button"
                onClick={() => scroll("left")}
                aria-label="Scroll gallery left"
                className="w-8 h-8 border border-gold/40 text-gold flex items-center justify-center hover:bg-gold hover:text-black transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => scroll("right")}
                aria-label="Scroll gallery right"
                className="w-8 h-8 border border-gold/40 text-gold flex items-center justify-center hover:bg-gold hover:text-black transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 9:16 Horizontally Scrolling Photo Carousel */}
        <div
          ref={scrollRef}
          className="flex overflow-x-auto gap-4 sm:gap-6 pb-4 snap-x snap-mandatory scroll-smooth"
          style={{ scrollbarWidth: "thin", scrollbarColor: "#C9A45C transparent" }}
        >
          {displayItems.map((item) => (
            <div
              key={item.id}
              className="relative w-[200px] sm:w-[240px] md:w-[270px] aspect-[9/16] flex-shrink-0 snap-start border border-gold/30 bg-black overflow-hidden group shadow-xl"
            >
              <img
                src={item.url}
                alt="MAHALEELA Gallery"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
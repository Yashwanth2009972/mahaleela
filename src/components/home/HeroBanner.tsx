"use client";

import React from "react";

interface HeroBannerProps {
  banner?: {
    desktopImage: string;
    mobileImage?: string | null;
  } | null;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ banner }) => {
  const desktopImg = banner?.desktopImage || "/assets/mahaleela-logo.jpg";
  const mobileImg = banner?.mobileImage || banner?.desktopImage || "/assets/mahaleela-logo.jpg";

  return (
    <section className="relative w-full bg-black border-b border-gold/30 overflow-hidden">
      {/* DESKTOP HERO BANNER: STRICT 21:9 ULTRA-WIDE RATIO — PURE VISUAL (NO TEXT) */}
      <div className="hidden md:block relative w-full aspect-[21/9] overflow-hidden bg-black">
        <img
          src={desktopImg}
          alt="MAHALEELA Banner"
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* MOBILE HERO BANNER: STRICT 9:16 FULL VERTICAL RATIO — PURE VISUAL (NO TEXT) */}
      <div className="block md:hidden relative w-full aspect-[9/16] overflow-hidden bg-black">
        <img
          src={mobileImg}
          alt="MAHALEELA Banner"
          className="w-full h-full object-cover object-center"
        />
      </div>
    </section>
  );
};
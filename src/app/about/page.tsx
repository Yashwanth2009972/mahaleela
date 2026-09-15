import React from "react";
import Image from "next/image";
import { BRAND } from "@/lib/constants";

export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen py-16 md:py-24 px-4 sm:px-6 lg:px-8 border-b border-gold/20">
      <div className="max-w-4xl mx-auto">
        <div className="border-b border-gold/20 pb-6 mb-12 text-center">
          <span className="text-[10px] uppercase tracking-ultra text-gold/70 font-serif block mb-2">
            THE MAISON
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl text-gold uppercase tracking-luxury font-normal">
            ABOUT MAHALEELA
          </h1>
          <p className="text-xs uppercase tracking-luxury text-gold/80 mt-2">
            WHERE STYLE BECOMES EXPRESSION
          </p>
        </div>

        <div className="border border-gold/30 bg-cream p-8 sm:p-14 space-y-8 text-xs uppercase tracking-luxury text-gold leading-relaxed text-center">
          <div className="w-24 h-24 mx-auto border border-gold p-2 bg-white overflow-hidden mb-6">
            <Image
              src="/assets/mahaleela-logo.jpg"
              alt="MAHALEELA"
              width={96}
              height={96}
              className="object-contain"
            />
          </div>

          <h2 className="font-serif text-2xl text-gold uppercase tracking-luxury">
            ARCHITECTURAL PURITY & TIMELESS CRAFT
          </h2>

          <p className="max-w-2xl mx-auto font-light leading-loose">
            MAHALEELA is an international luxury fashion maison forged in Bengaluru, India. We design for those who recognize that true elegance is articulated in quiet luxury, architectural lines, and immaculate materials.
          </p>

          <p className="max-w-2xl mx-auto font-light leading-loose">
            Our creative palette is intentionally restrained to three sovereign tones: Pure White for space and clarity, Warm Cream for depth and tactile warmth, and Luxury Gold for royal accent and enduring precision.
          </p>

          <div className="border-t border-gold/20 pt-8 mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <span className="font-serif text-sm font-bold block">BENGALURU ATELIER</span>
              <span className="text-[10px] text-gold/70 mt-1 block">HEADQUARTERS & WORKSHOP</span>
            </div>
            <div>
              <span className="font-serif text-sm font-bold block">ALL INDIA DISPATCH</span>
              <span className="text-[10px] text-gold/70 mt-1 block">DOORSTEP WHITE-GLOVE SERVICE</span>
            </div>
            <div>
              <span className="font-serif text-sm font-bold block">EXCLUSIVE ALLOCATIONS</span>
              <span className="text-[10px] text-gold/70 mt-1 block">LIMITED INDIVIDUALLY NUMBERED</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

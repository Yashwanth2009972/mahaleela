import React from "react";
import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  variant?: "header" | "footer" | "hero" | "admin";
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ variant = "header", className = "" }) => {
  if (variant === "header") {
    return (
      <Link href="/" className={`inline-flex flex-col items-center group ${className}`}>
        <div className="relative w-10 h-10 overflow-hidden">
          <Image
            src="/assets/mahaleela-logo.jpg"
            alt="MAHALEELA Emblem"
            width={40}
            height={40}
            className="object-contain transform transition-transform duration-500 group-hover:scale-105"
            priority
          />
        </div>
        <span className="font-serif tracking-ultra text-sm md:text-base text-gold uppercase mt-1 font-semibold">
          MAHALEELA
        </span>
      </Link>
    );
  }

  if (variant === "footer") {
    return (
      <Link href="/" className={`inline-flex flex-col items-center group ${className}`}>
        <div className="relative w-16 h-16 overflow-hidden border border-gold p-1 bg-white">
          <Image
            src="/assets/mahaleela-logo.jpg"
            alt="MAHALEELA"
            width={64}
            height={64}
            className="object-contain"
          />
        </div>
        <span className="font-serif tracking-ultra text-xl md:text-2xl text-gold uppercase mt-3 font-semibold">
          MAHALEELA
        </span>
        <span className="text-[10px] tracking-widest text-gold/80 mt-1 uppercase">
          WHERE STYLE BECOMES EXPRESSION
        </span>
      </Link>
    );
  }

  if (variant === "hero") {
    return (
      <div className={`flex flex-col items-center text-center ${className}`}>
        <div className="relative w-28 h-28 md:w-36 md:h-36 overflow-hidden border border-gold/40 p-2 bg-white/90 backdrop-blur-sm">
          <Image
            src="/assets/mahaleela-logo.jpg"
            alt="MAHALEELA"
            width={144}
            height={144}
            className="object-contain"
            priority
          />
        </div>
        <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl tracking-ultra text-gold uppercase mt-6 font-normal">
          MAHALEELA
        </h1>
        <p className="text-xs md:text-sm tracking-luxury text-gold uppercase mt-2">
          WHERE STYLE BECOMES EXPRESSION
        </p>
      </div>
    );
  }

  // Admin variant
  return (
    <Link href="/admin" className={`inline-flex items-center gap-3 ${className}`}>
      <div className="relative w-8 h-8 overflow-hidden border border-gold bg-white">
        <Image
          src="/assets/mahaleela-logo.jpg"
          alt="MAHALEELA"
          width={32}
          height={32}
          className="object-contain"
        />
      </div>
      <div className="flex flex-col">
        <span className="font-serif tracking-widest text-sm text-gold uppercase font-semibold">
          MAHALEELA
        </span>
        <span className="text-[9px] tracking-widest text-gold/70 uppercase">
          ATELIER CMS
        </span>
      </div>
    </Link>
  );
};

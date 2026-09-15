import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Sparkles, Edit3, Layers, Copy, Plus, ExternalLink, Image as ImageIcon } from "lucide-react";
import { VisualAssetClient } from "./VisualAssetClient";

export const dynamic = "force-dynamic";

export default async function VisualAssetsPage() {
  const [templates, brandAssets] = await Promise.all([
    prisma.visualTemplate.findMany({
      orderBy: { name: "asc" },
    }),
    prisma.visualAsset.findMany({
      orderBy: { createdAt: "asc" },
    }),
  ]);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="border border-gold/30 bg-cream p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-gold" />
            <span className="text-[10px] uppercase tracking-ultra text-gold/70 font-serif">
              ATELIER DESIGN SUITE
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl text-gold uppercase tracking-luxury font-normal">
            VISUAL ASSET SYSTEM & TEMPLATES ({templates.length})
          </h1>
          <p className="text-xs uppercase tracking-luxury text-gold/80 mt-1">
            REUSABLE SOCIAL TEMPLATES, EDITORIAL REEL COVERS, CAMPAIGNS, AND BRAND ASSETS
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/visual-assets/editor"
            className="px-6 py-3 border border-gold bg-gold text-white text-xs uppercase tracking-luxury hover:bg-white hover:text-gold transition-colors font-medium flex items-center gap-2"
          >
            <Edit3 className="w-4 h-4" />
            <span>OPEN TEMPLATE EDITOR</span>
          </Link>
        </div>
      </div>

      {/* Brand Asset Library Bar (Official Colors & Logo) */}
      <div className="border border-gold/30 bg-white p-6">
        <h2 className="font-serif text-sm uppercase tracking-luxury text-gold font-semibold mb-4 border-b border-gold/20 pb-2">
          OFFICIAL BRAND IDENTITY RULES
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Colors */}
          <div className="border border-gold/20 bg-cream p-4">
            <span className="text-[9px] uppercase tracking-ultra text-gold/70 block mb-2">
              STRICT 3-COLOUR MATRIX
            </span>
            <div className="grid grid-cols-3 gap-2 text-center text-[10px] uppercase tracking-wider text-gold font-medium">
              <div className="p-3 bg-white border border-gold/30">
                <span>BLACK</span>
                <span className="block text-[8px] opacity-70">#000000</span>
              </div>
              <div className="p-3 bg-cream border border-gold/40">
                <span>CHARCOAL GREY</span>
                <span className="block text-[8px] opacity-70">#1E1E1E</span>
              </div>
              <div className="p-3 bg-gold text-white border border-gold">
                <span>GOLD</span>
                <span className="block text-[8px] opacity-90">#C9A45C</span>
              </div>
            </div>
          </div>

          {/* Typography */}
          <div className="border border-gold/20 bg-cream p-4">
            <span className="text-[9px] uppercase tracking-ultra text-gold/70 block mb-1">
              TYPOGRAPHY ARCHITECTURE
            </span>
            <p className="font-serif text-base text-gold font-bold">
              CINZEL / PLAYFAIR
            </p>
            <p className="text-[10px] uppercase tracking-luxury text-gold/80 mt-1">
              HEADLINES, COVERS, CAMPAIGN TITLES
            </p>
            <p className="text-xs uppercase tracking-widest text-gold mt-2 font-medium">
              MONTSERRAT � SANS-SERIF
            </p>
            <p className="text-[9px] uppercase tracking-luxury text-gold/70">
              NAVIGATION, BODY, PRICING, FORMS
            </p>
          </div>

          {/* Logo Asset Protection */}
          <div className="border border-gold/20 bg-cream p-4 flex items-center gap-4">
            <div className="w-16 h-16 bg-white border border-gold p-1 shrink-0 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/mahaleela-logo.jpg" alt="Official Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <span className="text-[9px] uppercase tracking-ultra text-gold/70 block">
                OFFICIAL EMBLEM
              </span>
              <p className="font-serif text-xs uppercase tracking-luxury text-gold font-bold mt-0.5">
                MAHALEELA CREST
              </p>
              <p className="text-[9px] uppercase tracking-luxury text-gold/70 mt-1">
                UNALTERED � 1024 � 1024 RESOLUTION
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Template Browser Client Component */}
      <VisualAssetClient templates={templates} brandAssets={brandAssets} />
    </div>
  );
}

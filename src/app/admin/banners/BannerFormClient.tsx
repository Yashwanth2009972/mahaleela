"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Image as ImageIcon } from "lucide-react";

export function BannerFormClient({ initialBanners }: { initialBanners: any[] }) {
  const router = useRouter();
  const [banners, setBanners] = useState(initialBanners);
  const [headline, setHeadline] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [desktopImage, setDesktopImage] = useState("/assets/mahaleela-logo.jpg");
  const [ctaText, setCtaText] = useState("EXPLORE COLLECTION");
  const [ctaUrl, setCtaUrl] = useState("/#catalogue");
  const [priority, setPriority] = useState("1");
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);

    try {
      const res = await fetch("/api/admin/banners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          headline,
          subtitle,
          desktopImage,
          ctaText,
          ctaUrl,
          priority: Number(priority),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setBanners([...banners, data.banner]);
        setHeadline("");
        setSubtitle("");
        router.refresh();
      }
    } catch {} finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Existing Banners Table */}
      <div className="lg:col-span-7 border border-gold/30 bg-white p-6 shadow-sm overflow-x-auto">
        <h2 className="font-serif text-base text-gold uppercase tracking-luxury font-semibold border-b border-gold/20 pb-3 mb-4">
          ACTIVE BANNERS ({banners.length})
        </h2>
        {banners.length > 0 ? (
          <div className="space-y-4">
            {banners.map((b) => (
              <div key={b.id} className="border border-gold/20 bg-cream p-4 flex gap-4 items-center">
                <div className="w-16 h-12 bg-white border border-gold/30 shrink-0 overflow-hidden flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={b.desktopImage} alt={b.headline || "Banner"} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-serif font-bold text-xs uppercase tracking-luxury text-gold truncate">
                    {b.headline || "UNTITLED BANNER"}
                  </p>
                  <p className="text-[10px] uppercase text-gold/70 mt-0.5">{b.subtitle || b.ctaText}</p>
                  <span className="text-[9px] text-gold/60">PRIORITY: {b.priority}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gold/70 py-6 text-center">NO CMS BANNERS CREATED YET.</p>
        )}
      </div>

      {/* New Banner Form */}
      <div className="lg:col-span-5 border border-gold/30 bg-cream p-6 shadow-sm">
        <h2 className="font-serif text-base text-gold uppercase tracking-luxury font-semibold border-b border-gold/20 pb-3 mb-4">
          CREATE EDITORIAL BANNER
        </h2>
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-[10px] uppercase tracking-luxury text-gold mb-1">HEADLINE</label>
            <input
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="A NEW LANGUAGE OF STYLE"
              className="w-full bg-white border border-gold/40 px-3 py-2 text-xs uppercase text-gold focus:outline-none focus:border-gold font-serif"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-luxury text-gold mb-1">SUBTITLE</label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="DISCOVER THE WORLD OF MAHALEELA"
              className="w-full bg-white border border-gold/40 px-3 py-2 text-xs uppercase text-gold focus:outline-none focus:border-gold"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-luxury text-gold mb-1">IMAGE URL</label>
            <input
              type="text"
              value={desktopImage}
              onChange={(e) => setDesktopImage(e.target.value)}
              className="w-full bg-white border border-gold/40 px-3 py-2 text-xs text-gold focus:outline-none focus:border-gold font-mono"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] uppercase tracking-luxury text-gold mb-1">CTA TEXT</label>
              <input
                type="text"
                value={ctaText}
                onChange={(e) => setCtaText(e.target.value)}
                className="w-full bg-white border border-gold/40 px-3 py-2 text-xs uppercase text-gold focus:outline-none focus:border-gold"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-luxury text-gold mb-1">CTA URL</label>
              <input
                type="text"
                value={ctaUrl}
                onChange={(e) => setCtaUrl(e.target.value)}
                className="w-full bg-white border border-gold/40 px-3 py-2 text-xs text-gold focus:outline-none focus:border-gold"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isCreating}
            className="w-full py-3 border border-gold bg-gold text-white text-xs uppercase tracking-luxury hover:bg-white hover:text-gold transition-colors font-bold mt-2"
          >
            {isCreating ? "FORGING BANNER..." : "PUBLISH BANNER"}
          </button>
        </form>
      </div>
    </div>
  );
}

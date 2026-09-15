"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Eye, Check, Sparkles, Monitor, Smartphone, ArrowRight } from "lucide-react";
import { ImageDeviceUpload } from "./ImageDeviceUpload";

export function BannersManagerClient({ initialBanners }: { initialBanners: any[] }) {
  const router = useRouter();
  const [banners, setBanners] = useState(initialBanners);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [formData, setFormData] = useState({
    desktopImages: [] as string[],
    mobileImages: [] as string[],
    headline: "",
    subtitle: "",
    ctaText: "EXPLORE PIECES",
    ctaUrl: "/#catalogue",
    priority: "10",
    isActive: true,
  });

  const handleSaveBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (formData.desktopImages.length === 0) {
      setErrorMsg("Please upload a 21:9 desktop banner from your device.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/banners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          desktopImage: formData.desktopImages[0],
          mobileImage: formData.mobileImages[0] || formData.desktopImages[0],
          headline: formData.headline,
          subtitle: formData.subtitle,
          ctaText: formData.ctaText,
          ctaUrl: formData.ctaUrl,
          priority: Number(formData.priority) || 0,
          isActive: formData.isActive,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save banner.");

      setBanners([data.banner, ...banners]);
      setShowForm(false);
      setFormData({
        desktopImages: [],
        mobileImages: [],
        headline: "",
        subtitle: "",
        ctaText: "EXPLORE PIECES",
        ctaUrl: "/#catalogue",
        priority: "10",
        isActive: true,
      });
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to create banner.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteBanner = async (id: string) => {
    if (!confirm("Are you sure you want to remove this banner?")) return;
    try {
      await fetch(`/api/admin/banners?id=${id}`, { method: "DELETE" });
      setBanners(banners.filter((b) => b.id !== id));
      router.refresh();
    } catch {
      // error
    }
  };

  const handleToggleActive = async (banner: any) => {
    try {
      const updated = { ...banner, isActive: !banner.isActive };
      await fetch("/api/admin/banners", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      setBanners(banners.map((b) => (b.id === banner.id ? updated : b)));
      router.refresh();
    } catch {
      // error
    }
  };

  return (
    <div className="space-y-8">
      <div className="border border-gold/30 bg-cream p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-ultra text-gold/70 font-serif block mb-1">
            STOREFRONT PRESENTATION
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl text-gold uppercase tracking-luxury font-normal">
            HERO BANNERS ({banners.length})
          </h1>
          <p className="text-xs uppercase tracking-luxury text-gold/80 mt-1">
            SEPARATE 21:9 ULTRA-WIDE (DESKTOP) & 9:16 VERTICAL (MOBILE) BANNERS DIRECTLY UPLOADED FROM DEVICE
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="px-6 py-3 border border-gold bg-gold text-black text-xs uppercase tracking-luxury font-semibold hover:bg-black hover:text-gold transition-colors inline-flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>{showForm ? "CANCEL UPLOAD" : "UPLOAD NEW HERO BANNER"}</span>
        </button>
      </div>

      {/* Create New Banner Form */}
      {showForm && (
        <form
          onSubmit={handleSaveBanner}
          className="border border-gold bg-black p-6 sm:p-10 space-y-8 shadow-xl"
        >
          <div className="border-b border-gold/30 pb-4">
            <h2 className="font-serif text-xl text-gold uppercase tracking-luxury">
              DIRECT DEVICE BANNER UPLOADER
            </h2>
            <p className="text-xs uppercase tracking-wider text-gold/70 mt-1">
              SELECT AND UPLOAD ORIGINAL UNCOMPRESSED ASSETS FROM YOUR COMPUTER OR PHONE.
            </p>
          </div>

          {errorMsg && (
            <div className="p-4 border border-red-500 bg-red-950/30 text-red-300 text-xs uppercase tracking-wider">
              {errorMsg}
            </div>
          )}

          {/* Desktop 21:9 Banner Upload */}
          <div className="border border-gold/30 p-6 bg-cream/20 space-y-3">
            <div className="flex items-center gap-2 text-gold">
              <Monitor className="w-5 h-5" />
              <h3 className="font-serif text-sm uppercase tracking-luxury font-semibold">
                1. DESKTOP BANNER (21:9 ULTRA-WIDE RATIO) *
              </h3>
            </div>
            <p className="text-[10px] uppercase tracking-wider text-gold/70">
              OPTIMAL DIMENSIONS: 2560×1080 OR 3440×1440 (21:9). FULL HIGH-FIDELITY RESOLUTION SUPPORTED.
            </p>
            <ImageDeviceUpload
              images={formData.desktopImages}
              onChange={(imgs) => setFormData({ ...formData, desktopImages: imgs })}
              multiple={false}
              label="SELECT 21:9 DESKTOP ASSET"
              aspectHint="21:9 ULTRA-WIDE DESKTOP RATIO"
            />
          </div>

          {/* Mobile 9:16 Banner Upload */}
          <div className="border border-gold/30 p-6 bg-cream/20 space-y-3">
            <div className="flex items-center gap-2 text-gold">
              <Smartphone className="w-5 h-5" />
              <h3 className="font-serif text-sm uppercase tracking-luxury font-semibold">
                2. MOBILE BANNER (9:16 VERTICAL RATIO)
              </h3>
            </div>
            <p className="text-[10px] uppercase tracking-wider text-gold/70">
              OPTIMAL DIMENSIONS: 1080×1920 (9:16 VERTICAL). WILL DISPLAY ON ALL SMARTPHONES AND PORTRAIT SCREENS.
            </p>
            <ImageDeviceUpload
              images={formData.mobileImages}
              onChange={(imgs) => setFormData({ ...formData, mobileImages: imgs })}
              multiple={false}
              label="SELECT 9:16 MOBILE ASSET"
              aspectHint="9:16 FULL VERTICAL MOBILE RATIO"
            />
          </div>

          {/* Editorial Content Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-[11px] uppercase tracking-luxury text-gold mb-1">
                HEADLINE (OPTIONAL)
              </label>
              <input
                type="text"
                value={formData.headline}
                onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                placeholder="E.G. A NEW LANGUAGE OF STYLE"
                className="w-full bg-cream border border-gold/40 px-3 py-2 text-xs uppercase text-gold focus:outline-none focus:border-gold"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-luxury text-gold mb-1">
                SUBTITLE / COLLECTION TAG (OPTIONAL)
              </label>
              <input
                type="text"
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                placeholder="E.G. AUTUMN / WINTER 2026"
                className="w-full bg-cream border border-gold/40 px-3 py-2 text-xs uppercase text-gold focus:outline-none focus:border-gold"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-luxury text-gold mb-1">
                CALL TO ACTION BUTTON TEXT
              </label>
              <input
                type="text"
                value={formData.ctaText}
                onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                className="w-full bg-cream border border-gold/40 px-3 py-2 text-xs uppercase text-gold focus:outline-none focus:border-gold"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-luxury text-gold mb-1">
                CALL TO ACTION URL
              </label>
              <input
                type="text"
                value={formData.ctaUrl}
                onChange={(e) => setFormData({ ...formData, ctaUrl: e.target.value })}
                className="w-full bg-cream border border-gold/40 px-3 py-2 text-xs text-gold focus:outline-none focus:border-gold"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-luxury text-gold mb-1">
                PRIORITY ORDER (HIGHEST SHOWN FIRST)
              </label>
              <input
                type="number"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full bg-cream border border-gold/40 px-3 py-2 text-xs text-gold focus:outline-none focus:border-gold font-mono"
              />
            </div>

            <div className="flex items-center gap-3 pt-6">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-4 h-4 accent-gold"
              />
              <label htmlFor="isActive" className="text-xs uppercase tracking-luxury text-gold cursor-pointer">
                SET ACTIVE ON STOREFRONT IMMEDIATELY
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t border-gold/30">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-6 py-2.5 border border-gold/40 text-xs uppercase tracking-luxury text-gold hover:bg-cream"
            >
              CANCEL
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-2.5 border border-gold bg-gold text-black text-xs uppercase tracking-luxury font-bold hover:bg-white hover:text-black transition-colors"
            >
              {isSubmitting ? "SAVING HERO ASSET..." : "PUBLISH BANNER TO STOREFRONT"}
            </button>
          </div>
        </form>
      )}

      {/* Current Banners Grid */}
      <div className="space-y-6">
        {banners.length === 0 ? (
          <div className="border border-gold/30 bg-cream p-12 text-center max-w-xl mx-auto space-y-3">
            <Sparkles className="w-8 h-8 text-gold mx-auto" />
            <h3 className="font-serif text-lg text-gold uppercase tracking-luxury">
              DEFAULT MONOGRAM CAMPAIGN HERO ACTIVE
            </h3>
            <p className="text-xs uppercase tracking-luxury text-gold/80">
              No custom banners uploaded yet. The storefront is presenting the default luxury monochrome editorial hero. Click "Upload New Hero Banner" to add 21:9 and 9:16 banners directly from your device.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {banners.map((b) => (
              <div
                key={b.id}
                className="border border-gold/30 bg-black p-6 space-y-4 hover:border-gold transition-colors"
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gold/20 pb-4">
                  <div>
                    <span className="text-[9px] uppercase tracking-ultra text-gold/70 block">
                      PRIORITY: {b.priority}
                    </span>
                    <h3 className="font-serif text-lg text-gold uppercase font-medium">
                      {b.headline || "UNTITLED ATELIER HERO"}
                    </h3>
                    <p className="text-xs text-gold/70 uppercase tracking-wider">{b.subtitle || "MAHALEELA EDITORIAL"}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleToggleActive(b)}
                      className={`px-3 py-1 border text-[10px] uppercase tracking-wider font-semibold transition-colors ${
                        b.isActive
                          ? "border-green-500/50 bg-green-950/40 text-green-300"
                          : "border-gold/30 bg-cream text-gold/60"
                      }`}
                    >
                      {b.isActive ? "LIVE ON STOREFRONT" : "INACTIVE"}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteBanner(b.id)}
                      className="p-1.5 border border-red-500/40 text-red-400 hover:bg-red-950/30 transition-colors"
                      title="Decommission banner"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Banner Previews (Desktop 21:9 & Mobile 9:16) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2 space-y-1.5">
                    <span className="text-[9px] uppercase tracking-wider text-gold/80 flex items-center gap-1.5">
                      <Monitor className="w-3.5 h-3.5" /> DESKTOP DISPLAY (21:9 ULTRA-WIDE)
                    </span>
                    <div className="relative w-full aspect-[21/9] border border-gold/30 overflow-hidden bg-cream">
                      <img
                        src={b.desktopImage}
                        alt="Desktop Banner Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[9px] uppercase tracking-wider text-gold/80 flex items-center gap-1.5">
                      <Smartphone className="w-3.5 h-3.5" /> MOBILE DISPLAY (9:16 VERTICAL)
                    </span>
                    <div className="relative w-36 mx-auto aspect-[9/16] border border-gold/30 overflow-hidden bg-cream">
                      <img
                        src={b.mobileImage || b.desktopImage}
                        alt="Mobile Banner Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

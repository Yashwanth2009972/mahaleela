"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Monitor, 
  Tablet, 
  Smartphone, 
  Sparkles, 
  Copy, 
  Check, 
  Save, 
  RefreshCw,
  Eye
} from "lucide-react";

export default function TemplateEditorPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const templateId = searchParams.get("id");

  const [device, setDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [allTemplates, setAllTemplates] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<string>(templateId || "");

  const [formConfig, setFormConfig] = useState({
    name: "MAHALEELA_CUSTOM_01",
    category: "INSTAGRAM_POST",
    aspectRatio: "1:1",
    styleName: "NEW DROP",
    headline: "NEW DROP: EDITION VII",
    subtitle: "MAHALEELA ATELIER",
    description: "An architectural exploration of heavyweight organic cotton and 24k gold precision trims.",
    cta: "AVAILABLE NOW",
    url: "/collections",
    theme: "cream" as "cream" | "white",
    alignment: "center" as "center" | "left" | "right",
    imageUrl: "/assets/mahaleela-logo.jpg",
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    async function fetchTemplates() {
      try {
        const res = await fetch("/api/admin/visual-assets");
        if (res.ok) {
          const data = await res.json();
          setAllTemplates(data.templates || []);

          if (templateId) {
            const target = data.templates?.find((t: any) => t.id === templateId);
            if (target) {
              loadTemplateData(target);
            }
          } else if (data.templates?.length > 0) {
            setSelectedId(data.templates[0].id);
            loadTemplateData(data.templates[0]);
          }
        }
      } catch {}
    }
    fetchTemplates();
  }, [templateId]);

  const loadTemplateData = (tmpl: any) => {
    try {
      const cfg = JSON.parse(tmpl.config);
      setFormConfig({
        name: tmpl.name,
        category: tmpl.category,
        aspectRatio: tmpl.aspectRatio,
        styleName: tmpl.styleName,
        headline: cfg.headline || "",
        subtitle: cfg.subtitle || "",
        description: cfg.description || "",
        cta: cfg.cta || "",
        url: cfg.url || "",
        theme: cfg.theme === "white" ? "white" : "cream",
        alignment: cfg.alignment || "center",
        imageUrl: cfg.imageUrl || "/assets/mahaleela-logo.jpg",
      });
    } catch {}
  };

  const handleSelectTemplate = (id: string) => {
    setSelectedId(id);
    const target = allTemplates.find((t) => t.id === id);
    if (target) loadTemplateData(target);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const payload = {
        name: formConfig.name,
        category: formConfig.category,
        aspectRatio: formConfig.aspectRatio,
        styleName: formConfig.styleName,
        config: JSON.stringify({
          headline: formConfig.headline,
          subtitle: formConfig.subtitle,
          description: formConfig.description,
          cta: formConfig.cta,
          url: formConfig.url,
          theme: formConfig.theme,
          alignment: formConfig.alignment,
          imageUrl: formConfig.imageUrl,
        }),
      };

      let res;
      if (selectedId) {
        res = await fetch(`/api/admin/visual-assets/${selectedId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("/api/admin/visual-assets", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch {} finally {
      setIsSaving(false);
    }
  };

  const handleCopySVG = () => {
    const svgString = `
<svg width="1080" height="1080" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="${formConfig.theme === 'cream' ? '#1E1E1E' : '#000000'}"/>
  <rect x="20" y="20" width="1040" height="1040" fill="none" stroke="#C9A45C" stroke-width="2"/>
  <text x="540" y="120" font-family="Cinzel, Georgia, serif" font-size="22" fill="#C9A45C" letter-spacing="4" text-anchor="middle">${formConfig.subtitle}</text>
  <text x="540" y="520" font-family="Cinzel, Georgia, serif" font-size="44" fill="#C9A45C" letter-spacing="3" text-anchor="middle">${formConfig.headline}</text>
  <text x="540" y="600" font-family="Montserrat, sans-serif" font-size="18" fill="#C9A45C" letter-spacing="2" text-anchor="middle">${formConfig.description}</text>
  <rect x="420" y="900" width="240" height="50" fill="#C9A45C" />
  <text x="540" y="932" font-family="Montserrat, sans-serif" font-size="14" fill="#FFFFFF" letter-spacing="3" text-anchor="middle">${formConfig.cta}</text>
</svg>
    `.trim();

    navigator.clipboard.writeText(svgString);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gold/20 pb-4 gap-4">
        <Link
          href="/admin/visual-assets"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-luxury text-gold hover:underline underline-offset-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>RETURN TO ASSET LIBRARY</span>
        </Link>

        {/* Device Switcher */}
        <div className="flex items-center border border-gold/40 bg-white">
          <button
            type="button"
            onClick={() => setDevice("desktop")}
            className={`p-2 flex items-center gap-1.5 text-xs uppercase tracking-luxury transition-colors ${
              device === "desktop" ? "bg-gold text-white" : "text-gold hover:bg-cream"
            }`}
          >
            <Monitor className="w-4 h-4" />
            <span className="hidden md:inline">DESKTOP</span>
          </button>
          <button
            type="button"
            onClick={() => setDevice("tablet")}
            className={`p-2 flex items-center gap-1.5 text-xs uppercase tracking-luxury transition-colors ${
              device === "tablet" ? "bg-gold text-white" : "text-gold hover:bg-cream"
            }`}
          >
            <Tablet className="w-4 h-4" />
            <span className="hidden md:inline">TABLET</span>
          </button>
          <button
            type="button"
            onClick={() => setDevice("mobile")}
            className={`p-2 flex items-center gap-1.5 text-xs uppercase tracking-luxury transition-colors ${
              device === "mobile" ? "bg-gold text-white" : "text-gold hover:bg-cream"
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span className="hidden md:inline">MOBILE</span>
          </button>
        </div>

        {/* Save & Export Actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopySVG}
            className="px-4 py-2 border border-gold bg-white text-gold text-xs uppercase tracking-luxury hover:bg-cream transition-colors flex items-center gap-1.5"
          >
            {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedCode ? "COPIED SVG" : "EXPORT SVG"}</span>
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-2 border border-gold bg-gold text-white text-xs uppercase tracking-luxury hover:bg-white hover:text-gold transition-colors font-bold flex items-center gap-1.5 disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? "SAVING..." : saveSuccess ? "SAVED!" : "SAVE TEMPLATE"}</span>
          </button>
        </div>
      </div>

      {/* Editor Grid: Controls on Left, Live Canvas Preview on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form Controls */}
        <div className="lg:col-span-5 space-y-6">
          <div className="border border-gold/30 bg-white p-6 space-y-4 shadow-sm">
            <h2 className="font-serif text-sm uppercase tracking-luxury text-gold font-semibold border-b border-gold/20 pb-2">
              TEMPLATE SELECTOR & PARAMETERS
            </h2>

            {/* Template Dropdown */}
            {allTemplates.length > 0 && (
              <div>
                <label className="block text-[10px] uppercase tracking-luxury text-gold mb-1">
                  LOAD PRESET TEMPLATE
                </label>
                <select
                  value={selectedId}
                  onChange={(e) => handleSelectTemplate(e.target.value)}
                  className="w-full bg-cream border border-gold/40 px-3 py-2 text-xs uppercase text-gold focus:outline-none focus:border-gold"
                >
                  {allTemplates.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} � {t.styleName} ({t.aspectRatio})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-[10px] uppercase tracking-luxury text-gold mb-1">
                TEMPLATE IDENTIFIER
              </label>
              <input
                type="text"
                value={formConfig.name}
                onChange={(e) => setFormConfig({ ...formConfig, name: e.target.value })}
                className="w-full bg-cream border border-gold/40 px-3 py-2 text-xs uppercase text-gold focus:outline-none focus:border-gold"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] uppercase tracking-luxury text-gold mb-1">ASPECT RATIO</label>
                <select
                  value={formConfig.aspectRatio}
                  onChange={(e) => setFormConfig({ ...formConfig, aspectRatio: e.target.value })}
                  className="w-full bg-cream border border-gold/40 px-3 py-2 text-xs uppercase text-gold focus:outline-none focus:border-gold"
                >
                  <option value="1:1">1:1 (SQUARE)</option>
                  <option value="9:16">9:16 (STORY / REEL)</option>
                  <option value="16:9">16:9 (LANDSCAPE)</option>
                  <option value="4:5">4:5 (PORTRAIT)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-luxury text-gold mb-1">PALETTE THEME</label>
                <select
                  value={formConfig.theme}
                  onChange={(e) => setFormConfig({ ...formConfig, theme: e.target.value as any })}
                  className="w-full bg-cream border border-gold/40 px-3 py-2 text-xs uppercase text-gold focus:outline-none focus:border-gold"
                >
                  <option value="cream">CHARCOAL GREY (#1E1E1E)</option>
                  <option value="white">PURE BLACK (#000000)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-luxury text-gold mb-1">SUBTITLE / ATELIER TAG</label>
              <input
                type="text"
                value={formConfig.subtitle}
                onChange={(e) => setFormConfig({ ...formConfig, subtitle: e.target.value })}
                className="w-full bg-cream border border-gold/40 px-3 py-2 text-xs uppercase text-gold focus:outline-none focus:border-gold"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-luxury text-gold mb-1">HEADLINE *</label>
              <textarea
                rows={2}
                value={formConfig.headline}
                onChange={(e) => setFormConfig({ ...formConfig, headline: e.target.value })}
                className="w-full bg-cream border border-gold/40 px-3 py-2 text-xs uppercase text-gold focus:outline-none focus:border-gold font-serif"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-luxury text-gold mb-1">NARRATIVE / DESCRIPTION</label>
              <textarea
                rows={3}
                value={formConfig.description}
                onChange={(e) => setFormConfig({ ...formConfig, description: e.target.value })}
                className="w-full bg-cream border border-gold/40 px-3 py-2 text-xs uppercase text-gold focus:outline-none focus:border-gold"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] uppercase tracking-luxury text-gold mb-1">CALL TO ACTION</label>
                <input
                  type="text"
                  value={formConfig.cta}
                  onChange={(e) => setFormConfig({ ...formConfig, cta: e.target.value })}
                  className="w-full bg-cream border border-gold/40 px-3 py-2 text-xs uppercase text-gold focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-luxury text-gold mb-1">ALIGNMENT</label>
                <select
                  value={formConfig.alignment}
                  onChange={(e) => setFormConfig({ ...formConfig, alignment: e.target.value as any })}
                  className="w-full bg-cream border border-gold/40 px-3 py-2 text-xs uppercase text-gold focus:outline-none focus:border-gold"
                >
                  <option value="center">CENTER</option>
                  <option value="left">LEFT</option>
                  <option value="right">RIGHT</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Interactive Viewport Preview */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center p-6 border border-gold/30 bg-cream min-h-[600px]">
          <div
            className={`transition-all duration-300 border-2 border-gold shadow-2xl relative flex flex-col justify-between p-8 md:p-12 overflow-hidden ${
              formConfig.theme === "cream" ? "bg-cream" : "bg-white"
            } ${
              device === "mobile"
                ? "w-[320px] min-h-[568px]"
                : device === "tablet"
                ? "w-[480px] min-h-[600px]"
                : "w-full max-w-[560px] min-h-[560px]"
            }`}
            style={{
              textAlign: formConfig.alignment,
            }}
          >
            {/* Inner Gold Keyline Frame */}
            <div className="absolute inset-3 border border-gold/40 pointer-events-none" />

            {/* Top Emblem & Subtitle */}
            <div className="z-10">
              <div className="w-10 h-10 mx-auto border border-gold p-1 bg-white overflow-hidden mb-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/assets/mahaleela-logo.jpg" alt="Logo" className="w-full h-full object-contain" />
              </div>
              <span className="font-serif text-[10px] uppercase tracking-ultra text-gold block">
                {formConfig.subtitle || "MAHALEELA ATELIER"}
              </span>
            </div>

            {/* Center Editorial Headlines */}
            <div className="z-10 my-auto py-6">
              <h1 className="font-serif text-2xl md:text-3xl lg:text-4xl uppercase tracking-luxury text-gold font-normal leading-tight">
                {formConfig.headline}
              </h1>
              {formConfig.description && (
                <p className="mt-4 text-xs uppercase tracking-luxury text-gold/80 leading-relaxed font-light max-w-md mx-auto">
                  {formConfig.description}
                </p>
              )}
            </div>

            {/* Bottom CTA Button */}
            <div className="z-10">
              <span className="inline-block px-8 py-3 border border-gold bg-gold text-white text-xs uppercase tracking-luxury font-medium shadow-sm">
                {formConfig.cta || "EXPLORE THE ARCHIVE"}
              </span>
              <p className="text-[9px] uppercase tracking-ultra text-gold/60 mt-3 font-serif">
                BENGALURU � PURE WHITE � CREAM � LUXURY GOLD
              </p>
            </div>
          </div>

          <div className="mt-4 text-center">
            <span className="text-[10px] uppercase tracking-ultra text-gold/60">
              LIVE PREVIEW: {device.toUpperCase()} MODE ({formConfig.aspectRatio}) � 100% PALETTE COMPLIANT
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

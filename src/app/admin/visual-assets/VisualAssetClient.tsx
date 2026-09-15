"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, Edit3, Copy, Check, Eye } from "lucide-react";

interface TemplateType {
  id: string;
  name: string;
  category: string;
  aspectRatio: string;
  styleName: string;
  config: string;
  isPublished: boolean;
}

export function VisualAssetClient({ templates, brandAssets }: { templates: TemplateType[]; brandAssets: any[] }) {
  const [activeTab, setActiveTab] = useState<string>("ALL");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = [
    { id: "ALL", label: "ALL TEMPLATES" },
    { id: "INSTAGRAM_POST", label: "IG POSTS (10)" },
    { id: "INSTAGRAM_STORY", label: "IG STORIES (10)" },
    { id: "REEL_COVER", label: "REEL COVERS (10)" },
    { id: "CAMPAIGN", label: "CAMPAIGN (5)" },
    { id: "PRODUCT", label: "PRODUCT (5)" },
    { id: "COLLECTION", label: "COLLECTION (5)" },
    { id: "OFFER", label: "OFFERS (5)" },
    { id: "EMAIL", label: "EMAIL (8)" },
    { id: "WEBSITE", label: "WEBSITE (6)" },
  ];

  const filteredTemplates =
    activeTab === "ALL"
      ? templates
      : templates.filter((t) => t.category === activeTab);

  const handleCopyJson = (template: TemplateType) => {
    navigator.clipboard.writeText(template.config);
    setCopiedId(template.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gold/20 pb-4">
        {categories.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setActiveTab(c.id)}
            className={`px-3.5 py-2 border text-[11px] uppercase tracking-luxury transition-colors ${
              activeTab === c.id
                ? "border-gold bg-gold text-white font-semibold"
                : "border-gold/30 bg-white text-gold hover:bg-cream"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Grid of Templates */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredTemplates.map((template) => {
          let parsedConfig: any = {};
          try {
            parsedConfig = JSON.parse(template.config);
          } catch {
            parsedConfig = {};
          }

          const isDarkTheme = false; // Always strict white/cream/gold
          const isCream = parsedConfig.theme === "cream";

          return (
            <div
              key={template.id}
              className="border border-gold/30 bg-white flex flex-col justify-between shadow-sm group hover:border-gold transition-colors"
            >
              {/* Miniature Layout Preview Card */}
              <div
                className={`p-6 border-b border-gold/20 flex flex-col justify-between relative overflow-hidden ${
                  isCream ? "bg-cream" : "bg-white"
                } ${
                  template.aspectRatio === "9:16"
                    ? "aspect-[9/16]"
                    : template.aspectRatio === "16:9"
                    ? "aspect-[16/9]"
                    : template.aspectRatio === "4:5"
                    ? "aspect-[4/5]"
                    : "aspect-square"
                }`}
              >
                {/* Outer frame border */}
                <div className="absolute inset-2 border border-gold/30 pointer-events-none" />

                {/* Header in preview */}
                <div className="text-center z-10">
                  <span className="text-[7px] uppercase tracking-ultra text-gold font-serif block">
                    {parsedConfig.subtitle || "MAHALEELA"}
                  </span>
                </div>

                {/* Center Content in preview */}
                <div className="text-center z-10 px-2 my-auto">
                  <h3 className="font-serif text-xs md:text-sm uppercase tracking-luxury text-gold font-semibold leading-snug">
                    {parsedConfig.headline || template.styleName}
                  </h3>
                  {parsedConfig.description && (
                    <p className="text-[7px] uppercase tracking-widest text-gold/70 mt-1 line-clamp-2">
                      {parsedConfig.description}
                    </p>
                  )}
                </div>

                {/* Bottom CTA in preview */}
                <div className="text-center z-10">
                  <span className="inline-block text-[7px] uppercase tracking-ultra px-2 py-0.5 border border-gold bg-gold text-white font-medium">
                    {parsedConfig.cta || "EXPLORE"}
                  </span>
                </div>
              </div>

              {/* Template Metadata & Action Area */}
              <div className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-serif text-xs uppercase tracking-luxury text-gold font-bold truncate">
                    {template.name}
                  </span>
                  <span className="text-[9px] uppercase tracking-luxury border border-gold px-1.5 py-0.2 bg-cream text-gold">
                    {template.aspectRatio}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[10px] uppercase tracking-luxury text-gold/70">
                  <span>STYLE: {template.styleName}</span>
                  <span>{template.category.replace("_", " ")}</span>
                </div>

                {/* Actions */}
                <div className="pt-2 border-t border-gold/10 flex items-center gap-2">
                  <Link
                    href={`/admin/visual-assets/editor?id=${template.id}`}
                    className="flex-1 py-1.5 border border-gold bg-gold text-white text-[10px] uppercase tracking-luxury hover:bg-white hover:text-gold transition-colors font-medium text-center flex items-center justify-center gap-1"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>CUSTOMIZE</span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => handleCopyJson(template)}
                    className="p-1.5 border border-gold/30 hover:bg-cream transition-colors text-gold"
                    title="Copy Configuration JSON"
                  >
                    {copiedId === template.id ? (
                      <Check className="w-3.5 h-3.5 text-gold" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

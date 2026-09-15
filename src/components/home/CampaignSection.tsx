import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface CampaignSectionProps {
  content?: {
    headline?: string;
    ctaText?: string;
    ctaUrl?: string;
  };
}

export const CampaignSection: React.FC<CampaignSectionProps> = ({ content }) => {
  const headline = content?.headline || "THE MONOCHROME SYMPHONY";
  const ctaText = content?.ctaText || "DISCOVER CAMPAIGN";
  const ctaUrl = content?.ctaUrl || "/collections";

  return (
    <section className="bg-cream py-20 md:py-32 px-4 sm:px-6 lg:px-8 border-b border-gold/20">
      <div className="max-w-7xl mx-auto">
        <div className="border border-gold/40 bg-white p-8 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl">
            <span className="text-[10px] tracking-ultra uppercase text-gold/70 font-serif block mb-2">
              ANNUAL CAMPAIGN
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-gold uppercase tracking-luxury font-normal leading-tight">
              {headline}
            </h2>
            <p className="mt-4 text-xs uppercase tracking-luxury text-gold/80 font-light leading-relaxed">
              Explorations of light, space, and quiet tailoring. Photographed in neutral architectural spaces echoing the purest forms.
            </p>
          </div>

          <Link
            href={ctaUrl}
            className="px-8 py-3.5 border border-gold bg-cream text-gold text-xs uppercase tracking-luxury hover:bg-gold hover:text-white transition-colors flex-shrink-0 inline-flex items-center gap-2 font-medium"
          >
            <span>{ctaText}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

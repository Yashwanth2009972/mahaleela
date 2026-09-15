import React from "react";
import { BRAND } from "@/lib/constants";
import { Instagram, Facebook, Youtube, ArrowRight } from "lucide-react";

export const SocialSection: React.FC = () => {
  const socials = [
    {
      name: "INSTAGRAM",
      handle: "@MAHALEELAFASHION",
      description: "Daily haute couture dispatches, runway fittings, and editorial lookbooks.",
      url: BRAND.socials.instagram,
      icon: Instagram,
    },
    {
      name: "FACEBOOK",
      handle: "MAHALEELA OFFICIAL",
      description: "Private salon announcements, client community discussions, and updates.",
      url: BRAND.socials.facebook,
      icon: Facebook,
    },
    {
      name: "YOUTUBE",
      handle: "@MAHALEELAFASHION",
      description: "Cinematic atelier films, material craftsmanship documentaries, and collection unveils.",
      url: BRAND.socials.youtube,
      icon: Youtube,
    },
  ];

  return (
    <section className="w-full bg-cream py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-t border-gold/30">
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="text-center space-y-2">
          <span className="text-[10px] tracking-ultra uppercase text-gold font-serif block">
            SOCIAL • VISIBLE ON STOREFRONT
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-gold uppercase tracking-luxury font-normal">
            THE MAHALEELA SOCIETY
          </h2>
          <div className="w-12 h-[1px] bg-gold mx-auto my-3" />
          <p className="text-xs uppercase tracking-luxury text-gold/80 max-w-lg mx-auto font-light leading-relaxed">
            JOIN OUR DIGITAL SALON FOR PRIVATE DISPATCHES, EDITORIAL REELS, AND ATELIER BEHIND-THE-SCENES.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {socials.map((s) => {
            const Icon = s.icon;
            return (
              <a
                key={s.name}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-gold/40 bg-black p-8 flex flex-col justify-between hover:border-gold transition-all duration-300 group shadow-sm"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Icon className="w-6 h-6 text-gold group-hover:scale-110 transition-transform" />
                    <span className="text-[9px] uppercase tracking-ultra text-gold/60">OFFICIAL CHANNEL</span>
                  </div>
                  <div>
                    <h3 className="font-serif text-lg text-gold uppercase tracking-luxury font-semibold">
                      {s.name}
                    </h3>
                    <p className="text-[10px] text-gold/80 uppercase tracking-wider mt-0.5">{s.handle}</p>
                  </div>
                  <p className="text-xs text-gold/70 leading-relaxed font-light">
                    {s.description}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-gold/20 flex items-center justify-between text-xs uppercase tracking-luxury text-gold group-hover:underline">
                  <span>CONNECT NOW</span>
                  <ArrowRight className="w-3.5 h-3.5 text-gold group-hover:translate-x-1 transition-transform" />
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
};

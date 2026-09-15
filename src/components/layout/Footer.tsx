import React from "react";
import Link from "next/link";
import { Logo } from "../common/Logo";
import { BRAND, PREDEFINED_CATEGORIES } from "@/lib/constants";

interface FooterProps {
  businessAddress?: string;
  businessPhone?: string;
  socialInstagram?: string;
  socialFacebook?: string;
  socialYoutube?: string;
}

export const Footer: React.FC<FooterProps> = ({
  businessAddress = BRAND.address,
  businessPhone = BRAND.phone,
  socialInstagram = BRAND.socials.instagram,
  socialFacebook = BRAND.socials.facebook,
  socialYoutube = BRAND.socials.youtube,
}) => {
  return (
    <footer className="bg-cream border-t border-gold/30 pt-16 pb-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-gold/20">
          {/* Brand & Crest */}
          <div className="lg:col-span-2 flex flex-col items-start">
            <Logo variant="footer" />
            <div className="mt-6 text-xs uppercase tracking-luxury text-gold/80 space-y-1">
              <p className="font-semibold text-gold">ATELIER & HEADQUARTERS</p>
              <p className="whitespace-pre-line leading-relaxed">{businessAddress}</p>
              <p className="pt-2 text-gold">TELEPHONE: {businessPhone}</p>
              <p className="text-gold">CONCIERGE: {BRAND.email}</p>
            </div>

            {/* Social Links (Instagram, Facebook, YouTube - strictly NO Threads) */}
            <div className="mt-6 flex items-center gap-4">
              <a
                href={socialInstagram}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1 border border-gold/40 text-[10px] uppercase tracking-luxury text-gold hover:bg-gold hover:text-white transition-colors"
              >
                INSTAGRAM
              </a>
              <a
                href={socialFacebook}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1 border border-gold/40 text-[10px] uppercase tracking-luxury text-gold hover:bg-gold hover:text-white transition-colors"
              >
                FACEBOOK
              </a>
              <a
                href={socialYoutube}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1 border border-gold/40 text-[10px] uppercase tracking-luxury text-gold hover:bg-gold hover:text-white transition-colors"
              >
                YOUTUBE
              </a>
            </div>
          </div>

          {/* Departments */}
          <div>
            <h4 className="font-serif text-xs uppercase tracking-ultra text-gold font-semibold mb-4">
              DEPARTMENTS
            </h4>
            <ul className="space-y-2.5 text-xs uppercase tracking-luxury text-gold/80">
              {PREDEFINED_CATEGORIES.slice(0, 6).map((cat) => (
                <li key={cat.slug}>
                  <Link href={`/category/${cat.slug}`} className="hover:text-gold hover:underline underline-offset-4">
                    {cat.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/#catalogue" className="hover:text-gold hover:underline underline-offset-4 font-semibold text-gold">
                  VIEW ALL DEPARTMENTS
                </Link>
              </li>
            </ul>
          </div>

          {/* Maison & Portals */}
          <div>
            <h4 className="font-serif text-xs uppercase tracking-ultra text-gold font-semibold mb-4">
              THE MAISON
            </h4>
            <ul className="space-y-2.5 text-xs uppercase tracking-luxury text-gold/80">
              <li>
                <Link href="/exclusive" className="hover:text-gold hover:underline underline-offset-4">
                  EXCLUSIVE
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-gold hover:underline underline-offset-4">
                  ABOUT MAHALEELA
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-gold hover:underline underline-offset-4">
                  CLIENT SERVICES
                </Link>
              </li>
              <li>
                <Link href="/orders" className="hover:text-gold hover:underline underline-offset-4">
                  ORDER TRACKING
                </Link>
              </li>
              <li>
                <Link href="/wishlist" className="hover:text-gold hover:underline underline-offset-4">
                  WISHLIST
                </Link>
              </li>
            </ul>
          </div>

          {/* Client Policies */}
          <div>
            <h4 className="font-serif text-xs uppercase tracking-ultra text-gold font-semibold mb-4">
              CLIENT POLICIES
            </h4>
            <ul className="space-y-2.5 text-xs uppercase tracking-luxury text-gold/80">
              <li>
                <Link href="/shipping" className="hover:text-gold hover:underline underline-offset-4">
                  SHIPPING ACROSS INDIA
                </Link>
              </li>
              <li>
                <Link href="/returns" className="hover:text-gold hover:underline underline-offset-4">
                  RETURNS & EXCHANGES
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-gold hover:underline underline-offset-4">
                  TERMS OF SERVICE
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-gold hover:underline underline-offset-4">
                  PRIVACY POLICY
                </Link>
              </li>
              <li>
                <span className="text-[10px] text-gold/70 block pt-2">
                  DELIVERY CHARGES AS PER LOCATION • COD AVAILABLE
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Sub-footer Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] tracking-ultra uppercase text-gold/70">
          <p>© {new Date().getFullYear()} MAHALEELA. ALL RIGHTS RESERVED.</p>
          <div className="flex items-center gap-6">
            <span>PURE BLACK • CHARCOAL GREY • LUXURY GOLD</span>
            <span className="border-l border-gold/30 pl-6">BENGALURU, INDIA</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

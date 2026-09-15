import { PREDEFINED_CATEGORIES } from "@/lib/constants";
import { Compass, Check } from "lucide-react";

export const dynamic = "force-dynamic";

export default function AdminNavigationPage() {
  return (
    <div className="space-y-6">
      <div className="border border-gold/30 bg-cream p-6 sm:p-8">
        <span className="text-[10px] tracking-ultra uppercase text-gold/70 font-serif block mb-1">
          SITE HIERARCHY
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl text-gold uppercase tracking-luxury font-normal">
          NAVIGATION SYSTEMS
        </h1>
        <p className="text-xs uppercase tracking-luxury text-gold/80 mt-1 font-light">
          CONFIGURE PRIMARY HEADER, MOBILE SLIDE-OUT MENU, AND FOOTER ARCHIVAL LINKS.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Header Navigation Structure */}
        <div className="border border-gold/30 bg-white p-6 shadow-sm space-y-4">
          <h3 className="font-serif text-base text-gold uppercase tracking-luxury font-medium pb-2 border-b border-gold/20">
            STOREFRONT PRIMARY HEADER
          </h3>
          <div className="space-y-2 text-xs uppercase tracking-luxury text-gold">
            <div className="p-3 border border-gold/20 bg-cream flex justify-between items-center">
              <span>LEFT: LUXURY SLIDE-OUT MENU & EXCLUSIVE LINK</span>
              <Check className="w-3.5 h-3.5 text-gold" />
            </div>
            <div className="p-3 border border-gold/20 bg-cream flex justify-between items-center">
              <span>CENTER: OFFICIAL MAHALEELA CREST & EMBLEM</span>
              <Check className="w-3.5 h-3.5 text-gold" />
            </div>
            <div className="p-3 border border-gold/20 bg-cream flex justify-between items-center">
              <span>RIGHT: SEARCH, ACCOUNT, WISHLIST, CART, ADMIN (IF AUTH)</span>
              <Check className="w-3.5 h-3.5 text-gold" />
            </div>
          </div>
        </div>

        {/* Mobile Header Structure */}
        <div className="border border-gold/30 bg-white p-6 shadow-sm space-y-4">
          <h3 className="font-serif text-base text-gold uppercase tracking-luxury font-medium pb-2 border-b border-gold/20">
            MOBILE HEADER STRUCTURE
          </h3>
          <div className="space-y-2 text-xs uppercase tracking-luxury text-gold">
            <div className="p-3 border border-gold/20 bg-cream flex justify-between items-center">
              <span>LEFT: THUMB-FRIENDLY MENU DRAWER</span>
              <Check className="w-3.5 h-3.5 text-gold" />
            </div>
            <div className="p-3 border border-gold/20 bg-cream flex justify-between items-center">
              <span>CENTER: MAHALEELA CREST EMBLEM</span>
              <Check className="w-3.5 h-3.5 text-gold" />
            </div>
            <div className="p-3 border border-gold/20 bg-cream flex justify-between items-center">
              <span>RIGHT: SEARCH & SHOPPING BAG COUNTER</span>
              <Check className="w-3.5 h-3.5 text-gold" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

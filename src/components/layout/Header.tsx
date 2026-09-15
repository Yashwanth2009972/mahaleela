"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Menu, 
  X, 
  Search, 
  User, 
  Heart, 
  ShoppingBag, 
  ShieldCheck, 
  ArrowRight,
  Sparkles
} from "lucide-react";
import { Logo } from "../common/Logo";
import { useCart } from "@/lib/cart-context";
import { PREDEFINED_CATEGORIES, BRAND } from "@/lib/constants";

interface HeaderProps {
  announcementText?: string;
  announcementLink?: string;
  isAnnouncementEnabled?: boolean;
  currentUser?: {
    userId: string;
    email: string;
    role: string;
    name?: string | null;
  } | null;
}

export const Header: React.FC<HeaderProps> = ({
  announcementText = "PAN-INDIA LUXURY DISPATCH • DELIVERY CHARGES ACCORDING TO LOCATION VIA WHATSAPP",
  announcementLink = "/#catalogue",
  isAnnouncementEnabled = true,
  currentUser = null,
}) => {
  const pathname = usePathname();
  const { cartCount, wishlist, openCartDrawer } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);

  const isAdmin = currentUser?.role === "ADMIN" || currentUser?.role === "SUPER_ADMIN";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setIsSearchOpen(false);
  }, [pathname]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <>
      {/* Announcement Bar */}
      {isAnnouncementEnabled && (
        <div className="bg-cream border-b border-gold/30 py-2 px-4 text-center">
          <Link
            href={announcementLink || "/#catalogue"}
            className="text-[11px] tracking-luxury text-gold uppercase hover:opacity-80 transition-opacity inline-flex items-center gap-2 justify-center"
          >
            <span>{announcementText}</span>
            <ArrowRight className="w-3 h-3 text-gold" />
          </Link>
        </div>
      )}

      {/* Main Header */}
      <header
        className={`sticky top-0 z-40 bg-white transition-all duration-300 border-b ${
          scrolled ? "border-gold/30 shadow-[0_2px_10px_rgba(201,164,92,0.08)] py-2" : "border-gold/20 py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* LEFT: Menu Drawer Trigger & Exclusive Link */}
            <div className="flex items-center gap-6">
              <button
                type="button"
                onClick={() => setIsMenuOpen(true)}
                className="inline-flex items-center gap-2 text-gold hover:opacity-75 transition-opacity focus:outline-none p-1"
                aria-label="Open luxury menu"
              >
                <Menu className="w-5 h-5 text-gold stroke-[1.5]" />
                <span className="hidden md:inline-block text-xs uppercase tracking-luxury font-medium">
                  MENU
                </span>
              </button>

              <Link
                href="/exclusive"
                className="hidden lg:inline-flex items-center gap-1.5 text-[11px] tracking-luxury uppercase text-gold hover:underline decoration-gold/50 underline-offset-4 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 text-gold" />
                <span>JOIN EXCLUSIVE</span>
              </Link>
            </div>

            {/* CENTER: MAHALEELA Brand Logo */}
            <div className="flex-1 flex justify-center">
              <Logo variant="header" />
            </div>

            {/* RIGHT: Actions */}
            <div className="flex items-center gap-4 sm:gap-6">
              {/* Search Toggle */}
              <button
                type="button"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="text-gold hover:opacity-75 transition-opacity p-1"
                aria-label="Search collection"
              >
                <Search className="w-5 h-5 text-gold stroke-[1.5]" />
              </button>

              {/* Account (Desktop) */}
              <Link
                href={currentUser ? "/account" : "/account/login"}
                className="hidden md:inline-flex text-gold hover:opacity-75 transition-opacity p-1 relative"
                aria-label="Customer Account"
              >
                <User className="w-5 h-5 text-gold stroke-[1.5]" />
              </Link>

              {/* Wishlist (Desktop) */}
              <Link
                href="/wishlist"
                className="hidden md:inline-flex text-gold hover:opacity-75 transition-opacity p-1 relative"
                aria-label="Curated Wishlist"
              >
                <Heart className="w-5 h-5 text-gold stroke-[1.5]" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gold text-white text-[9px] flex items-center justify-center font-serif">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              {/* Cart Drawer Trigger */}
              <button
                type="button"
                onClick={openCartDrawer}
                className="text-gold hover:opacity-75 transition-opacity p-1 relative"
                aria-label="Shopping bag"
              >
                <ShoppingBag className="w-5 h-5 text-gold stroke-[1.5]" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gold text-white text-[9px] flex items-center justify-center font-serif">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Authorized Admin Portal Link */}
              {isAdmin && (
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 border border-gold bg-cream text-gold text-[10px] tracking-luxury uppercase font-semibold hover:bg-gold hover:text-white transition-colors"
                  title="Integrated Atelier CMS"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">ADMIN</span>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Expandable Search Input Bar */}
        {isSearchOpen && (
          <div className="border-t border-gold/20 bg-cream py-3 px-4 transition-all">
            <form onSubmit={handleSearchSubmit} className="max-w-xl mx-auto flex items-center gap-2">
              <input
                type="text"
                placeholder="SEARCH ARCHIVE BY NAME, SKU OR CATEGORY..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="flex-1 bg-white border border-gold/40 px-4 py-2 text-xs uppercase tracking-wider text-gold placeholder-gold/50 focus:outline-none focus:border-gold"
              />
              <button
                type="submit"
                className="px-4 py-2 border border-gold bg-gold text-white text-xs uppercase tracking-luxury hover:bg-white hover:text-gold transition-colors"
              >
                SEARCH
              </button>
              <button
                type="button"
                onClick={() => setIsSearchOpen(false)}
                className="p-2 text-gold hover:opacity-75"
              >
                <X className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </header>

      {/* Luxury Slide-Out Menu Drawer */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-white/70 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMenuOpen(false)}
          />

          {/* Drawer Container */}
          <div className="relative w-full max-w-md bg-white border-r border-gold/30 h-full flex flex-col justify-between shadow-2xl p-6 md:p-8 overflow-y-auto z-10">
            <div>
              {/* Drawer Top Header */}
              <div className="flex items-center justify-between border-b border-gold/20 pb-4">
                <span className="font-serif tracking-luxury text-sm text-gold uppercase">
                  MAHALEELA ARCHIVE
                </span>
                <button
                  type="button"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-gold p-1 hover:opacity-75"
                >
                  <X className="w-6 h-6 stroke-[1.5]" />
                </button>
              </div>

              {/* Main Navigation Links */}
              <nav className="mt-8 space-y-4">
                <div className="border-b border-gold/10 pb-4">
                  <Link
                    href="/"
                    className="block text-sm tracking-luxury uppercase text-gold hover:underline underline-offset-4 py-1"
                  >
                    HOME / CATALOGUE
                  </Link>
                  <Link
                    href="/exclusive"
                    className="block text-sm tracking-luxury uppercase text-gold hover:underline underline-offset-4 py-1"
                  >
                    EXCLUSIVE
                  </Link>
                </div>

                {/* Predefined Categories */}
                <div className="py-2">
                  <span className="text-[10px] tracking-ultra uppercase text-gold/70 block mb-3 font-serif">
                    DEPARTMENTS
                  </span>
                  <div className="grid grid-cols-1 gap-2 pl-2 border-l border-gold/20">
                    {PREDEFINED_CATEGORIES.map((cat) => (
                      <Link
                        key={cat.slug}
                        href={`/category/${cat.slug}`}
                        className="text-xs uppercase tracking-luxury text-gold hover:text-gold/70 py-1 transition-colors"
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Client Services & Account (Mobile Accessible) */}
                <div className="border-t border-gold/10 pt-4 space-y-2">
                  <span className="text-[10px] tracking-ultra uppercase text-gold/70 block mb-2 font-serif">
                    CLIENT CARE
                  </span>
                  <Link
                    href={currentUser ? "/account" : "/account/login"}
                    className="block text-xs uppercase tracking-luxury text-gold py-1"
                  >
                    {currentUser ? "CLIENT ACCOUNT" : "SIGN IN / REGISTER"}
                  </Link>
                  <Link
                    href="/wishlist"
                    className="block text-xs uppercase tracking-luxury text-gold py-1"
                  >
                    SAVED PIECES ({wishlist.length})
                  </Link>
                  <Link
                    href="/orders"
                    className="block text-xs uppercase tracking-luxury text-gold py-1"
                  >
                    ORDER TRACKING
                  </Link>
                  {isAdmin && (
                    <Link
                      href="/admin"
                      className="block text-xs uppercase tracking-luxury font-bold text-gold py-1 bg-cream px-2 border border-gold/30"
                    >
                      ATELIER ADMIN CMS
                    </Link>
                  )}
                </div>
              </nav>
            </div>

            {/* Drawer Bottom Details */}
            <div className="border-t border-gold/20 pt-6 mt-8">
              <p className="text-[10px] tracking-luxury uppercase text-gold/70">
                ATELIER: {BRAND.address}
              </p>
              <p className="text-[10px] tracking-luxury uppercase text-gold/70 mt-1">
                TELEPHONE: {BRAND.phone}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Package, 
  Layers, 
  FolderTree, 
  ShoppingBag, 
  Users, 
  Image as ImageIcon, 
  Home, 
  TicketPercent, 
  BadgePercent, 
  HardDrive, 
  Compass, 
  Sparkles, 
  Settings, 
  ChevronRight, 
  ExternalLink,
  Menu,
  X,
  ShieldCheck
} from "lucide-react";
import { Logo } from "../common/Logo";

const ADMIN_NAV = [
  { name: "DASHBOARD", href: "/admin", icon: LayoutDashboard },
  { name: "PRODUCTS", href: "/admin/products", icon: Package },
  { name: "PHOTO GALLERY", href: "/admin/gallery", icon: ImageIcon },
  { name: "CATEGORIES", href: "/admin/categories", icon: FolderTree },
  { name: "ORDERS", href: "/admin/orders", icon: ShoppingBag },
  { name: "CUSTOMERS", href: "/admin/customers", icon: Users },
  { name: "BANNERS", href: "/admin/banners", icon: ImageIcon },
  { name: "HOMEPAGE", href: "/admin/homepage", icon: Home },
  { name: "VISUAL ASSETS", href: "/admin/visual-assets", icon: Sparkles }, // Highlighted first-class
  { name: "COUPONS", href: "/admin/coupons", icon: TicketPercent },
  { name: "OFFERS", href: "/admin/offers", icon: BadgePercent },
  { name: "MEDIA", href: "/admin/media", icon: HardDrive },
  { name: "NAVIGATION", href: "/admin/navigation", icon: Compass },
  { name: "EXCLUSIVE", href: "/admin/exclusive", icon: ShieldCheck },
  { name: "SETTINGS", href: "/admin/settings", icon: Settings },
];

export const AdminSidebar: React.FC = () => {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="lg:hidden fixed bottom-4 right-4 z-50">
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-3 border-2 border-gold bg-gold text-white shadow-xl flex items-center justify-center"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-cream border-r border-gold/30 flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Admin Header / Logo */}
          <div className="p-6 border-b border-gold/20 bg-white">
            <Logo variant="admin" />
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            <span className="text-[9px] font-serif uppercase tracking-ultra text-gold/60 block px-3 py-2">
              MAISON ADMINISTRATION
            </span>

            {ADMIN_NAV.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center justify-between px-3 py-2.5 text-xs uppercase tracking-luxury transition-colors ${
                    isActive
                      ? "bg-gold text-white font-medium border border-gold"
                      : "text-gold hover:bg-white hover:text-gold"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </div>
                  {item.name === "COLLECTIONS" && (
                    <span
                      className={`text-[8px] uppercase tracking-widest px-1.5 py-0.5 border ${
                        isActive
                          ? "border-white bg-white/20 text-white"
                          : "border-gold/40 text-gold bg-cream"
                      }`}
                    >
                      PRIMARY
                    </span>
                  )}
                  {item.name === "VISUAL ASSETS" && (
                    <span
                      className={`text-[8px] uppercase tracking-widest px-1.5 py-0.5 border ${
                        isActive
                          ? "border-white bg-white/20 text-white"
                          : "border-gold/40 text-gold bg-cream"
                      }`}
                    >
                      STUDIO
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-gold/20 bg-white">
            <Link
              href="/"
              target="_blank"
              className="w-full py-2 border border-gold bg-cream text-gold text-xs uppercase tracking-luxury hover:bg-gold hover:text-white transition-colors font-medium flex items-center justify-center gap-1.5"
            >
              <span>VIEW STOREFRONT</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
};

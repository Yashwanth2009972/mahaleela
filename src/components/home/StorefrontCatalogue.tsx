"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { MessageCircle, ShoppingBag, Eye, Sparkles, Tag, Check, Copy } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { BRAND } from "@/lib/constants";

// Standard Mandatory Circular Palette requested by client
const CIRCLE_COLOR_OPTIONS = [
  { name: "White", hex: "#FFFFFF", border: "border-gold/60" },
  { name: "Black", hex: "#000000", border: "border-gold" },
  { name: "Red", hex: "#DC2626", border: "border-red-500" },
  { name: "Royal Blue", hex: "#1D4ED8", border: "border-blue-500" },
  { name: "Dark Green", hex: "#14532D", border: "border-green-600" },
];

interface StorefrontCatalogueProps {
  initialProducts: any[];
  categories: { id: string; name: string; slug: string }[];
  coupons?: any[];
}

export const StorefrontCatalogue: React.FC<StorefrontCatalogueProps> = ({
  initialProducts,
  categories,
  coupons = [],
}) => {
  const { addItem } = useCart();
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedColors, setSelectedColors] = useState<{ [productId: string]: string }>({});
  const [copiedCoupon, setCopiedCoupon] = useState<string | null>(null);

  const filteredProducts = useMemo(() => {
    if (selectedCategory === "ALL") return initialProducts;
    return initialProducts.filter(
      (p) => p.category?.slug === selectedCategory || p.category?.name === selectedCategory
    );
  }, [initialProducts, selectedCategory]);

  const handleSelectColor = (productId: string, colorName: string) => {
    setSelectedColors((prev) => ({ ...prev, [productId]: colorName }));
  };

  const copyCouponCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCoupon(code);
    setTimeout(() => setCopiedCoupon(null), 2500);
  };

  const handleWhatsAppOrder = (product: any) => {
    const chosenColor = selectedColors[product.id] || "White";
    const text = `Hello MAHALEELA, I would like to place an order:
• Product: ${product.name}
• Chosen Colour: ${chosenColor}
• Price: ₹${product.price.toLocaleString("en-IN")}${product.mrp && product.mrp > product.price ? ` (MRP ₹${product.mrp.toLocaleString("en-IN")})` : ""}
• SKU / Ref: ${product.slug}

Please confirm delivery charges according to my location.`;

    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/91${BRAND.phone}?text=${encoded}`, "_blank");
  };

  return (
    <section id="catalogue" className="w-full bg-black py-8">
      {/* 1. HORIZONTALLY SCROLLABLE CATEGORY FILTER BAR */}
      <div className="sticky top-16 z-30 bg-black/95 backdrop-blur-md border-y border-gold/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-3.5 scroll-smooth">
            <button
              type="button"
              onClick={() => setSelectedCategory("ALL")}
              className={`px-4 py-2 border text-xs uppercase tracking-luxury font-medium transition-all whitespace-nowrap flex-shrink-0 ${
                selectedCategory === "ALL"
                  ? "border-gold bg-gold text-black font-bold shadow-md shadow-gold/20"
                  : "border-gold/30 bg-cream text-gold hover:border-gold"
              }`}
            >
              ALL PIECES
            </button>

            {categories.map((cat) => {
              const isActive = selectedCategory === cat.slug;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`px-4 py-2 border text-xs uppercase tracking-luxury font-medium transition-all whitespace-nowrap flex-shrink-0 ${
                    isActive
                      ? "border-gold bg-gold text-black font-bold shadow-md shadow-gold/20"
                      : "border-gold/30 bg-cream text-gold hover:border-gold"
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. ACTIVE COUPONS BAR (VISIBLE ON STOREFRONT CATALOGUE) */}
      {coupons && coupons.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="border border-gold/40 bg-cream/40 p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-gold">
              <Tag className="w-4 h-4 text-gold flex-shrink-0" />
              <span className="text-[10px] sm:text-xs uppercase tracking-luxury font-bold">
                ACTIVE PRIVILEGE COUPONS:
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {coupons.map((cpn: any) => (
                <button
                  key={cpn.id || cpn.code}
                  type="button"
                  onClick={() => copyCouponCode(cpn.code)}
                  className="px-3 py-1 border border-gold bg-black text-gold text-[10px] uppercase font-mono flex items-center gap-1.5 hover:bg-gold hover:text-black transition-colors"
                  title="Click to copy coupon"
                >
                  <span className="font-bold">{cpn.code}</span>
                  <span className="text-[9px] opacity-80 font-sans">
                    ({cpn.discountType === "PERCENTAGE" ? `${cpn.discountValue}% OFF` : `₹${cpn.discountValue} OFF`})
                  </span>
                  {copiedCoupon === cpn.code ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3 opacity-60" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. PRODUCTS CATALOGUE: 2 ROWS VERTICALLY (2 COLUMNS) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="flex items-center justify-between pb-6 border-b border-gold/20">
          <div>
            <span className="text-[10px] uppercase tracking-ultra text-gold/70 font-serif block">
              ATELIER SELECTIONS
            </span>
            <h2 className="font-serif text-xl sm:text-2xl text-gold uppercase tracking-luxury font-normal">
              {selectedCategory === "ALL"
                ? "CATALOGUE PIECES"
                : categories.find((c) => c.slug === selectedCategory)?.name || selectedCategory}
              <span className="text-xs font-sans text-gold/70 ml-2 font-normal">
                ({filteredProducts.length})
              </span>
            </h2>
          </div>

          <div className="text-right">
            <span className="text-[10px] uppercase tracking-wider text-gold/80 block">
              DELIVERY CHARGES ACCORDING TO LOCATION
            </span>
            <a
              href={`https://wa.me/91${BRAND.phone}?text=${encodeURIComponent("Hello MAHALEELA, I have a query regarding products and delivery charges.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] uppercase tracking-luxury text-gold underline hover:opacity-80 inline-flex items-center gap-1"
            >
              <MessageCircle className="w-3 h-3 text-gold" />
              <span>ASK ON WHATSAPP</span>
            </a>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="py-20 text-center max-w-md mx-auto border border-gold/30 bg-cream p-10 space-y-3 mt-8">
            <Sparkles className="w-8 h-8 text-gold mx-auto" />
            <h3 className="font-serif text-lg text-gold uppercase tracking-luxury font-medium">
              ATELIER CURATION IN PROGRESS
            </h3>
            <p className="text-xs uppercase tracking-luxury text-gold/80 leading-relaxed">
              No pieces currently published under this category. Visit our admin portal or inquire with the concierge on WhatsApp.
            </p>
            <div className="pt-2">
              <a
                href={`https://wa.me/91${BRAND.phone}?text=${encodeURIComponent(`Hello MAHALEELA, I am inquiring about upcoming pieces in ${selectedCategory}.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2.5 border border-gold bg-gold text-black text-xs uppercase tracking-luxury font-semibold inline-flex items-center gap-2 hover:bg-black hover:text-gold transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>INQUIRE ON WHATSAPP</span>
              </a>
            </div>
          </div>
        ) : (
          /* Strictly 2 columns layout on mobile and 2/4 on desktop */
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 pt-8">
            {filteredProducts.map((product) => {
              const activeColor = selectedColors[product.id] || "White";
              const primaryImg = product.images?.[0]?.url || "/assets/mahaleela-logo.jpg";
              const hasDiscount = product.mrp && product.mrp > product.price;
              const discountPercent = hasDiscount
                ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
                : 0;

              return (
                <div
                  key={product.id}
                  className="border border-gold/30 bg-cream flex flex-col justify-between hover:border-gold transition-all duration-300 group"
                >
                  {/* Product Image with Left-Side Automatic RED Discount Badge */}
                  <div>
                    <Link
                      href={`/product/${product.slug}`}
                      className="block relative w-full aspect-[3/4] bg-black overflow-hidden border-b border-gold/20"
                    >
                      <img
                        src={primaryImg}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />

                      {/* AUTOMATIC RED DISCOUNT BADGE (LEFT SIDE) */}
                      {hasDiscount && (
                        <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
                          <span className="px-2 py-0.5 bg-red-600 text-white text-[9px] font-bold uppercase tracking-wider shadow-lg">
                            {discountPercent}% OFF
                          </span>
                        </div>
                      )}

                      {product.badge && (
                        <span className="absolute top-2 right-2 px-2 py-0.5 border border-gold bg-black text-gold text-[9px] uppercase tracking-wider font-semibold">
                          {product.badge}
                        </span>
                      )}
                    </Link>

                    <div className="p-3 sm:p-4 space-y-2">
                      <span className="text-[9px] uppercase tracking-ultra text-gold/70 block">
                        {product.category?.name || "MAHALEELA"}
                      </span>
                      <Link
                        href={`/product/${product.slug}`}
                        className="block font-serif text-xs sm:text-sm text-gold uppercase tracking-luxury font-medium hover:underline line-clamp-1"
                      >
                        {product.name}
                      </Link>

                      {/* Price & Struck-through MRP */}
                      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 pt-1">
                        <div className="flex items-baseline gap-2">
                          <span className="font-serif text-sm sm:text-base font-bold text-gold">
                            ₹{product.price.toLocaleString("en-IN")}
                          </span>
                          {hasDiscount && (
                            <span className="text-[10px] text-gold/50 line-through">
                              ₹{product.mrp.toLocaleString("en-IN")}
                            </span>
                          )}
                        </div>
                        <span className="text-[8px] sm:text-[9px] uppercase tracking-wider text-gold/70">
                          + DELIVERY BY LOCATION
                        </span>
                      </div>

                      {/* CIRCULAR COLOUR OPTIONS: White, Black, Red, Royal Blue, Dark Green */}
                      <div className="pt-2 border-t border-gold/20">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[8px] uppercase tracking-wider text-gold/70">COLOUR:</span>
                          <span className="text-[9px] uppercase tracking-luxury text-gold font-semibold">
                            {activeColor}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {CIRCLE_COLOR_OPTIONS.map((col) => {
                            const isSelected = activeColor === col.name;
                            return (
                              <button
                                key={col.name}
                                type="button"
                                onClick={() => handleSelectColor(product.id, col.name)}
                                title={col.name}
                                className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full border transition-all duration-200 ${col.border} ${
                                  isSelected ? "ring-2 ring-gold scale-110" : "opacity-80 hover:opacity-100"
                                }`}
                                style={{ backgroundColor: col.hex }}
                              />
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Dual Ordering Actions (Bag + WhatsApp Order) */}
                  <div className="p-3 sm:p-4 pt-0 space-y-2">
                    <button
                      type="button"
                      onClick={() =>
                        addItem({
                          productId: product.id,
                          name: product.name,
                          price: product.price,
                          imageUrl: primaryImg,
                          color: activeColor,
                          quantity: 1,
                        })
                      }
                      className="w-full py-2 border border-gold bg-black text-gold text-[10px] uppercase tracking-luxury font-semibold hover:bg-gold hover:text-black transition-colors flex items-center justify-center gap-1.5"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>ADD TO BAG</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleWhatsAppOrder(product)}
                      className="w-full py-2 border border-green-600/60 bg-green-950/40 text-green-300 hover:bg-green-600 hover:text-white text-[10px] uppercase tracking-luxury font-semibold transition-colors flex items-center justify-center gap-1.5"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>ORDER ON WHATSAPP</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

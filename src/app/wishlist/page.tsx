"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { Heart, ShoppingBag, Trash2, ArrowRight, Sparkles } from "lucide-react";

interface ProductType {
  id: string;
  name: string;
  slug: string;
  price: number;
  mrp: number;
  discount: number;
  images: { url: string }[];
  category?: { name: string; slug: string };
}

export default function WishlistPage() {
  const { wishlist, toggleWishlist, addToCart } = useCart();
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWishlistProducts() {
      if (wishlist.length === 0) {
        setProducts([]);
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/products?ids=${wishlist.join(",")}`);
        if (res.ok) {
          const data = await res.json();
          setProducts(data.products || []);
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }
    fetchWishlistProducts();
  }, [wishlist]);

  const handleMoveToCart = (product: ProductType) => {
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      mrp: product.mrp || product.price,
      image: product.images?.[0]?.url || "/assets/mahaleela-logo.jpg",
      quantity: 1,
      categorySlug: product.category?.slug,
    });
    toggleWishlist(product.id);
  };

  return (
    <div className="bg-white min-h-screen py-12 md:py-20 px-4 sm:px-6 lg:px-8 border-b border-gold/20">
      <div className="max-w-6xl mx-auto">
        {/* Wishlist Header */}
        <div className="border-b border-gold/20 pb-6 mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Heart className="w-5 h-5 text-gold fill-gold" />
              <span className="text-[10px] uppercase tracking-ultra text-gold/70 font-serif">
                CURATED PIECES
              </span>
            </div>
            <h1 className="font-serif text-3xl md:text-4xl text-gold uppercase tracking-luxury font-normal">
              SAVED PIECES ({wishlist.length})
            </h1>
          </div>
          <Link
            href="/#catalogue"
            className="text-xs uppercase tracking-luxury text-gold inline-flex items-center gap-1.5 hover:underline underline-offset-4"
          >
            <span>CONTINUE EXPLORATION</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {wishlist.length === 0 ? (
          /* Luxury Empty State */
          <div className="border border-gold/30 bg-cream p-12 md:p-16 text-center max-w-xl mx-auto">
            <div className="w-14 h-14 border border-gold bg-white flex items-center justify-center mx-auto mb-6">
              <Heart className="w-6 h-6 text-gold" />
            </div>
            <h2 className="font-serif text-2xl text-gold uppercase tracking-luxury font-normal">
              YOUR WISHLIST IS PRISTINE
            </h2>
            <p className="mt-4 text-xs uppercase tracking-luxury text-gold/80 leading-relaxed font-light">
              You have not yet marked any pieces for consideration. Explore the atelier departments and curate your private wishlist.
            </p>
            <div className="mt-8">
              <Link
                href="/#catalogue"
                className="px-8 py-3.5 border border-gold bg-gold text-white text-xs uppercase tracking-luxury hover:bg-white hover:text-gold transition-colors font-medium inline-block"
              >
                BROWSE CATALOGUE
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((p) => (
              <div key={p.id} className="border border-gold/30 bg-white group flex flex-col justify-between">
                <div>
                  <div className="relative aspect-[4/5] bg-cream overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.images?.[0]?.url || "/assets/mahaleela-logo.jpg"}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <button
                      type="button"
                      onClick={() => toggleWishlist(p.id)}
                      className="absolute top-3 right-3 p-2 bg-white/90 border border-gold/30 text-gold hover:bg-gold hover:text-white transition-colors"
                      aria-label="Remove from wishlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="p-6">
                    <span className="text-[10px] uppercase tracking-ultra text-gold/70 block mb-1">
                      {p.category?.name || "ATELIER EDITION"}
                    </span>
                    <Link
                      href={`/product/${p.slug}`}
                      className="font-serif text-base uppercase tracking-luxury text-gold hover:underline line-clamp-1 block"
                    >
                      {p.name}
                    </Link>
                    <p className="mt-2 text-xs uppercase tracking-luxury text-gold font-bold">
                      ₹{p.price.toLocaleString("en-IN")}
                      {p.mrp > p.price && (
                        <span className="ml-2 text-gold/60 line-through text-[11px] font-normal">
                          ₹{p.mrp.toLocaleString("en-IN")}
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0 border-t border-gold/10 flex gap-3">
                  <button
                    type="button"
                    onClick={() => handleMoveToCart(p)}
                    className="flex-1 py-3 border border-gold bg-gold text-white text-xs uppercase tracking-luxury hover:bg-white hover:text-gold transition-colors font-medium flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>MOVE TO BAG</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

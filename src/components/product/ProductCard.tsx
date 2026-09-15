"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";
import { useCart } from "@/lib/cart-context";

export interface ProductCardData {
  id: string;
  name: string;
  slug: string;
  price: number;
  mrp: number;
  discount: number;
  badge?: string | null;
  category?: {
    name: string;
    slug: string;
  };
  images?: {
    url: string;
    alt?: string | null;
    isPrimary?: boolean;
  }[];
}

interface ProductCardProps {
  product: ProductCardData;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { toggleWishlist, isInWishlist } = useCart();
  const isWishlisted = isInWishlist(product.id);

  const primaryImage =
    product.images?.find((img) => img.isPrimary)?.url ||
    product.images?.[0]?.url ||
    "/assets/mahaleela-logo.jpg";

  return (
    <div className="group relative flex flex-col bg-white border border-gold/20 hover:border-gold/60 transition-all duration-300">
      {/* Badge (NEW, LIMITED, EXCLUSIVE, BESTSELLER) */}
      {product.badge && (
        <div className="absolute top-3 left-3 z-10">
          <span className="px-2.5 py-1 border border-gold bg-cream text-gold text-[9px] tracking-ultra uppercase font-semibold">
            {product.badge}
          </span>
        </div>
      )}

      {/* Wishlist Button */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleWishlist(product.id);
        }}
        className="absolute top-3 right-3 z-10 p-2 border border-gold/40 bg-white/90 text-gold hover:bg-gold hover:text-white transition-colors"
        aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
      >
        <Heart
          className={`w-3.5 h-3.5 ${
            isWishlisted ? "fill-gold text-gold" : "text-gold"
          }`}
        />
      </button>

      {/* Image Container */}
      <Link href={`/product/${product.slug}`} className="block relative w-full aspect-[3/4] bg-cream overflow-hidden">
        <Image
          src={primaryImage}
          alt={product.name}
          fill
          className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
      </Link>

      {/* Product Details */}
      <div className="p-4 flex flex-col justify-between flex-1 bg-white">
        <div>
          {product.category && (
            <span className="text-[9px] uppercase tracking-ultra text-gold/60 block mb-1">
              {product.category.name}
            </span>
          )}
          <Link href={`/product/${product.slug}`}>
            <h4 className="font-serif text-sm uppercase tracking-wider text-gold font-medium line-clamp-1 group-hover:underline underline-offset-4">
              {product.name}
            </h4>
          </Link>
        </div>

        <div className="mt-3 pt-3 border-t border-gold/10 flex items-baseline justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-sm font-semibold text-gold">
              ₹{product.price.toLocaleString("en-IN")}
            </span>
            {product.mrp > product.price && (
              <span className="text-[10px] line-through text-gold/50">
                ₹{product.mrp.toLocaleString("en-IN")}
              </span>
            )}
          </div>
          {product.discount > 0 && (
            <span className="text-[9px] tracking-wider text-gold font-medium uppercase">
              {Math.round(product.discount)}% OFF
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Heart, 
  ShoppingBag, 
  ArrowRight, 
  ChevronDown, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  Truck,
  RotateCcw
} from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { BRAND } from "@/lib/constants";

interface ProductVariant {
  id: string;
  color?: string | null;
  size?: string | null;
  sku?: string | null;
  price?: number | null;
  mrp?: number | null;
  stock: number;
  isAvailable: boolean;
}

interface ProductImage {
  id: string;
  url: string;
  alt?: string | null;
  isPrimary: boolean;
}

interface ProductDetailClientProps {
  product: {
    id: string;
    name: string;
    slug: string;
    description?: string | null;
    price: number;
    mrp: number;
    discount: number;
    sku?: string | null;
    stock: number;
    badge?: string | null;
    details?: string | null;
    sizeFit?: string | null;
    materialCare?: string | null;
    shippingReturns?: string | null;
    category?: { name: string; slug: string } | null;
    images: ProductImage[];
    variants: ProductVariant[];
  };
}

export const ProductDetailClient: React.FC<ProductDetailClientProps> = ({ product }) => {
  const router = useRouter();
  const { addToCart, toggleWishlist, isInWishlist } = useCart();

  // Selected variant state
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product.variants.length > 0 ? product.variants[0] : null
  );
  const [selectedImage, setSelectedImage] = useState<string>(
    product.images[0]?.url || "/assets/mahaleela-logo.jpg"
  );
  const [quantity, setQuantity] = useState(1);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  // Accordion open states
  const [openAccordions, setOpenAccordions] = useState<{ [key: string]: boolean }>({
    description: true,
    details: false,
    sizeFit: false,
    materialCare: false,
    shippingReturns: false,
  });

  const toggleAccordion = (key: string) => {
    setOpenAccordions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const currentPrice = selectedVariant?.price || product.price;
  const currentMrp = selectedVariant?.mrp || product.mrp;
  const isWishlisted = isInWishlist(product.id);

  // Clothing vs Accessories detection
  const isClothing = ["t-shirts", "shirts", "hoodies", "sweatshirts"].includes(
    product.category?.slug || ""
  );

  const availableSizes = Array.from(
    new Set(product.variants.map((v) => v.size).filter(Boolean))
  ) as string[];

  const availableColors = Array.from(
    new Set(product.variants.map((v) => v.color).filter(Boolean))
  ) as string[];

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      name: product.name,
      price: currentPrice,
      mrp: currentMrp,
      image: selectedImage,
      variantId: selectedVariant?.id,
      size: selectedVariant?.size,
      color: selectedVariant?.color,
      quantity,
      categorySlug: product.category?.slug,
    });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push("/checkout");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-[10px] tracking-ultra uppercase text-gold/70 mb-8">
        <Link href="/" className="hover:text-gold">
          HOME
        </Link>
        <span>/</span>
        {product.category && (
          <>
            <Link href={`/category/${product.category.slug}`} className="hover:text-gold">
              {product.category.name}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-gold font-semibold truncate">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        {/* Left: Product Image Gallery */}
        <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto max-h-[650px] pb-2 md:pb-0 scrollbar-none">
              {product.images.map((img) => (
                <button
                  key={img.id}
                  type="button"
                  onClick={() => setSelectedImage(img.url)}
                  className={`relative w-16 h-20 sm:w-20 sm:h-24 bg-cream border flex-shrink-0 transition-all ${
                    selectedImage === img.url
                      ? "border-gold border-2"
                      : "border-gold/30 opacity-70 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={img.url}
                    alt={img.alt || product.name}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Main Selected Image */}
          <div className="relative flex-1 aspect-[3/4] bg-cream border border-gold/30 overflow-hidden group">
            <Image
              src={selectedImage}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              priority
              sizes="(max-width: 1024px) 100vw, 60vw"
            />
            {product.badge && (
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 border border-gold bg-white text-gold text-[10px] tracking-ultra uppercase font-medium">
                  {product.badge}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right: Product Editorial Details & Purchase Actions */}
        <div className="lg:col-span-5 flex flex-col justify-start">
          {/* Department */}
          {product.category && (
            <span className="text-[10px] uppercase tracking-ultra text-gold/70 font-serif">
              {product.category.name}
            </span>
          )}

          {/* Title */}
          <h1 className="font-serif text-3xl sm:text-4xl text-gold uppercase tracking-wider font-normal mt-2 leading-tight">
            {product.name}
          </h1>

          {/* SKU */}
          {product.sku && (
            <p className="text-[10px] uppercase tracking-widest text-gold/60 mt-1">
              ARCHIVE REF: {product.sku}
            </p>
          )}

          {/* Price */}
          <div className="mt-6 flex items-baseline gap-3 pb-6 border-b border-gold/20">
            <span className="font-serif text-2xl sm:text-3xl font-semibold text-gold">
              ₹{currentPrice.toLocaleString("en-IN")}
            </span>
            {currentMrp > currentPrice && (
              <span className="text-sm line-through text-gold/50 font-serif">
                ₹{currentMrp.toLocaleString("en-IN")}
              </span>
            )}
            {product.discount > 0 && (
              <span className="px-2 py-0.5 border border-gold/40 text-[10px] uppercase tracking-widest text-gold bg-cream">
                {Math.round(product.discount)}% OFF
              </span>
            )}
          </div>

          {/* Colour Selection */}
          {availableColors.length > 0 && (
            <div className="mt-6">
              <span className="text-xs uppercase tracking-luxury text-gold block mb-2 font-medium">
                COLOUR: <span className="font-light">{selectedVariant?.color || availableColors[0]}</span>
              </span>
              <div className="flex flex-wrap gap-2">
                {availableColors.map((col) => {
                  const match = product.variants.find((v) => v.color === col);
                  const isSelected = selectedVariant?.color === col;
                  return (
                    <button
                      key={col}
                      type="button"
                      onClick={() => match && setSelectedVariant(match)}
                      className={`px-3 py-1.5 border text-xs uppercase tracking-luxury transition-all ${
                        isSelected
                          ? "border-gold bg-gold text-white font-medium"
                          : "border-gold/30 bg-white text-gold hover:border-gold"
                      }`}
                    >
                      {col}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Size Selection */}
          {availableSizes.length > 0 && (
            <div className="mt-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs uppercase tracking-luxury text-gold font-medium">
                  SIZE: <span className="font-light">{selectedVariant?.size || availableSizes[0]}</span>
                </span>
                {isClothing && (
                  <button
                    type="button"
                    onClick={() => setIsSizeGuideOpen(true)}
                    className="text-[10px] uppercase tracking-luxury text-gold underline underline-offset-4 hover:opacity-80"
                  >
                    SIZE GUIDE
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {availableSizes.map((sz) => {
                  const match = product.variants.find((v) => v.size === sz);
                  const isSelected = selectedVariant?.size === sz;
                  return (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => match && setSelectedVariant(match)}
                      className={`w-12 h-10 border text-xs uppercase tracking-wider font-serif flex items-center justify-center transition-all ${
                        isSelected
                          ? "border-gold bg-gold text-white font-medium"
                          : "border-gold/30 bg-white text-gold hover:border-gold"
                      }`}
                    >
                      {sz}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity and Actions */}
          <div className="mt-8 space-y-3">
            <div className="flex gap-3">
              {/* Quantity */}
              <div className="flex items-center border border-gold bg-white px-3 py-2">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="text-gold px-2 hover:opacity-75"
                >
                  -
                </button>
                <span className="font-serif text-sm text-gold px-2">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="text-gold px-2 hover:opacity-75"
                >
                  +
                </button>
              </div>

              {/* Add to Bag */}
              <button
                type="button"
                onClick={handleAddToCart}
                className="flex-1 py-3.5 border border-gold bg-gold text-white text-xs uppercase tracking-luxury hover:bg-white hover:text-gold transition-all duration-300 font-medium inline-flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>ADD TO BAG</span>
              </button>

              {/* Wishlist Button */}
              <button
                type="button"
                onClick={() => toggleWishlist(product.id)}
                className={`p-3.5 border border-gold transition-colors ${
                  isWishlisted ? "bg-gold text-white" : "bg-white text-gold hover:bg-cream"
                }`}
                aria-label="Wishlist"
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? "fill-white" : ""}`} />
              </button>
            </div>

            {/* Instant Buy Now */}
            <button
              type="button"
              onClick={handleBuyNow}
              className="w-full py-3.5 border border-gold bg-cream text-gold text-xs uppercase tracking-luxury hover:bg-gold hover:text-white transition-all duration-300 font-medium inline-flex items-center justify-center gap-2"
            >
              <span>INSTANT DISPATCH / BUY NOW</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Assurances Banner */}
          <div className="mt-8 p-4 border border-gold/30 bg-cream/40 space-y-2 text-[10px] tracking-luxury uppercase text-gold">
            <div className="flex items-center gap-2">
              <Truck className="w-3.5 h-3.5 flex-shrink-0" />
              <span>DELIVERY CHARGES ACCORDING TO LOCATION</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 flex-shrink-0" />
              <span>CASH ON DELIVERY AVAILABLE ACROSS INDIA (₹10 FEE)</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="w-3.5 h-3.5 flex-shrink-0" />
              <span>DISCREET 7-DAY ATELIER RETURNS & EXCHANGES</span>
            </div>
          </div>

          {/* Editorial Accordions */}
          <div className="mt-10 border-t border-gold/20 divide-y divide-gold/20">
            {/* Description */}
            <div className="py-4">
              <button
                type="button"
                onClick={() => toggleAccordion("description")}
                className="w-full flex justify-between items-center text-xs uppercase tracking-luxury text-gold font-medium"
              >
                <span>DESCRIPTION</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    openAccordions.description ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openAccordions.description && (
                <div className="pt-3 text-xs uppercase tracking-luxury text-gold/80 font-light leading-relaxed">
                  {product.description ||
                    "Masterfully crafted in limited quantities with architectural seams, hand-finished hems, and bespoke luxury gold detailing."}
                </div>
              )}
            </div>

            {/* Details */}
            <div className="py-4">
              <button
                type="button"
                onClick={() => toggleAccordion("details")}
                className="w-full flex justify-between items-center text-xs uppercase tracking-luxury text-gold font-medium"
              >
                <span>SPECIFICATIONS & DETAILS</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    openAccordions.details ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openAccordions.details && (
                <div className="pt-3 text-xs uppercase tracking-luxury text-gold/80 font-light leading-relaxed whitespace-pre-line">
                  {product.details ||
                    "• 100% Certified Heavyweight Premium Fabric\n• Bespoke 24K Electroplated Gold Hardware\n• Tailored In-House in Bengaluru Atelier\n• Dispatched in Signature MAHALEELA Rigid Box"}
                </div>
              )}
            </div>

            {/* Size & Fit */}
            <div className="py-4">
              <button
                type="button"
                onClick={() => toggleAccordion("sizeFit")}
                className="w-full flex justify-between items-center text-xs uppercase tracking-luxury text-gold font-medium"
              >
                <span>SIZE & FIT</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    openAccordions.sizeFit ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openAccordions.sizeFit && (
                <div className="pt-3 text-xs uppercase tracking-luxury text-gold/80 font-light leading-relaxed">
                  {product.sizeFit ||
                    "Designed for a relaxed, architectural drape. Fits true to size. For an intentionally structured silhouette, select your standard size."}
                </div>
              )}
            </div>

            {/* Material & Care */}
            <div className="py-4">
              <button
                type="button"
                onClick={() => toggleAccordion("materialCare")}
                className="w-full flex justify-between items-center text-xs uppercase tracking-luxury text-gold font-medium"
              >
                <span>MATERIAL & CARE</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    openAccordions.materialCare ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openAccordions.materialCare && (
                <div className="pt-3 text-xs uppercase tracking-luxury text-gold/80 font-light leading-relaxed">
                  {product.materialCare ||
                    "Dry clean recommended for longevity. Alternatively, hand wash cold with neutral detergent. Flat dry in shade. Warm iron inside out."}
                </div>
              )}
            </div>

            {/* Shipping & Returns */}
            <div className="py-4">
              <button
                type="button"
                onClick={() => toggleAccordion("shippingReturns")}
                className="w-full flex justify-between items-center text-xs uppercase tracking-luxury text-gold font-medium"
              >
                <span>SHIPPING & RETURNS</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    openAccordions.shippingReturns ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openAccordions.shippingReturns && (
                <div className="pt-3 text-xs uppercase tracking-luxury text-gold/80 font-light leading-relaxed">
                  {product.shippingReturns ||
                    "Dispatched within 24 hours from Bengaluru atelier. Direct courier tracking provided via SMS and email. 7-day hassle-free returns on unworn items."}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Size Guide Modal (Strictly White/Cream/Gold) */}
      {isSizeGuideOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white/70 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-white border-2 border-gold p-6 sm:p-8 shadow-2xl">
            <div className="flex justify-between items-center border-b border-gold/30 pb-4 mb-6">
              <h3 className="font-serif text-lg text-gold uppercase tracking-luxury">
                MAHALEELA SIZE GUIDE (INCHES)
              </h3>
              <button
                type="button"
                onClick={() => setIsSizeGuideOpen(false)}
                className="text-gold hover:opacity-75"
              >
                ✕
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-center border border-gold/30">
                <thead>
                  <tr className="bg-cream border-b border-gold/30 font-serif text-gold">
                    <th className="py-2.5 px-3">SIZE</th>
                    <th className="py-2.5 px-3">CHEST</th>
                    <th className="py-2.5 px-3">SHOULDER</th>
                    <th className="py-2.5 px-3">LENGTH</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gold/20 font-serif text-gold/90">
                  <tr>
                    <td className="py-2 font-bold">S</td>
                    <td className="py-2">38 - 40</td>
                    <td className="py-2">17.5</td>
                    <td className="py-2">28</td>
                  </tr>
                  <tr className="bg-cream/40">
                    <td className="py-2 font-bold">M</td>
                    <td className="py-2">40 - 42</td>
                    <td className="py-2">18.5</td>
                    <td className="py-2">29</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-bold">L</td>
                    <td className="py-2">42 - 44</td>
                    <td className="py-2">19.5</td>
                    <td className="py-2">30</td>
                  </tr>
                  <tr className="bg-cream/40">
                    <td className="py-2 font-bold">XL</td>
                    <td className="py-2">44 - 46</td>
                    <td className="py-2">20.5</td>
                    <td className="py-2">31</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-bold">XXL</td>
                    <td className="py-2">46 - 48</td>
                    <td className="py-2">21.5</td>
                    <td className="py-2">32</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="mt-4 text-[10px] tracking-wide text-gold/70 text-center uppercase">
              MEASUREMENTS IN INCHES. FOR ASSISTANCE CONTACT CONCIERGE@MAHALEELA.COM
            </p>

            <button
              type="button"
              onClick={() => setIsSizeGuideOpen(false)}
              className="mt-6 w-full py-2.5 border border-gold bg-gold text-white text-xs uppercase tracking-luxury hover:bg-white hover:text-gold transition-colors"
            >
              CLOSE GUIDE
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

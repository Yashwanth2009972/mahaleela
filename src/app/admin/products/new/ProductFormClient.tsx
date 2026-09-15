"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2, Upload, Sparkles, Check } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Collection {
  id: string;
  name: string;
  slug: string;
}

interface ProductFormProps {
  categories: Category[];
  collections: Collection[];
}

export const ProductFormClient: React.FC<ProductFormProps> = ({
  categories,
  collections,
}) => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    categoryId: categories[0]?.id || "",
    description: "",
    price: "",
    mrp: "",
    discount: "",
    sku: "",
    stock: "10",
    badge: "",
    details: "• 100% Certified Heavyweight Premium Fabric\n• Bespoke 24K Electroplated Gold Hardware\n• Dispatched in Signature MAHALEELA Rigid Box",
    sizeFit: "Designed for a relaxed, architectural drape. Fits true to size.",
    materialCare: "Dry clean or hand wash cold with neutral detergent. Flat dry in shade.",
    shippingReturns: "Dispatched within 24 hours from Bengaluru atelier. 7-day returns.",
    seoTitle: "",
    seoDescription: "",
  });

  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
  const [images, setImages] = useState<{ url: string; alt: string; isPrimary: boolean }[]>([
    { url: "/assets/mahaleela-logo.jpg", alt: "MAHALEELA Crest", isPrimary: true },
  ]);
  const [imageUrlInput, setImageUrlInput] = useState("");

  // Variant sizes
  const [sizes, setSizes] = useState<string[]>(["S", "M", "L", "XL", "XXL"]);
  const [colorInput, setColorInput] = useState("Cream & Gold");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    setFormData((prev) => ({ ...prev, name, slug }));
  };

  const handleAddImageUrl = () => {
    if (imageUrlInput.trim()) {
      setImages((prev) => [
        ...prev,
        { url: imageUrlInput.trim(), alt: formData.name, isPrimary: prev.length === 0 },
      ]);
      setImageUrlInput("");
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const body = new FormData();
    body.append("file", file);

    try {
      const res = await fetch("/api/admin/media", {
        method: "POST",
        body,
      });
      const data = await res.json();
      if (data.media?.url) {
        setImages((prev) => [
          ...prev,
          { url: data.media.url, alt: file.name, isPrimary: prev.length === 0 },
        ]);
      }
    } catch {
      alert("Failed to upload image.");
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleCollection = (colId: string) => {
    setSelectedCollections((prev) =>
      prev.includes(colId) ? prev.filter((id) => id !== colId) : [...prev, colId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      // Build variants
      const variants = sizes.map((sz) => ({
        size: sz,
        color: colorInput,
        sku: `${formData.sku || "ML"}-${sz}`,
        price: Number(formData.price),
        mrp: Number(formData.mrp) || Number(formData.price),
        stock: Math.floor(Number(formData.stock) / sizes.length) || 1,
      }));

      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          images,
          variants,
          collectionIds: selectedCollections,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create product.");
      }

      router.push("/admin/products");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to create product.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-16">
      {error && (
        <div className="p-4 border border-gold bg-cream text-xs uppercase tracking-luxury text-gold font-medium">
          {error}
        </div>
      )}

      {/* General Information Card */}
      <div className="border border-gold/30 bg-white p-6 sm:p-8 space-y-4 shadow-sm">
        <h3 className="font-serif text-lg text-gold uppercase tracking-wider pb-3 border-b border-gold/20 font-medium">
          1. PRODUCT ESSENTIALS
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-luxury text-gold mb-1 font-medium">
              PRODUCT NAME *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={handleNameChange}
              placeholder="E.G. ATELIER SILK POPLIN SHIRT"
              className="w-full px-4 py-3 bg-cream/30 border border-gold text-xs uppercase tracking-wider text-gold placeholder-gold/40 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-luxury text-gold mb-1 font-medium">
              URL SLUG *
            </label>
            <input
              type="text"
              required
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="w-full px-4 py-3 bg-cream/30 border border-gold text-xs tracking-wider text-gold placeholder-gold/40 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-luxury text-gold mb-1 font-medium">
              CATEGORY (FROM 11 MANDATORY DEPARTMENTS) *
            </label>
            <select
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              className="w-full px-4 py-3 bg-cream/30 border border-gold text-xs uppercase tracking-wider text-gold focus:outline-none"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-luxury text-gold mb-1 font-medium">
              EDITORIAL BADGE (OPTIONAL)
            </label>
            <select
              value={formData.badge}
              onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
              className="w-full px-4 py-3 bg-cream/30 border border-gold text-xs uppercase tracking-wider text-gold focus:outline-none"
            >
              <option value="">NO BADGE</option>
              <option value="NEW">NEW</option>
              <option value="LIMITED">LIMITED</option>
              <option value="EXCLUSIVE">EXCLUSIVE</option>
              <option value="BESTSELLER">BESTSELLER</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-luxury text-gold mb-1 font-medium">
            EDITORIAL DESCRIPTION
          </label>
          <textarea
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="A MASTERFUL EXPRESSION OF REFINED MINIMALISM..."
            className="w-full px-4 py-3 bg-cream/30 border border-gold text-xs uppercase tracking-wider text-gold placeholder-gold/40 focus:outline-none"
          />
        </div>
      </div>

      {/* Pricing & Stock Card */}
      <div className="border border-gold/30 bg-white p-6 sm:p-8 space-y-4 shadow-sm">
        <h3 className="font-serif text-lg text-gold uppercase tracking-wider pb-3 border-b border-gold/20 font-medium">
          2. PRICING & INVENTORY
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-luxury text-gold mb-1 font-medium">
              SELLING PRICE (₹) *
            </label>
            <input
              type="number"
              required
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              placeholder="3990"
              className="w-full px-4 py-3 bg-cream/30 border border-gold text-xs font-serif text-gold focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-luxury text-gold mb-1 font-medium">
              MRP (₹)
            </label>
            <input
              type="number"
              value={formData.mrp}
              onChange={(e) => setFormData({ ...formData, mrp: e.target.value })}
              placeholder="5990"
              className="w-full px-4 py-3 bg-cream/30 border border-gold text-xs font-serif text-gold focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-luxury text-gold mb-1 font-medium">
              SKU CODE
            </label>
            <input
              type="text"
              value={formData.sku}
              onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
              placeholder="ML-SHT-01"
              className="w-full px-4 py-3 bg-cream/30 border border-gold text-xs uppercase tracking-wider text-gold focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-luxury text-gold mb-1 font-medium">
              TOTAL STOCK UNITS *
            </label>
            <input
              type="number"
              required
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              className="w-full px-4 py-3 bg-cream/30 border border-gold text-xs font-serif text-gold focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Variants (Sizes & Colors) Card */}
      <div className="border border-gold/30 bg-white p-6 sm:p-8 space-y-4 shadow-sm">
        <h3 className="font-serif text-lg text-gold uppercase tracking-wider pb-3 border-b border-gold/20 font-medium">
          3. SIZES & COLOUR ATTRIBUTES
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs uppercase tracking-luxury text-gold mb-2 font-medium">
              SUPPORTED SIZES (CLICK TO TOGGLE)
            </label>
            <div className="flex flex-wrap gap-2">
              {["XS", "S", "M", "L", "XL", "XXL", "STANDARD"].map((sz) => {
                const isSelected = sizes.includes(sz);
                return (
                  <button
                    key={sz}
                    type="button"
                    onClick={() =>
                      setSizes((prev) =>
                        isSelected ? prev.filter((s) => s !== sz) : [...prev, sz]
                      )
                    }
                    className={`w-12 h-10 border text-xs font-serif uppercase tracking-wider transition-colors ${
                      isSelected
                        ? "border-gold bg-gold text-white font-semibold"
                        : "border-gold/30 bg-cream/40 text-gold"
                    }`}
                  >
                    {sz}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-luxury text-gold mb-2 font-medium">
              COLOURWAY NAME
            </label>
            <input
              type="text"
              value={colorInput}
              onChange={(e) => setColorInput(e.target.value)}
              placeholder="PURE CREAM / LUXURY GOLD"
              className="w-full px-4 py-3 bg-cream/30 border border-gold text-xs uppercase tracking-wider text-gold focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Images Card */}
      <div className="border border-gold/30 bg-white p-6 sm:p-8 space-y-4 shadow-sm">
        <h3 className="font-serif text-lg text-gold uppercase tracking-wider pb-3 border-b border-gold/20 font-medium">
          4. PRODUCT IMAGERY GALLERY
        </h3>

        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            value={imageUrlInput}
            onChange={(e) => setImageUrlInput(e.target.value)}
            placeholder="PASTE IMAGE URL OR /UPLOADS/FILENAME..."
            className="flex-1 px-4 py-2.5 bg-cream/30 border border-gold text-xs text-gold focus:outline-none"
          />
          <button
            type="button"
            onClick={handleAddImageUrl}
            className="px-5 py-2.5 border border-gold bg-gold text-white text-xs uppercase tracking-luxury hover:bg-white hover:text-gold transition-colors font-medium"
          >
            ADD URL
          </button>

          <label className="px-5 py-2.5 border border-gold bg-cream text-gold text-xs uppercase tracking-luxury hover:bg-gold hover:text-white transition-colors cursor-pointer inline-flex items-center gap-1.5 font-medium">
            <Upload className="w-3.5 h-3.5" />
            <span>{uploading ? "UPLOADING..." : "UPLOAD FILE"}</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>

        {/* Image Previews */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4 pt-4">
          {images.map((img, idx) => (
            <div
              key={idx}
              className="relative aspect-[3/4] bg-cream border border-gold/40 overflow-hidden group"
            >
              <img
                src={img.url}
                alt={img.alt}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(idx)}
                className="absolute top-1 right-1 p-1 bg-white border border-gold text-gold hover:bg-gold hover:text-white transition-colors opacity-0 group-hover:opacity-100"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              {img.isPrimary && (
                <span className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-gold text-white text-[8px] uppercase tracking-widest">
                  PRIMARY
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Multi-Collection Assignment */}
      {collections.length > 0 && (
        <div className="border border-gold/30 bg-white p-6 sm:p-8 space-y-4 shadow-sm">
          <h3 className="font-serif text-lg text-gold uppercase tracking-wider pb-3 border-b border-gold/20 font-medium">
            5. ASSIGN TO ARCHIVAL COLLECTIONS
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {collections.map((col) => {
              const isAssigned = selectedCollections.includes(col.id);
              return (
                <div
                  key={col.id}
                  onClick={() => toggleCollection(col.id)}
                  className={`p-3 border cursor-pointer flex items-center justify-between text-xs uppercase tracking-luxury transition-all ${
                    isAssigned
                      ? "border-gold bg-cream text-gold font-medium"
                      : "border-gold/20 bg-white text-gold/70 hover:border-gold/50"
                  }`}
                >
                  <span>{col.name}</span>
                  {isAssigned && <Check className="w-3.5 h-3.5 text-gold" />}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Submit Actions */}
      <div className="flex gap-4">
        <Link
          href="/admin/products"
          className="px-6 py-3.5 border border-gold bg-white text-gold text-xs uppercase tracking-luxury hover:bg-cream transition-colors"
        >
          CANCEL
        </Link>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 py-3.5 border border-gold bg-gold text-white text-xs uppercase tracking-luxury hover:bg-white hover:text-gold transition-colors font-medium flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>{isSubmitting ? "SAVING TO CATALOGUE..." : "PUBLISH ATELIER PRODUCT"}</span>
        </button>
      </div>
    </form>
  );
};

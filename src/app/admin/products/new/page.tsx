"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Trash2, Check, Sparkles } from "lucide-react";
import { ImageDeviceUpload } from "@/components/admin/ImageDeviceUpload";

export default function NewProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<{ id: string; name: string; slug: string }[]>([]);
  const [collections, setCollections] = useState<{ id: string; name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    categoryId: "",
    price: "",
    mrp: "",
    sku: "",
    stock: "10",
    badge: "",
    description: "",
    details: "",
    sizeFit: "",
    materialCare: "",
    shippingReturns: "",
    seoTitle: "",
    seoDescription: "",
    isPublished: true,
    selectedSizes: [] as string[],
    colorsText: "White, Black, Red, Royal Blue, Dark Green",
    selectedCollectionIds: [] as string[],
  });

  useEffect(() => {
    async function loadMeta() {
      try {
        const catRes = await fetch("/api/admin/categories");
        if (catRes.ok) {
          const data = await catRes.json();
          setCategories(data.categories || []);
          if (data.categories?.length > 0) {
            setFormData((prev) => ({ ...prev, categoryId: data.categories[0].id }));
          }
        }
        const colRes = await fetch("/api/admin/collections");
        if (colRes.ok) {
          const data = await colRes.json();
          setCollections(data.collections || []);
        }
      } catch {
        // fallback
      }
    }
    loadMeta();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSizeToggle = (size: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedSizes: prev.selectedSizes.includes(size)
        ? prev.selectedSizes.filter((s) => s !== size)
        : [...prev.selectedSizes, size],
    }));
  };

  const handleCollectionToggle = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedCollectionIds: prev.selectedCollectionIds.includes(id)
        ? prev.selectedCollectionIds.filter((c) => c !== id)
        : [...prev.selectedCollectionIds, id],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    try {
      const colors = formData.colorsText
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const variants = [];
      if (formData.selectedSizes.length > 0) {
        for (const size of formData.selectedSizes) {
          if (colors.length > 0) {
            for (const color of colors) {
              variants.push({ size, color, stock: Number(formData.stock) || 1 });
            }
          } else {
            variants.push({ size, stock: Number(formData.stock) || 1 });
          }
        }
      } else if (colors.length > 0) {
        for (const color of colors) {
          variants.push({ color, stock: Number(formData.stock) || 1 });
        }
      }

      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          slug: formData.slug || undefined,
          categoryId: formData.categoryId,
          price: Number(formData.price),
          mrp: formData.mrp ? Number(formData.mrp) : Number(formData.price),
          sku: formData.sku || undefined,
          stock: Number(formData.stock) || 0,
          badge: formData.badge || undefined,
          description: formData.description,
          details: formData.details,
          sizeFit: formData.sizeFit,
          materialCare: formData.materialCare,
          shippingReturns: formData.shippingReturns,
          seoTitle: formData.seoTitle,
          seoDescription: formData.seoDescription,
          isPublished: formData.isPublished,
          images: uploadedImages.length > 0 ? uploadedImages : ["/assets/mahaleela-logo.jpg"],
          variants,
          collectionIds: formData.selectedCollectionIds,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create piece.");
      }

      router.push("/admin/products");
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between border-b border-gold/20 pb-4">
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-luxury text-gold hover:underline underline-offset-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>RETURN TO CATALOGUE</span>
        </Link>
        <span className="font-serif text-sm uppercase tracking-luxury text-gold font-semibold">
          ATELIER CREATION SUITE
        </span>
      </div>

      <div className="border border-gold/30 bg-cream p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-[10px] tracking-ultra uppercase text-gold/70 font-serif block mb-1">
            HAUTE COUTURE CATALOGUE
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl text-gold uppercase tracking-luxury font-normal">
            REGISTER NEW CREATION
          </h1>
          <p className="text-xs uppercase tracking-luxury text-gold/80 mt-1 font-light">
            DIRECT DEVICE PHOTO UPLOADING • UP TO 24K ULTRA-HIGH FIDELITY • ZERO DEMO DATA
          </p>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 border border-red-500 bg-red-950/30 text-red-300 text-xs uppercase tracking-luxury">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8 bg-black border border-gold/30 p-6 sm:p-10 shadow-sm">
        {/* Section 1: Basic Nomenclature */}
        <div className="space-y-4">
          <h2 className="font-serif text-base text-gold uppercase tracking-luxury border-b border-gold/20 pb-2">
            01. PIECE IDENTIFICATION
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] uppercase tracking-luxury text-gold mb-1">PIECE NAME *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="E.G. OVERSIZED FRENCH TERRY HOODIE"
                className="w-full bg-cream border border-gold/40 px-4 py-2.5 text-xs text-gold placeholder-gold/40 focus:outline-none focus:border-gold"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-luxury text-gold mb-1">
                URL SLUG (LEAVE BLANK FOR AUTO-GENERATION)
              </label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                placeholder="e.g. oversized-french-terry-hoodie"
                className="w-full bg-cream border border-gold/40 px-4 py-2.5 text-xs text-gold placeholder-gold/40 focus:outline-none focus:border-gold lowercase"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] uppercase tracking-luxury text-gold mb-1">DEPARTMENT *</label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                required
                className="w-full bg-cream border border-gold/40 px-4 py-2.5 text-xs uppercase tracking-wider text-gold focus:outline-none focus:border-gold"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-luxury text-gold mb-1">SKU CODE</label>
              <input
                type="text"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                placeholder="E.G. ML-HD-001"
                className="w-full bg-cream border border-gold/40 px-4 py-2.5 text-xs uppercase tracking-wider text-gold placeholder-gold/40 focus:outline-none focus:border-gold"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-luxury text-gold mb-1">BADGE</label>
              <select
                name="badge"
                value={formData.badge}
                onChange={handleChange}
                className="w-full bg-cream border border-gold/40 px-4 py-2.5 text-xs uppercase tracking-wider text-gold focus:outline-none focus:border-gold"
              >
                <option value="">NONE</option>
                <option value="NEW">NEW</option>
                <option value="LIMITED">LIMITED</option>
                <option value="EXCLUSIVE">EXCLUSIVE</option>
                <option value="BESTSELLER">BESTSELLER</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Pricing & Stock */}
        <div className="space-y-4">
          <h2 className="font-serif text-base text-gold uppercase tracking-luxury border-b border-gold/20 pb-2">
            02. ACQUISITION VALUATION & INVENTORY
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] uppercase tracking-luxury text-gold mb-1">
                SELLING PRICE (₹) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                placeholder="2400"
                className="w-full bg-cream border border-gold/40 px-4 py-2.5 text-xs text-gold placeholder-gold/40 focus:outline-none focus:border-gold font-serif"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-luxury text-gold mb-1">
                MRP / ANCHOR VALUATION (₹)
              </label>
              <input
                type="number"
                name="mrp"
                value={formData.mrp}
                onChange={handleChange}
                placeholder="3200"
                className="w-full bg-cream border border-gold/40 px-4 py-2.5 text-xs text-gold placeholder-gold/40 focus:outline-none focus:border-gold font-serif"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-luxury text-gold mb-1">
                INITIAL STOCK UNITS *
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                required
                className="w-full bg-cream border border-gold/40 px-4 py-2.5 text-xs text-gold focus:outline-none focus:border-gold font-serif"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Sizing & Colourways */}
        <div className="space-y-4">
          <h2 className="font-serif text-base text-gold uppercase tracking-luxury border-b border-gold/20 pb-2">
            03. ATTRIBUTES & CIRCLE COLOURWAYS
          </h2>

          <div>
            <label className="block text-[11px] uppercase tracking-luxury text-gold mb-2">
              CLOTHING SIZES (SELECT IF APPLICABLE)
            </label>
            <div className="flex flex-wrap gap-2">
              {["S", "M", "L", "XL", "XXL"].map((sz) => {
                const selected = formData.selectedSizes.includes(sz);
                return (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => handleSizeToggle(sz)}
                    className={`px-4 py-2 border text-xs uppercase tracking-luxury font-medium transition-colors ${
                      selected
                        ? "border-gold bg-gold text-black font-bold"
                        : "border-gold/30 bg-cream text-gold hover:border-gold"
                    }`}
                  >
                    SIZE {sz}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-luxury text-gold mb-1">
              AVAILABLE COLOURWAYS (CIRCLE OPTIONS SHOWN ON CATALOGUE)
            </label>
            <input
              type="text"
              name="colorsText"
              value={formData.colorsText}
              onChange={handleChange}
              placeholder="White, Black, Red, Royal Blue, Dark Green"
              className="w-full bg-cream border border-gold/40 px-4 py-2.5 text-xs uppercase text-gold placeholder-gold/40 focus:outline-none focus:border-gold"
            />
            <p className="text-[10px] uppercase tracking-wider text-gold/70 mt-1">
              Standard circular palette: White, Black, Red, Royal Blue, Dark Green.
            </p>
          </div>
        </div>

        {/* Section 4: Imagery (Direct Device Upload Only, No URLs!) */}
        <div className="space-y-4">
          <h2 className="font-serif text-base text-gold uppercase tracking-luxury border-b border-gold/20 pb-2">
            04. PRODUCT PHOTOGRAPHY (DIRECT DEVICE UPLOADING)
          </h2>

          <ImageDeviceUpload
            images={uploadedImages}
            onChange={setUploadedImages}
            multiple={true}
            label="SELECT PHOTOS FROM YOUR DEVICE"
            aspectHint="ALL FORMATS • UP TO 24K QUALITY • CLICK OR DRAG & DROP"
          />
        </div>

        {/* Section 5: Description */}
        <div className="space-y-4">
          <h2 className="font-serif text-base text-gold uppercase tracking-luxury border-b border-gold/20 pb-2">
            05. EDITORIAL NARRATIVE
          </h2>

          <div>
            <label className="block text-[11px] uppercase tracking-luxury text-gold mb-1">PRODUCT DESCRIPTION</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              placeholder="Detailed description of the garment cut, materials, and silhouette..."
              className="w-full bg-cream border border-gold/40 px-4 py-2.5 text-xs text-gold placeholder-gold/40 focus:outline-none focus:border-gold leading-relaxed"
            />
          </div>
        </div>

        <div className="pt-6 border-t border-gold/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isPublished"
              name="isPublished"
              checked={formData.isPublished}
              onChange={handleChange}
              className="w-4 h-4 accent-gold"
            />
            <label htmlFor="isPublished" className="text-xs uppercase tracking-luxury text-gold font-medium cursor-pointer">
              PUBLISH IMMEDIATELY TO STOREFRONT
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="px-8 py-3 border border-gold bg-gold text-black text-xs uppercase tracking-luxury font-bold hover:bg-white hover:text-black transition-colors"
          >
            {isLoading ? "COMMITTING TO ATELIER..." : "PUBLISH PIECE"}
          </button>
        </div>
      </form>
    </div>
  );
}

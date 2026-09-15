"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sparkles, Check } from "lucide-react";

interface ProductOption {
  id: string;
  name: string;
  sku?: string | null;
  price: number;
}

interface NewCollectionProps {
  products: ProductOption[];
}

export const NewCollectionClient: React.FC<NewCollectionProps> = ({ products }) => {
  const router = useRouter();

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [heroImage, setHeroImage] = useState("/assets/mahaleela-logo.jpg");
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
  };

  const toggleProduct = (productId: string) => {
    setSelectedProductIds((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      setError("Please specify a collection name.");
      return;
    }
    setError("");
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/admin/collections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          slug,
          description,
          heroImage,
          productIds: selectedProductIds,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create collection.");
      }

      router.push("/admin/collections");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "An error occurred.");
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

      <div className="border border-gold/30 bg-white p-6 sm:p-8 space-y-4 shadow-sm">
        <h3 className="font-serif text-lg text-gold uppercase tracking-wider pb-3 border-b border-gold/20 font-medium">
          COLLECTION DETAILS
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-luxury text-gold mb-1 font-medium">
              COLLECTION NAME *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={handleNameChange}
              placeholder="E.G. AUTUMN MONOCHROME 2026"
              className="w-full px-4 py-3 bg-cream/30 border border-gold text-xs uppercase tracking-wider text-gold focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-luxury text-gold mb-1 font-medium">
              URL SLUG *
            </label>
            <input
              type="text"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full px-4 py-3 bg-cream/30 border border-gold text-xs tracking-wider text-gold focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-luxury text-gold mb-1 font-medium">
            EDITORIAL NARRATIVE & DESCRIPTION
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="A SUITE OF ARCHITECTURAL CREATIONS CELEBRATING PROPORTIONAL HARMONY..."
            className="w-full px-4 py-3 bg-cream/30 border border-gold text-xs uppercase tracking-wider text-gold focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-luxury text-gold mb-1 font-medium">
            HERO / BANNER IMAGE URL
          </label>
          <input
            type="text"
            value={heroImage}
            onChange={(e) => setHeroImage(e.target.value)}
            className="w-full px-4 py-3 bg-cream/30 border border-gold text-xs text-gold focus:outline-none"
          />
        </div>
      </div>

      {/* Select Products to Include */}
      <div className="border border-gold/30 bg-white p-6 sm:p-8 space-y-4 shadow-sm">
        <div className="flex justify-between items-center pb-3 border-b border-gold/20">
          <h3 className="font-serif text-lg text-gold uppercase tracking-wider font-medium">
            ASSIGN PRODUCTS TO COLLECTION ({selectedProductIds.length} SELECTED)
          </h3>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {products.map((p) => {
              const isSelected = selectedProductIds.includes(p.id);
              return (
                <div
                  key={p.id}
                  onClick={() => toggleProduct(p.id)}
                  className={`p-4 border cursor-pointer flex items-center justify-between text-xs transition-all ${
                    isSelected
                      ? "border-gold bg-cream text-gold font-medium"
                      : "border-gold/20 bg-white text-gold/70 hover:border-gold/50"
                  }`}
                >
                  <div>
                    <p className="font-serif uppercase tracking-wider text-gold font-semibold">
                      {p.name}
                    </p>
                    <p className="text-[10px] text-gold/60 mt-0.5">
                      ₹{p.price.toLocaleString("en-IN")} {p.sku ? `• ${p.sku}` : ""}
                    </p>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-gold flex-shrink-0" />}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-6 text-center bg-cream border border-gold/20">
            <p className="text-xs uppercase tracking-luxury text-gold/80">
              No products exist in catalogue yet. You can create the collection now and assign products later.
            </p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <Link
          href="/admin/collections"
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
          <span>{isSubmitting ? "CREATING COLLECTION..." : "PUBLISH COLLECTION"}</span>
        </button>
      </div>
    </form>
  );
};

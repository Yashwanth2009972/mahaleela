"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Trash2 } from "lucide-react";

export function CollectionEditForm({ collection, allProducts }: any) {
  const router = useRouter();
  const initialProductIds = collection.products.map((cp: any) => cp.productId);

  const [formData, setFormData] = useState({
    name: collection.name || "",
    slug: collection.slug || "",
    description: collection.description || "",
    heroImage: collection.heroImage || "",
    isPublished: collection.isPublished,
    productIds: initialProductIds,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProductToggle = (id: string) => {
    setFormData((prev: any) => ({
      ...prev,
      productIds: prev.productIds.includes(id)
        ? prev.productIds.filter((p: string) => p !== id)
        : [...prev.productIds, id],
    }));
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch(`/api/admin/collections/${collection.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to update collection.");

      router.push("/admin/collections");
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err.message);
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Remove this collection from the atelier?")) return;
    try {
      await fetch(`/api/admin/collections/${collection.id}`, { method: "DELETE" });
      router.push("/admin/collections");
      router.refresh();
    } catch {}
  };

  return (
    <form onSubmit={handleUpdate} className="space-y-6 bg-white border border-gold/30 p-8">
      {errorMsg && (
        <div className="p-4 border border-gold bg-cream text-gold text-xs uppercase tracking-luxury text-center">
          {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[11px] uppercase tracking-luxury text-gold mb-1">COLLECTION NAME *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full bg-cream border border-gold/40 px-4 py-2.5 text-xs text-gold focus:outline-none focus:border-gold"
          />
        </div>
        <div>
          <label className="block text-[11px] uppercase tracking-luxury text-gold mb-1">SLUG *</label>
          <input
            type="text"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            required
            className="w-full bg-cream border border-gold/40 px-4 py-2.5 text-xs text-gold focus:outline-none focus:border-gold"
          />
        </div>
      </div>

      <div>
        <label className="block text-[11px] uppercase tracking-luxury text-gold mb-1">HERO BANNER IMAGE URL</label>
        <input
          type="text"
          name="heroImage"
          value={formData.heroImage}
          onChange={handleChange}
          className="w-full bg-cream border border-gold/40 px-4 py-2.5 text-xs text-gold focus:outline-none focus:border-gold"
        />
      </div>

      <div>
        <label className="block text-[11px] uppercase tracking-luxury text-gold mb-1">EDITORIAL DESCRIPTION</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="w-full bg-cream border border-gold/40 px-4 py-2.5 text-xs uppercase text-gold focus:outline-none focus:border-gold"
        />
      </div>

      {/* Product Allocation */}
      <div>
        <label className="block text-[11px] uppercase tracking-luxury text-gold mb-2">
          ALLOCATED PIECES ({formData.productIds.length})
        </label>
        {allProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto p-3 border border-gold/20 bg-cream">
            {allProducts.map((p: any) => {
              const isSelected = formData.productIds.includes(p.id);
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleProductToggle(p.id)}
                  className={`flex items-center gap-3 p-2 text-left border transition-colors ${
                    isSelected
                      ? "border-gold bg-gold text-white font-medium"
                      : "border-gold/30 bg-white text-gold hover:border-gold"
                  }`}
                >
                  <div className="w-8 h-8 bg-cream border border-gold/30 overflow-hidden shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.images?.[0]?.url || "/assets/mahaleela-logo.jpg"} alt={p.name} className="w-full h-full object-cover" />
                  </div>
                  <span className="text-xs uppercase truncate">{p.name}</span>
                </button>
              );
            })}
          </div>
        ) : (
          <p className="text-xs text-gold/70 py-2">No products in catalogue yet.</p>
        )}
      </div>

      <div className="border-t border-gold/20 pt-6 flex items-center justify-between">
        <button
          type="button"
          onClick={handleDelete}
          className="px-4 py-2 border border-gold text-gold text-xs uppercase tracking-luxury hover:bg-gold hover:text-white transition-colors flex items-center gap-1.5"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>DELETE COLLECTION</span>
        </button>

        <div className="flex items-center gap-4">
          <Link
            href="/admin/collections"
            className="px-6 py-2.5 border border-gold bg-white text-gold text-xs uppercase tracking-luxury hover:bg-cream transition-colors"
          >
            CANCEL
          </Link>
          <button
            type="submit"
            disabled={isLoading}
            className="px-8 py-2.5 border border-gold bg-gold text-white text-xs uppercase tracking-luxury hover:bg-white hover:text-gold transition-colors font-bold"
          >
            {isLoading ? "SAVING..." : "UPDATE COLLECTION"}
          </button>
        </div>
      </div>
    </form>
  );
}

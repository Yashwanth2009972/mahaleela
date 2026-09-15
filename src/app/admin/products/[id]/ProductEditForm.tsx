"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { ImageDeviceUpload } from "@/components/admin/ImageDeviceUpload";

export function ProductEditForm({ product, categories, collections }: any) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: product.name || "",
    slug: product.slug || "",
    categoryId: product.categoryId || "",
    price: product.price?.toString() || "",
    mrp: product.mrp?.toString() || "",
    sku: product.sku || "",
    stock: product.stock?.toString() || "0",
    badge: product.badge || "",
    description: product.description || "",
    details: product.details || "",
    sizeFit: product.sizeFit || "",
    materialCare: product.materialCare || "",
    shippingReturns: product.shippingReturns || "",
    isPublished: product.isPublished,
  });

  const [uploadedImages, setUploadedImages] = useState<string[]>(
    (product.images || []).map((i: any) => i.url)
  );
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          price: Number(formData.price),
          mrp: Number(formData.mrp || formData.price),
          stock: Number(formData.stock),
          images: uploadedImages.length > 0 ? uploadedImages : ["/assets/mahaleela-logo.jpg"],
        }),
      });

      if (!res.ok) throw new Error("Failed to update piece.");

      router.push("/admin/products");
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err.message);
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you wish to decommission this product from the atelier?")) return;
    setIsDeleting(true);
    try {
      await fetch(`/api/admin/products/${product.id}`, { method: "DELETE" });
      router.push("/admin/products");
      router.refresh();
    } catch {
      setIsDeleting(false);
    }
  };

  return (
    <form onSubmit={handleUpdate} className="space-y-6 bg-black border border-gold/30 p-8">
      {errorMsg && (
        <div className="p-4 border border-red-500 bg-red-950/30 text-red-300 text-xs uppercase tracking-luxury text-center">
          {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[11px] uppercase tracking-luxury text-gold mb-1">PRODUCT NAME *</label>
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
          <label className="block text-[11px] uppercase tracking-luxury text-gold mb-1">SLUG</label>
          <input
            type="text"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            required
            className="w-full bg-cream border border-gold/40 px-4 py-2.5 text-xs text-gold focus:outline-none focus:border-gold lowercase"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-[11px] uppercase tracking-luxury text-gold mb-1">DEPARTMENT</label>
          <select
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            className="w-full bg-cream border border-gold/40 px-4 py-2.5 text-xs text-gold focus:outline-none focus:border-gold"
          >
            {categories.map((c: any) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[11px] uppercase tracking-luxury text-gold mb-1">PRICE (₹) *</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            className="w-full bg-cream border border-gold/40 px-4 py-2.5 text-xs text-gold focus:outline-none focus:border-gold font-serif"
          />
        </div>

        <div>
          <label className="block text-[11px] uppercase tracking-luxury text-gold mb-1">STOCK UNITS</label>
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            className="w-full bg-cream border border-gold/40 px-4 py-2.5 text-xs text-gold focus:outline-none focus:border-gold font-serif"
          />
        </div>
      </div>

      {/* Direct Device Upload Component */}
      <div className="pt-2">
        <ImageDeviceUpload
          images={uploadedImages}
          onChange={setUploadedImages}
          multiple={true}
          label="UPDATE PRODUCT IMAGERY (DIRECT DEVICE UPLOAD)"
          aspectHint="SUPPORTS UP TO 24K ULTRA-HIGH FIDELITY • ALL FORMATS"
        />
      </div>

      <div>
        <label className="block text-[11px] uppercase tracking-luxury text-gold mb-1">EDITORIAL DESCRIPTION</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className="w-full bg-cream border border-gold/40 px-4 py-2.5 text-xs text-gold focus:outline-none focus:border-gold leading-relaxed"
        />
      </div>

      <div className="pt-4 border-t border-gold/20 flex items-center justify-between">
        <button
          type="button"
          onClick={handleDelete}
          disabled={isDeleting}
          className="px-4 py-2 border border-red-500/40 text-red-400 hover:bg-red-950/40 text-xs uppercase tracking-luxury flex items-center gap-1.5 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>DECOMMISSION PIECE</span>
        </button>

        <button
          type="submit"
          disabled={isLoading}
          className="px-8 py-2.5 border border-gold bg-gold text-black text-xs uppercase tracking-luxury font-bold hover:bg-white hover:text-black transition-colors"
        >
          {isLoading ? "SAVING..." : "SAVE MODIFICATIONS"}
        </button>
      </div>
    </form>
  );
}

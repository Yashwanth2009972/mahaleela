"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Smartphone } from "lucide-react";
import { ImageDeviceUpload } from "./ImageDeviceUpload";

export function GalleryManagerClient({ initialItems }: { initialItems: any[] }) {
  const router = useRouter();
  const [items, setItems] = useState(initialItems);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [formData, setFormData] = useState({
    images: [] as string[],
    orderIndex: "0",
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (formData.images.length === 0) {
      setErrorMsg("Please upload a 9:16 vertical photo from your device.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: formData.images[0],
          title: "",
          subtitle: "",
          orderIndex: Number(formData.orderIndex) || 0,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add to gallery.");

      setItems([...items, data.item]);
      setShowForm(false);
      setFormData({
        images: [],
        orderIndex: "0",
      });
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err.message || "Upload failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you wish to delete this photo from the 9:16 gallery?")) return;
    try {
      await fetch(`/api/admin/gallery?id=${id}`, { method: "DELETE" });
      setItems(items.filter((i) => i.id !== id));
      router.refresh();
    } catch {
      // error
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="border border-gold/30 bg-black p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-ultra text-gold/70 font-serif block mb-1">
            HOMEPAGE 9:16 PHOTO GALLERY
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl text-gold uppercase tracking-luxury font-normal">
            PHOTO GALLERY ({items.length})
          </h1>
          <p className="text-xs uppercase tracking-luxury text-gold/80 mt-1">
            PURE 9:16 VERTICAL PHOTOS DISPLAYED ON THE HOMEPAGE BELOW PRODUCTS (NO TEXT/TITLES)
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="px-6 py-3 border border-gold bg-gold text-black text-xs uppercase tracking-luxury font-semibold hover:bg-black hover:text-gold transition-colors inline-flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>{showForm ? "CANCEL" : "ADD 9:16 PHOTO"}</span>
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="border border-gold bg-black p-6 sm:p-8 space-y-6">
          <h2 className="font-serif text-lg text-gold uppercase tracking-luxury flex items-center gap-2">
            <Smartphone className="w-4 h-4" />
            <span>UPLOAD 9:16 VERTICAL PHOTO DIRECTLY FROM DEVICE</span>
          </h2>

          {errorMsg && (
            <div className="p-3 border border-red-500 bg-red-950/40 text-red-300 text-xs uppercase">
              {errorMsg}
            </div>
          )}

          <ImageDeviceUpload
            images={formData.images}
            onChange={(imgs) => setFormData({ ...formData, images: imgs })}
            multiple={false}
            label="SELECT 9:16 VERTICAL PHOTO"
            aspectHint="9:16 RATIO • UP TO 24K QUALITY • ALL FORMATS"
          />

          <div>
            <label className="block text-[10px] uppercase tracking-luxury text-gold mb-1">ORDER SEQUENCE</label>
            <input
              type="number"
              value={formData.orderIndex}
              onChange={(e) => setFormData({ ...formData, orderIndex: e.target.value })}
              className="w-full max-w-xs bg-cream border border-gold/40 px-3 py-2 text-xs text-gold focus:outline-none font-mono"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gold/20">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-6 py-2 border border-gold/40 text-gold text-xs uppercase hover:bg-cream"
            >
              CANCEL
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-2 border border-gold bg-gold text-black text-xs uppercase font-bold hover:bg-white transition-colors"
            >
              {isSubmitting ? "SAVING..." : "SAVE TO PHOTO GALLERY"}
            </button>
          </div>
        </form>
      )}

      {/* Gallery Items Grid */}
      <div className="border border-gold/30 bg-black p-6 space-y-6">
        <h2 className="font-serif text-base text-gold uppercase tracking-luxury">
          CURRENT ACTIVE 9:16 PHOTOS ({items.length})
        </h2>

        {items.length === 0 ? (
          <div className="p-12 text-center border border-gold/20 bg-cream">
            <p className="text-xs uppercase tracking-luxury text-gold/80">
              NO 9:16 PHOTOS IN GALLERY YET.
            </p>
            <p className="text-[10px] uppercase tracking-luxury text-gold/60 mt-1">
              CLICK &quot;ADD 9:16 PHOTO&quot; ABOVE TO UPLOAD HIGH-RESOLUTION VERTICAL SHOTS DIRECTLY FROM YOUR DEVICE.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="relative aspect-[9/16] border border-gold/40 bg-cream overflow-hidden group shadow-md"
              >
                <img
                  src={item.url}
                  alt="Gallery Photo"
                  className="w-full h-full object-cover"
                />

                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 bg-red-600 text-white hover:bg-red-700 transition-colors shadow"
                    title="Delete Photo"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
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
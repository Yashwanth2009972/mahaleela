"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export function OfferClient({ initialOffers }: { initialOffers: any[] }) {
  const router = useRouter();
  const [offers, setOffers] = useState(initialOffers);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [discountValue, setDiscountValue] = useState("15");
  const [targetType, setTargetType] = useState("ALL");
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);

    try {
      const res = await fetch("/api/admin/offers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          discountType: "PERCENTAGE",
          discountValue: Number(discountValue),
          targetType,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setOffers([data.offer, ...offers]);
        setTitle("");
        setDescription("");
        router.refresh();
      }
    } catch {} finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-7 border border-gold/30 bg-white p-6 shadow-sm overflow-x-auto">
        <h2 className="font-serif text-base text-gold uppercase tracking-luxury font-semibold border-b border-gold/20 pb-3 mb-4">
          ACTIVE ATELIER OFFERS
        </h2>
        {offers.length > 0 ? (
          <div className="space-y-3">
            {offers.map((o) => (
              <div key={o.id} className="border border-gold/20 bg-cream p-4 flex justify-between items-center">
                <div>
                  <h4 className="font-serif font-bold text-xs uppercase tracking-luxury text-gold">{o.title}</h4>
                  <p className="text-[10px] uppercase text-gold/70 mt-0.5">{o.description}</p>
                  <span className="text-[9px] border border-gold px-1.5 py-0.2 bg-white text-gold mt-1 inline-block">
                    {o.targetType} � {o.discountValue}% OFF
                  </span>
                </div>
                <span className="text-[10px] text-gold font-bold">
                  {o.isActive ? "ACTIVE" : "EXPIRED"}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gold/70 py-6 text-center">NO PROMOTIONAL OFFERS ACTIVE.</p>
        )}
      </div>

      <div className="lg:col-span-5 border border-gold/30 bg-cream p-6 shadow-sm">
        <h2 className="font-serif text-base text-gold uppercase tracking-luxury font-semibold border-b border-gold/20 pb-3 mb-4">
          LAUNCH PROMOTION
        </h2>
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-[10px] uppercase tracking-luxury text-gold mb-1">OFFER TITLE *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="E.G. AUTUMN SALON PRIVILEGE"
              className="w-full bg-white border border-gold/40 px-3 py-2 text-xs uppercase text-gold focus:outline-none focus:border-gold font-serif"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-luxury text-gold mb-1">DESCRIPTION</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="E.G. COMPLIMENTARY BRASS KEYCHAIN WITH PURCHASES OVER ?5,000"
              className="w-full bg-white border border-gold/40 px-3 py-2 text-xs uppercase text-gold focus:outline-none focus:border-gold"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] uppercase tracking-luxury text-gold mb-1">PERCENTAGE</label>
              <input
                type="number"
                value={discountValue}
                onChange={(e) => setDiscountValue(e.target.value)}
                className="w-full bg-white border border-gold/40 px-3 py-2 text-xs text-gold focus:outline-none focus:border-gold font-serif"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-luxury text-gold mb-1">SCOPE</label>
              <select
                value={targetType}
                onChange={(e) => setTargetType(e.target.value)}
                className="w-full bg-white border border-gold/40 px-3 py-2 text-xs uppercase text-gold focus:outline-none focus:border-gold"
              >
                <option value="ALL">ENTIRE CATALOGUE</option>
                <option value="CATEGORY">CATEGORY</option>
                <option value="COLLECTION">COLLECTION</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={isCreating}
            className="w-full py-3 border border-gold bg-gold text-white text-xs uppercase tracking-luxury hover:bg-white hover:text-gold transition-colors font-bold mt-2"
          >
            {isCreating ? "LAUNCHING..." : "LAUNCH SPECIAL OFFER"}
          </button>
        </form>
      </div>
    </div>
  );
}

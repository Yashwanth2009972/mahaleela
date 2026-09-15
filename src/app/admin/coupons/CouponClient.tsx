"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export function CouponClient({ initialCoupons }: { initialCoupons: any[] }) {
  const router = useRouter();
  const [coupons, setCoupons] = useState(initialCoupons);
  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState("PERCENTAGE");
  const [discountValue, setDiscountValue] = useState("10");
  const [minOrder, setMinOrder] = useState("0");
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);

    try {
      const res = await fetch("/api/admin/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          discountType,
          discountValue: Number(discountValue),
          minOrder: Number(minOrder),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setCoupons([data.coupon, ...coupons]);
        setCode("");
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
          REGISTERED PROMOTIONS
        </h2>
        {coupons.length > 0 ? (
          <table className="w-full text-left text-xs uppercase tracking-luxury">
            <thead>
              <tr className="border-b border-gold/20 text-[10px] text-gold/70">
                <th className="pb-3">CODE</th>
                <th className="pb-3">COURTESY</th>
                <th className="pb-3">MIN ORDER</th>
                <th className="pb-3">USED</th>
                <th className="pb-3 text-right">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold/10">
              {coupons.map((c) => (
                <tr key={c.id}>
                  <td className="py-3 font-serif font-bold text-gold">{c.code}</td>
                  <td className="py-3 font-medium text-gold">
                    {c.discountType === "PERCENTAGE" ? `${c.discountValue}% OFF` : `?${c.discountValue} FLAT`}
                  </td>
                  <td className="py-3 text-gold/80">?{c.minOrder.toLocaleString("en-IN")}</td>
                  <td className="py-3 text-gold/80">{c.timesUsed} TIMES</td>
                  <td className="py-3 text-right">
                    <span className="border border-gold px-2 py-0.5 bg-cream text-[9px] text-gold font-medium">
                      {c.isActive ? "ACTIVE" : "INACTIVE"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-xs text-gold/70 py-6 text-center">NO COUPONS CURRENTLY CONFIGURED.</p>
        )}
      </div>

      <div className="lg:col-span-5 border border-gold/30 bg-cream p-6 shadow-sm">
        <h2 className="font-serif text-base text-gold uppercase tracking-luxury font-semibold border-b border-gold/20 pb-3 mb-4">
          ISSUE NEW VOUCHER
        </h2>
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-[10px] uppercase tracking-luxury text-gold mb-1">PROMO CODE *</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              placeholder="E.G. ATELIER10"
              className="w-full bg-white border border-gold/40 px-3 py-2 text-xs uppercase text-gold focus:outline-none focus:border-gold font-serif font-bold"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] uppercase tracking-luxury text-gold mb-1">TYPE</label>
              <select
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value)}
                className="w-full bg-white border border-gold/40 px-3 py-2 text-xs uppercase text-gold focus:outline-none focus:border-gold"
              >
                <option value="PERCENTAGE">PERCENTAGE (%)</option>
                <option value="FIXED">FIXED AMOUNT (?)</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-luxury text-gold mb-1">VALUE</label>
              <input
                type="number"
                value={discountValue}
                onChange={(e) => setDiscountValue(e.target.value)}
                required
                className="w-full bg-white border border-gold/40 px-3 py-2 text-xs text-gold focus:outline-none focus:border-gold font-serif"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-luxury text-gold mb-1">MIN ORDER THRESHOLD (?)</label>
            <input
              type="number"
              value={minOrder}
              onChange={(e) => setMinOrder(e.target.value)}
              className="w-full bg-white border border-gold/40 px-3 py-2 text-xs text-gold focus:outline-none focus:border-gold font-serif"
            />
          </div>

          <button
            type="submit"
            disabled={isCreating}
            className="w-full py-3 border border-gold bg-gold text-white text-xs uppercase tracking-luxury hover:bg-white hover:text-gold transition-colors font-bold mt-2"
          >
            {isCreating ? "ISSUING..." : "ISSUE PROMO CODE"}
          </button>
        </form>
      </div>
    </div>
  );
}

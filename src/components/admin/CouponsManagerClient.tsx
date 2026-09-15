"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Tag, Check, Sparkles } from "lucide-react";

export function CouponsManagerClient({ initialCoupons }: { initialCoupons: any[] }) {
  const router = useRouter();
  const [coupons, setCoupons] = useState(initialCoupons);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [formData, setFormData] = useState({
    code: "",
    discountValue: "10",
    discountType: "PERCENTAGE",
    minOrder: "0",
    isActive: true,
  });

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/admin/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create coupon.");

      setCoupons([data.coupon, ...coupons]);
      setShowForm(false);
      setFormData({
        code: "",
        discountValue: "10",
        discountType: "PERCENTAGE",
        minOrder: "0",
        isActive: true,
      });
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to add coupon.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to decommission this coupon?")) return;
    try {
      await fetch(`/api/admin/coupons?id=${id}`, { method: "DELETE" });
      setCoupons(coupons.filter((c) => c.id !== id));
      router.refresh();
    } catch {
      // error
    }
  };

  return (
    <div className="space-y-8">
      <div className="border border-gold/30 bg-cream p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-ultra text-gold/70 font-serif block mb-1">
            PRIVILEGE INCENTIVES
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl text-gold uppercase tracking-luxury font-normal">
            COUPONS & PROMOTIONAL DISCOUNTS ({coupons.length})
          </h1>
          <p className="text-xs uppercase tracking-luxury text-gold/80 mt-1">
            CONCIERGE CODES VISIBLE ON PRODUCT CATALOGUE AND REDEEMABLE AT CHECKOUT
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="px-6 py-3 border border-gold bg-gold text-black text-xs uppercase tracking-luxury font-semibold hover:bg-black hover:text-gold transition-colors inline-flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>{showForm ? "CANCEL" : "CREATE NEW COUPON"}</span>
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreateCoupon} className="border border-gold bg-black p-6 sm:p-8 space-y-6">
          <h2 className="font-serif text-lg text-gold uppercase tracking-luxury">
            REGISTER NEW PRIVILEGE CODE
          </h2>

          {errorMsg && (
            <div className="p-3 border border-red-500 bg-red-950/40 text-red-300 text-xs uppercase">
              {errorMsg}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-[10px] uppercase tracking-luxury text-gold mb-1">COUPON CODE *</label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                required
                placeholder="E.G. MAHALEELA10"
                className="w-full bg-cream border border-gold/40 px-3 py-2 text-xs uppercase text-gold focus:outline-none focus:border-gold font-mono"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-luxury text-gold mb-1">DISCOUNT VALUE *</label>
              <input
                type="number"
                value={formData.discountValue}
                onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                required
                placeholder="10"
                className="w-full bg-cream border border-gold/40 px-3 py-2 text-xs text-gold focus:outline-none focus:border-gold font-serif"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-luxury text-gold mb-1">TYPE</label>
              <select
                value={formData.discountType}
                onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                className="w-full bg-cream border border-gold/40 px-3 py-2 text-xs text-gold focus:outline-none"
              >
                <option value="PERCENTAGE">PERCENTAGE (% OFF)</option>
                <option value="FIXED">FIXED AMOUNT (₹ OFF)</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-luxury text-gold mb-1">MINIMUM ORDER (₹)</label>
              <input
                type="number"
                value={formData.minOrder}
                onChange={(e) => setFormData({ ...formData, minOrder: e.target.value })}
                placeholder="0"
                className="w-full bg-cream border border-gold/40 px-3 py-2 text-xs text-gold focus:outline-none font-serif"
              />
            </div>
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
              {isSubmitting ? "SAVING..." : "ACTIVATE COUPON"}
            </button>
          </div>
        </form>
      )}

      {/* Coupons Table */}
      <div className="border border-gold/30 bg-black p-6 shadow-sm overflow-x-auto">
        {coupons.length > 0 ? (
          <table className="w-full text-left text-xs uppercase tracking-luxury">
            <thead>
              <tr className="border-b border-gold/20 text-[10px] text-gold/70">
                <th className="pb-3">COUPON CODE</th>
                <th className="pb-3">DISCOUNT</th>
                <th className="pb-3">MIN ORDER</th>
                <th className="pb-3">STATUS</th>
                <th className="pb-3 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold/10">
              {coupons.map((c) => (
                <tr key={c.id} className="hover:bg-cream/40 transition-colors">
                  <td className="py-3 font-mono font-bold text-gold text-sm flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-gold" />
                    <span>{c.code}</span>
                  </td>
                  <td className="py-3 font-serif font-bold text-gold">
                    {c.discountType === "PERCENTAGE" ? `${c.discountValue}% OFF` : `₹${c.discountValue} OFF`}
                  </td>
                  <td className="py-3 text-gold/80">₹{c.minOrder?.toLocaleString("en-IN") || 0}</td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 border text-[9px] font-bold ${
                      c.isActive ? "border-green-500 text-green-300 bg-green-950/40" : "border-gold/30 text-gold/60"
                    }`}>
                      {c.isActive ? "ACTIVE" : "INACTIVE"}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <button
                      type="button"
                      onClick={() => handleDelete(c.id)}
                      className="p-1.5 border border-red-500/40 text-red-400 hover:bg-red-950/30 transition-colors"
                      title="Delete coupon"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="py-12 text-center text-gold/80 space-y-2">
            <Tag className="w-8 h-8 mx-auto text-gold opacity-50" />
            <p className="font-serif text-sm">NO COUPONS CREATED YET</p>
            <p className="text-[10px] text-gold/60">Click "Create New Coupon" to offer promotions to patrons.</p>
          </div>
        )}
      </div>
    </div>
  );
}

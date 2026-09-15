"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ORDER_STATUSES, BRAND } from "@/lib/constants";
import { Save, CheckCircle2, XCircle, Printer, MessageCircle } from "lucide-react";

export function OrderStatusUpdateForm({ order, addressObj }: any) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    orderStatus: order.orderStatus,
    paymentStatus: order.paymentStatus,
    trackingNumber: order.trackingNumber || "",
    trackingUrl: order.trackingUrl || "",
    rejectionReason: order.rejectionReason || "",
    notes: order.notes || "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const handleStatusUpdate = async (overrideStatus?: string, customPaymentStatus?: string) => {
    setIsLoading(true);
    setSuccessMsg("");

    const payload = {
      ...formData,
      orderStatus: overrideStatus || formData.orderStatus,
      paymentStatus: customPaymentStatus || formData.paymentStatus,
    };

    try {
      const res = await fetch(`/api/admin/orders/${order.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to update status.");
      setSuccessMsg(`Order status updated to ${payload.orderStatus}.`);
      setFormData(payload);
      router.refresh();
    } catch {
      // error
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptOrder = () => {
    handleStatusUpdate("ACCEPTED", order.paymentMethod === "UPI" ? "PAID" : "PENDING");
  };

  const handleRejectOrder = () => {
    const reason = prompt("Enter reason for rejecting this order (e.g. Unserviceable location, out of allocation):");
    if (reason === null) return;
    setFormData((prev) => ({ ...prev, rejectionReason: reason }));
    handleStatusUpdate("REJECTED");
  };

  const openWhatsAppClient = () => {
    const text = `Hello ${order.customerName}, regarding your MAHALEELA Order ${order.orderNumber}:
Status: ${formData.orderStatus}
Total: ₹${order.total.toLocaleString("en-IN")} + delivery charges according to your location.
Please let us know if you need assistance.`;
    window.open(`https://wa.me/91${order.phone}?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <div className="space-y-6 bg-black border border-gold/30 p-8 shadow-sm">
      {successMsg && (
        <div className="p-3 border border-gold bg-cream text-gold text-xs uppercase tracking-luxury text-center">
          {successMsg}
        </div>
      )}

      {/* QUICK ACCEPT / REJECT / SHIPPING LABEL BAR */}
      <div className="border border-gold/40 bg-cream/40 p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-[9px] uppercase tracking-ultra text-gold/70 block">
            ADMIN VERIFICATION ACTIONS ({order.orderType || "WEBSITE ORDER"})
          </span>
          <p className="text-xs uppercase tracking-wider text-gold font-bold">
            CURRENT DISPATCH STATUS: {formData.orderStatus}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleAcceptOrder}
            disabled={isLoading}
            className="px-4 py-2 border border-green-500 bg-green-950/60 text-green-300 text-xs uppercase tracking-luxury font-bold hover:bg-green-600 hover:text-white transition-colors flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>ACCEPT ORDER</span>
          </button>

          <button
            type="button"
            onClick={handleRejectOrder}
            disabled={isLoading}
            className="px-4 py-2 border border-red-500 bg-red-950/60 text-red-300 text-xs uppercase tracking-luxury font-bold hover:bg-red-600 hover:text-white transition-colors flex items-center gap-1.5"
          >
            <XCircle className="w-4 h-4" />
            <span>REJECT ORDER</span>
          </button>

          <Link
            href={`/admin/orders/${order.id}/shipping-label`}
            className="px-4 py-2 border border-gold bg-gold text-black text-xs uppercase tracking-luxury font-bold hover:bg-white transition-colors flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>AUTO-GENERATE SHIPPING LABEL</span>
          </Link>

          <button
            type="button"
            onClick={openWhatsAppClient}
            className="px-3 py-2 border border-gold/40 text-gold text-xs uppercase tracking-luxury hover:bg-cream transition-colors flex items-center gap-1"
          >
            <MessageCircle className="w-4 h-4" />
            <span>WHATSAPP PATRON</span>
          </button>
        </div>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); handleStatusUpdate(); }} className="space-y-6 pt-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-[11px] uppercase tracking-luxury text-gold mb-1">
              DISPATCH STATUS *
            </label>
            <select
              value={formData.orderStatus}
              onChange={(e) => setFormData({ ...formData, orderStatus: e.target.value })}
              className="w-full bg-cream border border-gold/40 px-3 py-2 text-xs uppercase text-gold focus:outline-none focus:border-gold font-semibold"
            >
              {ORDER_STATUSES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-luxury text-gold mb-1">
              PAYMENT STATUS *
            </label>
            <select
              value={formData.paymentStatus}
              onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value })}
              className="w-full bg-cream border border-gold/40 px-3 py-2 text-xs uppercase text-gold focus:outline-none focus:border-gold font-semibold"
            >
              <option value="PENDING">PENDING</option>
              <option value="PAID">PAID</option>
              <option value="FAILED">FAILED</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-[11px] uppercase tracking-luxury text-gold mb-1">
              WAYBILL / COURIER TRACKING NUMBER
            </label>
            <input
              type="text"
              value={formData.trackingNumber}
              onChange={(e) => setFormData({ ...formData, trackingNumber: e.target.value })}
              placeholder="E.G. BLR-AWB-98765432"
              className="w-full bg-cream border border-gold/40 px-3 py-2 text-xs uppercase text-gold focus:outline-none focus:border-gold"
            />
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-luxury text-gold mb-1">
              CARRIER TRACKING URL
            </label>
            <input
              type="text"
              value={formData.trackingUrl}
              onChange={(e) => setFormData({ ...formData, trackingUrl: e.target.value })}
              placeholder="https://track.courier.in/..."
              className="w-full bg-cream border border-gold/40 px-3 py-2 text-xs text-gold focus:outline-none focus:border-gold"
            />
          </div>
        </div>

        {formData.rejectionReason && (
          <div>
            <label className="block text-[11px] uppercase tracking-luxury text-red-400 mb-1">
              REJECTION / CANCELLATION REASON
            </label>
            <input
              type="text"
              value={formData.rejectionReason}
              onChange={(e) => setFormData({ ...formData, rejectionReason: e.target.value })}
              className="w-full bg-cream border border-red-500/50 px-3 py-2 text-xs text-red-300 focus:outline-none"
            />
          </div>
        )}

        <div>
          <label className="block text-[11px] uppercase tracking-luxury text-gold mb-1">
            INTERNAL AUDIT NOTES
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            rows={3}
            placeholder="Special client handling, courier dispatch confirmation..."
            className="w-full bg-cream border border-gold/40 px-3 py-2 text-xs text-gold focus:outline-none focus:border-gold"
          />
        </div>

        <div className="flex justify-end pt-4 border-t border-gold/20">
          <button
            type="submit"
            disabled={isLoading}
            className="px-8 py-2.5 border border-gold bg-gold text-black text-xs uppercase tracking-luxury font-bold hover:bg-white hover:text-black transition-colors flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>SAVE DOSSIER AUDIT</span>
          </button>
        </div>
      </form>
    </div>
  );
}

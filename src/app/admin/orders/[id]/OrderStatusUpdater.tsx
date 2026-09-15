"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ORDER_STATUSES } from "@/lib/constants";
import { Check, Sparkles } from "lucide-react";

interface OrderStatusUpdaterProps {
  orderId: string;
  currentStatus: string;
  currentPaymentStatus: string;
  currentTrackingNumber: string;
  currentTrackingUrl: string;
}

export const OrderStatusUpdater: React.FC<OrderStatusUpdaterProps> = ({
  orderId,
  currentStatus,
  currentPaymentStatus,
  currentTrackingNumber,
  currentTrackingUrl,
}) => {
  const router = useRouter();

  const [status, setStatus] = useState(currentStatus);
  const [paymentStatus, setPaymentStatus] = useState(currentPaymentStatus);
  const [trackingNumber, setTrackingNumber] = useState(currentTrackingNumber);
  const [trackingUrl, setTrackingUrl] = useState(currentTrackingUrl);
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState("");

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setMessage("");

    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderStatus: status,
          paymentStatus,
          trackingNumber,
          trackingUrl,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update order");

      setMessage("ORDER FULFILLMENT UPDATED SUCCESSFULLY.");
      router.refresh();
    } catch (err: any) {
      alert(err.message || "Update error");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <form onSubmit={handleUpdate} className="border border-gold/30 bg-cream p-6 sm:p-8 space-y-6 shadow-sm">
      <h3 className="font-serif text-lg text-gold uppercase tracking-wider pb-3 border-b border-gold/20 font-medium">
        ORDER STATUS & LOGISTICS
      </h3>

      {message && (
        <div className="p-3 border border-gold bg-white text-xs uppercase tracking-luxury text-gold font-medium flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>{message}</span>
        </div>
      )}

      {/* 9 Progression Status Selector */}
      <div>
        <label className="block text-xs uppercase tracking-luxury text-gold mb-2 font-medium">
          PROGRESSION MILESTONE (9 STAGES) *
        </label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full px-4 py-3 bg-white border border-gold text-xs uppercase tracking-wider text-gold focus:outline-none"
        >
          {ORDER_STATUSES.map((st) => (
            <option key={st} value={st}>
              {st}
            </option>
          ))}
        </select>
      </div>

      {/* Payment Status */}
      <div>
        <label className="block text-xs uppercase tracking-luxury text-gold mb-2 font-medium">
          PAYMENT CONFIRMATION STATUS *
        </label>
        <select
          value={paymentStatus}
          onChange={(e) => setPaymentStatus(e.target.value)}
          className="w-full px-4 py-3 bg-white border border-gold text-xs uppercase tracking-wider text-gold focus:outline-none"
        >
          <option value="PENDING">PENDING</option>
          <option value="PAID">PAID (AUTHORIZED)</option>
          <option value="FAILED">FAILED</option>
          <option value="REFUNDED">REFUNDED</option>
        </select>
      </div>

      {/* Courier Tracking */}
      <div className="space-y-4 pt-4 border-t border-gold/20">
        <div>
          <label className="block text-xs uppercase tracking-luxury text-gold mb-1 font-medium">
            COURIER WAYBILL / TRACKING NUMBER
          </label>
          <input
            type="text"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            placeholder="E.G. BLR-EXP-983742"
            className="w-full px-4 py-3 bg-white border border-gold text-xs uppercase tracking-wider text-gold focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-luxury text-gold mb-1 font-medium">
            COURIER TRACKING PORTAL URL
          </label>
          <input
            type="url"
            value={trackingUrl}
            onChange={(e) => setTrackingUrl(e.target.value)}
            placeholder="HTTPS://TRACK.DELHIVERY.COM/..."
            className="w-full px-4 py-3 bg-white border border-gold text-xs text-gold focus:outline-none"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isUpdating}
        className="w-full py-3.5 border border-gold bg-gold text-white text-xs uppercase tracking-luxury hover:bg-white hover:text-gold transition-colors font-medium flex items-center justify-center gap-2"
      >
        <Sparkles className="w-4 h-4" />
        <span>{isUpdating ? "UPDATING FULFILLMENT..." : "COMMIT STATUS UPDATE"}</span>
      </button>
    </form>
  );
};

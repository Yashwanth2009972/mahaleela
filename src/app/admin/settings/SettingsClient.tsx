"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Check, Sparkles, ShieldCheck } from "lucide-react";
import { BRAND } from "@/lib/constants";

interface AuditLogItem {
  id: string;
  adminEmail: string;
  action: string;
  details?: string | null;
  createdAt: Date;
}

interface SettingsClientProps {
  initialSettings: { [key: string]: string };
  auditLogs: AuditLogItem[];
}

export const SettingsClient: React.FC<SettingsClientProps> = ({
  initialSettings,
  auditLogs,
}) => {
  const router = useRouter();

  const [settings, setSettings] = useState({
    business_name: initialSettings.business_name || BRAND.name,
    business_address: initialSettings.business_address || BRAND.address,
    business_phone: initialSettings.business_phone || BRAND.phone,
    business_email: initialSettings.business_email || BRAND.email,
    shipping_free_threshold: initialSettings.shipping_free_threshold || "2000",
    shipping_cod_fee: initialSettings.shipping_cod_fee || "10",
    social_instagram: initialSettings.social_instagram || BRAND.socials.instagram,
    social_facebook: initialSettings.social_facebook || BRAND.socials.facebook,
    social_youtube: initialSettings.social_youtube || BRAND.socials.youtube,
    policy_shipping: initialSettings.policy_shipping || "",
    policy_returns: initialSettings.policy_returns || "",
    policy_exchange: initialSettings.policy_exchange || "",
  });

  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState("");

  const handleChange = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setFeedback("");

    try {
      const payload = Object.entries(settings).map(([key, value]) => ({
        key,
        value,
      }));

      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings: payload }),
      });

      if (!res.ok) throw new Error("Failed to save settings");

      setFeedback("ALL ATELIER SETTINGS PRESERVED SUCCESSFULLY.");
      router.refresh();
    } catch {
      alert("Error saving settings");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-8 pb-16">
      {feedback && (
        <div className="p-3 border border-gold bg-cream text-xs uppercase tracking-luxury text-gold font-medium flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Brand & Locked 3-Color Policy Notice */}
      <div className="border border-gold/30 bg-white p-6 sm:p-8 space-y-4 shadow-sm">
        <div className="flex justify-between items-center pb-3 border-b border-gold/20">
          <h3 className="font-serif text-lg text-gold uppercase tracking-wider font-medium">
            1. BRAND IDENTITY & PALETTE ENFORCEMENT
          </h3>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 border border-gold bg-cream text-[10px] uppercase font-semibold text-gold">
            <Lock className="w-3 h-3" />
            <span>COLOURS PERMANENTLY LOCKED</span>
          </div>
        </div>

        {/* The 3 Approved Hex Codes */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="border border-gold/40 p-4 bg-white flex items-center gap-3">
            <div className="w-10 h-10 border border-gold bg-white flex-shrink-0" />
            <div>
              <p className="font-serif text-xs uppercase text-gold font-bold">COLOUR 1: BLACK</p>
              <p className="text-xs text-gold/70 font-mono">#000000</p>
            </div>
          </div>

          <div className="border border-gold/40 p-4 bg-white flex items-center gap-3">
            <div className="w-10 h-10 border border-gold bg-cream flex-shrink-0" />
            <div>
              <p className="font-serif text-xs uppercase text-gold font-bold">COLOUR 2: CHARCOAL GREY</p>
              <p className="text-xs text-gold/70 font-mono">#1E1E1E</p>
            </div>
          </div>

          <div className="border border-gold/40 p-4 bg-white flex items-center gap-3">
            <div className="w-10 h-10 border border-gold bg-gold flex-shrink-0" />
            <div>
              <p className="font-serif text-xs uppercase text-gold font-bold">COLOUR 3: LUXURY GOLD</p>
              <p className="text-xs text-gold/70 font-mono">#C9A45C</p>
            </div>
          </div>
        </div>

        <p className="text-[10px] uppercase tracking-luxury text-gold/70 pt-2 font-light">
          ABSOLUTE PALETTE RULE: NO OTHER COLOURS MAY BE INTRODUCED ACROSS STOREFRONT OR ADMIN.
        </p>
      </div>

      {/* Business Coordinates & Phone */}
      <div className="border border-gold/30 bg-white p-6 sm:p-8 space-y-4 shadow-sm">
        <h3 className="font-serif text-lg text-gold uppercase tracking-wider pb-3 border-b border-gold/20 font-medium">
          2. BUSINESS COORDINATES & CONCIERGE
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-luxury text-gold mb-1 font-medium">
              BRAND DISPLAY NAME *
            </label>
            <input
              type="text"
              disabled
              value={settings.business_name}
              className="w-full px-4 py-3 bg-cream/30 border border-gold text-xs uppercase tracking-wider text-gold opacity-90 cursor-not-allowed"
            />
            <span className="text-[9px] text-gold/60 mt-1 block">
              ALWAYS DISPLAYED STRICTLY AS "MAHALEELA".
            </span>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-luxury text-gold mb-1 font-medium">
              CONCIERGE TELEPHONE *
            </label>
            <input
              type="text"
              value={settings.business_phone}
              onChange={(e) => handleChange("business_phone", e.target.value)}
              className="w-full px-4 py-3 bg-cream/30 border border-gold text-xs uppercase tracking-wider text-gold focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-luxury text-gold mb-1 font-medium">
            ATELIER HEADQUARTERS ADDRESS *
          </label>
          <textarea
            rows={3}
            value={settings.business_address}
            onChange={(e) => handleChange("business_address", e.target.value)}
            className="w-full px-4 py-3 bg-cream/30 border border-gold text-xs uppercase tracking-wider text-gold focus:outline-none"
          />
        </div>
      </div>

      {/* Shipping & Delivery Economics */}
      <div className="border border-gold/30 bg-white p-6 sm:p-8 space-y-4 shadow-sm">
        <h3 className="font-serif text-lg text-gold uppercase tracking-wider pb-3 border-b border-gold/20 font-medium">
          3. PAN-INDIA SHIPPING & COD RULES
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-luxury text-gold mb-1 font-medium">
              COMPLIMENTARY SHIPPING THRESHOLD (₹) *
            </label>
            <input
              type="number"
              value={settings.shipping_free_threshold}
              onChange={(e) => handleChange("shipping_free_threshold", e.target.value)}
              className="w-full px-4 py-3 bg-cream/30 border border-gold text-xs font-serif text-gold focus:outline-none"
            />
            <span className="text-[9px] text-gold/60 mt-1 block">
              DEFAULT: ₹2,000 (FREE SHIPPING ABOVE THIS VALUE)
            </span>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-luxury text-gold mb-1 font-medium">
              CASH ON DELIVERY CONVENIENCE FEE (₹) *
            </label>
            <input
              type="number"
              value={settings.shipping_cod_fee}
              onChange={(e) => handleChange("shipping_cod_fee", e.target.value)}
              className="w-full px-4 py-3 bg-cream/30 border border-gold text-xs font-serif text-gold focus:outline-none"
            />
            <span className="text-[9px] text-gold/60 mt-1 block">
              DEFAULT: ₹10 (APPLIED WHEN COD IS CHOSEN)
            </span>
          </div>
        </div>
      </div>

      {/* Social Network URLs (Strictly No Threads) */}
      <div className="border border-gold/30 bg-white p-6 sm:p-8 space-y-4 shadow-sm">
        <h3 className="font-serif text-lg text-gold uppercase tracking-wider pb-3 border-b border-gold/20 font-medium">
          4. OFFICIAL SOCIAL CHANNELS (THREADS STRICTLY EXCLUDED)
        </h3>

        <div className="space-y-3">
          <div>
            <label className="block text-xs uppercase tracking-luxury text-gold mb-1 font-medium">
              INSTAGRAM URL
            </label>
            <input
              type="url"
              value={settings.social_instagram}
              onChange={(e) => handleChange("social_instagram", e.target.value)}
              className="w-full px-4 py-3 bg-cream/30 border border-gold text-xs text-gold focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-luxury text-gold mb-1 font-medium">
              FACEBOOK URL
            </label>
            <input
              type="url"
              value={settings.social_facebook}
              onChange={(e) => handleChange("social_facebook", e.target.value)}
              className="w-full px-4 py-3 bg-cream/30 border border-gold text-xs text-gold focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-luxury text-gold mb-1 font-medium">
              YOUTUBE URL
            </label>
            <input
              type="url"
              value={settings.social_youtube}
              onChange={(e) => handleChange("social_youtube", e.target.value)}
              className="w-full px-4 py-3 bg-cream/30 border border-gold text-xs text-gold focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Policies */}
      <div className="border border-gold/30 bg-white p-6 sm:p-8 space-y-4 shadow-sm">
        <h3 className="font-serif text-lg text-gold uppercase tracking-wider pb-3 border-b border-gold/20 font-medium">
          5. ATELIER CHARTERS & POLICIES
        </h3>

        <div>
          <label className="block text-xs uppercase tracking-luxury text-gold mb-1 font-medium">
            RETURNS POLICY TERMS
          </label>
          <textarea
            rows={3}
            value={settings.policy_returns}
            onChange={(e) => handleChange("policy_returns", e.target.value)}
            className="w-full px-4 py-3 bg-cream/30 border border-gold text-xs uppercase tracking-wider text-gold focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-luxury text-gold mb-1 font-medium">
            EXCHANGE POLICY TERMS
          </label>
          <textarea
            rows={3}
            value={settings.policy_exchange}
            onChange={(e) => handleChange("policy_exchange", e.target.value)}
            className="w-full px-4 py-3 bg-cream/30 border border-gold text-xs uppercase tracking-wider text-gold focus:outline-none"
          />
        </div>
      </div>

      {/* Save Button */}
      <button
        type="submit"
        disabled={isSaving}
        className="w-full py-4 border border-gold bg-gold text-white text-xs uppercase tracking-luxury hover:bg-white hover:text-gold transition-colors font-medium flex items-center justify-center gap-2"
      >
        <Sparkles className="w-4 h-4" />
        <span>{isSaving ? "PRESERVING SETTINGS..." : "COMMIT ATELIER SETTINGS"}</span>
      </button>

      {/* Audit Logs Table */}
      <div className="border border-gold/30 bg-white p-6 sm:p-8 space-y-4 shadow-sm">
        <h3 className="font-serif text-lg text-gold uppercase tracking-wider pb-3 border-b border-gold/20 font-medium">
          6. ADMINISTRATOR AUDIT LOGS
        </h3>

        {auditLogs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-gold/20 bg-cream text-gold font-serif">
                  <th className="py-2.5 px-3">TIMESTAMP</th>
                  <th className="py-2.5 px-3">ADMINISTRATOR</th>
                  <th className="py-2.5 px-3">ACTION</th>
                  <th className="py-2.5 px-3">DETAILS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gold/10">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-cream/40">
                    <td className="py-2.5 px-3 text-gold/70 text-[10px]">
                      {new Date(log.createdAt).toLocaleString("en-IN")}
                    </td>
                    <td className="py-2.5 px-3 text-gold font-medium">
                      {log.adminEmail}
                    </td>
                    <td className="py-2.5 px-3 font-serif font-bold text-gold">
                      {log.action}
                    </td>
                    <td className="py-2.5 px-3 text-gold/80 text-[11px]">
                      {log.details || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-xs uppercase tracking-luxury text-gold/70 py-4">
            Audit trail initialized. All administrative updates will be captured here.
          </p>
        )}
      </div>
    </form>
  );
};

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Check } from "lucide-react";

interface AdminExclusiveClientProps {
  currentMode: string;
}

export const AdminExclusiveClient: React.FC<AdminExclusiveClientProps> = ({ currentMode }) => {
  const router = useRouter();
  const [mode, setMode] = useState(currentMode);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState("");

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setFeedback("");

    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          settings: [{ key: "exclusive_eligibility_mode", value: mode }],
        }),
      });

      if (!res.ok) throw new Error("Failed to update exclusive settings");

      setFeedback("SALON ELIGIBILITY CRITERIA SAVED SUCCESSFULLY.");
      router.refresh();
    } catch {
      alert("Error saving settings");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="border border-gold/30 bg-white p-6 sm:p-8 space-y-6 shadow-sm">
      <h3 className="font-serif text-lg text-gold uppercase tracking-wider pb-3 border-b border-gold/20 font-medium">
        SALON ADMISSION MODE
      </h3>

      {feedback && (
        <div className="p-3 border border-gold bg-cream text-xs uppercase tracking-luxury text-gold font-medium flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>{feedback}</span>
        </div>
      )}

      <div className="space-y-3">
        <label className="block text-xs uppercase tracking-luxury text-gold mb-2 font-medium">
          SELECT SALON ADMISSION CRITERIA *
        </label>

        {[
          {
            key: "PUBLIC",
            title: "PUBLIC ACCESS",
            desc: "All storefront visitors can browse and acquire exclusive pieces.",
          },
          {
            key: "LOGGED-IN",
            title: "LOGGED-IN PATRONS (DEFAULT)",
            desc: "Requires patrons to have a registered and authenticated account.",
          },
          {
            key: "APPROVED",
            title: "CONCIERGE APPROVED ONLY",
            desc: "Requires manual salon approval by the atelier administrator.",
          },
          {
            key: "INVITED",
            title: "PRIVATE INVITATION ONLY",
            desc: "Admission restricted to patrons with formal atelier tokens.",
          },
        ].map((opt) => (
          <div
            key={opt.key}
            onClick={() => setMode(opt.key)}
            className={`p-4 border cursor-pointer flex items-center justify-between transition-all ${
              mode === opt.key
                ? "border-gold bg-cream text-gold font-medium shadow-sm"
                : "border-gold/20 bg-white text-gold/80 hover:border-gold/50"
            }`}
          >
            <div>
              <p className="font-serif uppercase tracking-wider text-xs font-semibold">
                {opt.title}
              </p>
              <p className="text-[11px] uppercase tracking-luxury text-gold/70 mt-0.5">
                {opt.desc}
              </p>
            </div>
            <input
              type="radio"
              name="exclusiveMode"
              checked={mode === opt.key}
              onChange={() => setMode(opt.key)}
              className="accent-gold"
            />
          </div>
        ))}
      </div>

      <button
        type="submit"
        disabled={isSaving}
        className="w-full py-3.5 border border-gold bg-gold text-white text-xs uppercase tracking-luxury hover:bg-white hover:text-gold transition-colors font-medium flex items-center justify-center gap-2"
      >
        <Sparkles className="w-4 h-4" />
        <span>{isSaving ? "COMMITTING CRITERIA..." : "UPDATE SALON ELIGIBILITY"}</span>
      </button>
    </form>
  );
};

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Check, X } from "lucide-react";

export function ExclusiveManagerClient({ initialMode, members }: { initialMode: string; members: any[] }) {
  const router = useRouter();
  const [mode, setMode] = useState(initialMode);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSaveMode = async (newMode: string) => {
    setMode(newMode);
    setIsSaving(true);

    try {
      await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          settings: { exclusive_eligibility_mode: newMode },
        }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      router.refresh();
    } catch {} finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Mode Selection Box */}
      <div className="border border-gold/30 bg-white p-6 shadow-sm">
        <h2 className="font-serif text-base text-gold uppercase tracking-luxury font-semibold border-b border-gold/20 pb-3 mb-4">
          SALON ACCESS ELIGIBILITY MODE
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {[
            { id: "PUBLIC", title: "PUBLIC", desc: "Open to all visitors freely" },
            { id: "LOGGED-IN", title: "AUTHENTICATED", desc: "Requires patron sign-in" },
            { id: "APPROVED", title: "APPROVED PATRONS", desc: "Requires atelier verification" },
            { id: "INVITED", title: "INVITATION ONLY", desc: "Strictly private invitation codes" },
          ].map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => handleSaveMode(m.id)}
              className={`p-4 border text-left transition-colors ${
                mode === m.id
                  ? "border-gold bg-cream"
                  : "border-gold/20 bg-white hover:border-gold/40"
              }`}
            >
              <span className="font-serif font-bold text-xs uppercase tracking-luxury text-gold block">
                {m.title}
              </span>
              <p className="text-[10px] uppercase text-gold/70 mt-1">{m.desc}</p>
              {mode === m.id && (
                <span className="inline-block mt-3 text-[9px] border border-gold px-1.5 py-0.5 bg-gold text-white font-medium">
                  ACTIVE RULE
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Member Approvals Table */}
      <div className="border border-gold/30 bg-white p-6 shadow-sm overflow-x-auto">
        <h2 className="font-serif text-base text-gold uppercase tracking-luxury font-semibold border-b border-gold/20 pb-3 mb-4">
          EXCLUSIVE ACCESS REGISTRY ({members.length})
        </h2>
        {members.length > 0 ? (
          <table className="w-full text-left text-xs uppercase tracking-luxury">
            <thead>
              <tr className="border-b border-gold/20 text-[10px] text-gold/70">
                <th className="pb-3">PATRON</th>
                <th className="pb-3">EMAIL</th>
                <th className="pb-3">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold/10">
              {members.map((m) => (
                <tr key={m.id}>
                  <td className="py-3 font-serif font-bold text-gold">{m.name || "PATRON"}</td>
                  <td className="py-3 text-gold/80">{m.email}</td>
                  <td className="py-3">
                    <span className="border border-gold px-2 py-0.5 bg-cream text-[9px] text-gold font-bold">
                      {m.exclusiveStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-xs text-gold/70 py-6 text-center">NO PATRONS AWAITING VERIFICATION.</p>
        )}
      </div>
    </div>
  );
}

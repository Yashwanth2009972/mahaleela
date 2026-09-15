"use client";

import React, { useState } from "react";
import { ShieldCheck, KeyRound, Lock, CheckCircle2, AlertCircle, Eye, EyeOff } from "lucide-react";

export default function SecurityPinPage() {
  const [currentPin, setCurrentPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [showPins, setShowPins] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!currentPin || !newPin || !confirmPin) {
      setErrorMsg("PLEASE FILL IN ALL THREE PIN FIELDS.");
      return;
    }

    if (!/^\d{6}$/.test(newPin)) {
      setErrorMsg("NEW PIN MUST BE STRICTLY 6 NUMERIC DIGITS.");
      return;
    }

    if (newPin !== confirmPin) {
      setErrorMsg("NEW PIN AND CONFIRMATION PIN DO NOT MATCH.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/admin/change-pin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPin, newPin, confirmPin }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "FAILED TO UPDATE MASTER PIN.");
      }

      setSuccessMsg("MASTER SECURITY PIN UPDATED SUCCESSFULLY. USE YOUR NEW PIN FOR FUTURE LOGINS.");
      setCurrentPin("");
      setNewPin("");
      setConfirmPin("");
    } catch (err: any) {
      setErrorMsg(err.message || "FAILED TO UPDATE SECURITY PIN.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="border border-gold/30 bg-black p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div>
          <span className="text-[10px] uppercase tracking-ultra text-gold/70 font-serif block mb-1">
            OWNER SECURITY PROTOCOL
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl text-gold uppercase tracking-luxury font-normal flex items-center gap-3">
            <KeyRound className="w-6 h-6 text-gold" />
            <span>SECURITY PIN MANAGEMENT</span>
          </h1>
          <p className="text-xs uppercase tracking-luxury text-gold/80 mt-1">
            CHANGE YOUR PRIVATE 6-DIGIT ATELIER ACCESS PIN CODE
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-gold/40 bg-gold/10 text-gold text-[10px] uppercase tracking-wider font-mono">
          <Lock className="w-3.5 h-3.5" />
          <span>CONFIDENTIAL ACCESS</span>
        </div>
      </div>

      {/* Main Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Form Column */}
        <div className="md:col-span-2 border border-gold/30 bg-black p-6 sm:p-8 space-y-6 shadow-2xl">
          <h2 className="font-serif text-base text-gold uppercase tracking-luxury pb-3 border-b border-gold/20">
            UPDATE 6-DIGIT MASTER CODE
          </h2>

          {successMsg && (
            <div className="p-4 border border-green-500/80 bg-green-950/40 text-green-300 text-xs uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-4 border border-red-500/80 bg-red-950/60 text-red-300 text-xs uppercase tracking-wider flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleUpdate} className="space-y-5">
            {/* Current PIN */}
            <div>
              <label className="block text-[11px] uppercase tracking-luxury text-gold mb-1 font-medium">
                CURRENT SECURITY PIN *
              </label>
              <input
                type={showPins ? "text" : "password"}
                maxLength={6}
                value={currentPin}
                onChange={(e) => setCurrentPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="••••••"
                className="w-full bg-cream border border-gold/40 px-4 py-3 text-sm text-gold focus:outline-none font-mono tracking-widest"
              />
            </div>

            {/* New PIN */}
            <div>
              <label className="block text-[11px] uppercase tracking-luxury text-gold mb-1 font-medium">
                NEW 6-DIGIT PIN *
              </label>
              <input
                type={showPins ? "text" : "password"}
                maxLength={6}
                value={newPin}
                onChange={(e) => setNewPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="••••••"
                className="w-full bg-cream border border-gold/40 px-4 py-3 text-sm text-gold focus:outline-none font-mono tracking-widest"
              />
              <span className="text-[9px] uppercase tracking-wider text-gold/60 mt-1 block">
                MUST BE EXACTLY 6 NUMERIC DIGITS (0-9)
              </span>
            </div>

            {/* Confirm New PIN */}
            <div>
              <label className="block text-[11px] uppercase tracking-luxury text-gold mb-1 font-medium">
                CONFIRM NEW 6-DIGIT PIN *
              </label>
              <input
                type={showPins ? "text" : "password"}
                maxLength={6}
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="••••••"
                className="w-full bg-cream border border-gold/40 px-4 py-3 text-sm text-gold focus:outline-none font-mono tracking-widest"
              />
            </div>

            {/* Visibility Toggle */}
            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={() => setShowPins(!showPins)}
                className="text-[11px] uppercase tracking-luxury text-gold/80 hover:text-gold inline-flex items-center gap-1.5"
              >
                {showPins ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{showPins ? "HIDE PIN DIGITS" : "REVEAL PIN DIGITS"}</span>
              </button>
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-gold/20">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 border border-gold bg-gold text-black text-xs uppercase tracking-luxury font-bold hover:bg-black hover:text-gold transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{isSubmitting ? "SAVING NEW PIN..." : "SAVE & ACTIVATE NEW MASTER PIN"}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Info Column */}
        <div className="border border-gold/30 bg-black p-6 space-y-5 h-fit shadow-xl">
          <div className="flex items-center gap-2 pb-3 border-b border-gold/20">
            <Lock className="w-4 h-4 text-gold" />
            <h3 className="font-serif text-sm text-gold uppercase tracking-luxury">
              SECURITY ADVISORY
            </h3>
          </div>

          <div className="space-y-4 text-xs text-gold/80 leading-relaxed uppercase tracking-wider">
            <p>
              • THIS 6-DIGIT PIN IS STRICTLY CONFIDENTIAL TO THE MAHALEELA ATELIER OWNER.
            </p>
            <p>
              • IT IS NEVER DISPLAYED ON THE PUBLIC STOREFRONT OR SHARED WITH CUSTOMERS.
            </p>
            <p>
              • AFTER UPDATING, YOUR NEW PIN TAKES EFFECT IMMEDIATELY ON THE MASTER LOGIN GATE.
            </p>
            <p>
              • FOR MAXIMUM SECURITY, STORE YOUR PIN PRIVATELY AND DO NOT DISCLOSE IT IN ANY CORRESPONDENCE.
            </p>
          </div>

          <div className="pt-4 border-t border-gold/20 text-[10px] uppercase text-gold/60">
            REGISTERED ATELIER OWNER:
            <span className="block text-gold font-mono pt-0.5">leelambikamahadeva@gmail.com</span>
          </div>
        </div>
      </div>
    </div>
  );
}
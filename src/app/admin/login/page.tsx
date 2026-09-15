"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, ArrowRight, ShieldCheck, KeyRound, AlertCircle } from "lucide-react";

export default function AdminPinLoginPage() {
  const router = useRouter();
  const [pin, setPin] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (pin.length !== 6) {
      setErrorMsg("PLEASE ENTER THE FULL 6-DIGIT MASTER PIN.");
      return;
    }

    setIsLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/auth/admin-pin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "INVALID PIN CODE. ACCESS DENIED.");
      }

      router.push("/admin");
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err.message || "ACCESS DENIED. INVALID PIN.");
      setPin("");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeypadPress = (val: string) => {
    if (val === "C") {
      setPin("");
      setErrorMsg("");
    } else if (val === "BACK") {
      setPin((prev) => prev.slice(0, -1));
    } else if (pin.length < 6) {
      const nextPin = pin + val;
      setPin(nextPin);
      setErrorMsg("");
      if (nextPin.length === 6) {
        // Auto-submit on 6th digit
        setTimeout(() => {
          autoSubmitPin(nextPin);
        }, 150);
      }
    }
  };

  const autoSubmitPin = async (fullPin: string) => {
    setIsLoading(true);
    setErrorMsg("");
    try {
      const res = await fetch("/api/auth/admin-pin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin: fullPin }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "INVALID MASTER PIN.");
      }
      router.push("/admin");
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err.message || "INVALID MASTER PIN.");
      setPin("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 sm:p-6 select-none">
      <div className="w-full max-w-md space-y-8">
        {/* Brand Emblem */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 border-2 border-gold flex items-center justify-center mx-auto bg-black p-2 shadow-2xl">
            <img
              src="/assets/mahaleela-logo.jpg"
              alt="MAHALEELA"
              className="w-full h-full object-contain"
            />
          </div>
          <span className="text-[10px] uppercase tracking-ultra text-gold/70 font-serif block">
            ATELIER EXECUTIVE SUITE
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl text-gold uppercase tracking-luxury font-normal">
            SECURITY ACCESS GATE
          </h1>
          <p className="text-[11px] uppercase tracking-wider text-gold/60">
            AUTHORIZED PERSONNEL ONLY • ENTER 6-DIGIT MASTER CODE
          </p>
        </div>

        {/* PIN Entry Box */}
        <div className="border border-gold/40 bg-cream/5 p-6 sm:p-8 space-y-6 shadow-2xl">
          {errorMsg && (
            <div className="p-3 border border-red-500/80 bg-red-950/60 text-red-300 text-xs uppercase tracking-wider flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* PIN Dots / Display */}
            <div className="flex justify-center items-center gap-3 py-2">
              {[0, 1, 2, 3, 4, 5].map((idx) => {
                const filled = pin.length > idx;
                return (
                  <div
                    key={idx}
                    className={`w-11 h-13 sm:w-12 sm:h-14 border-2 flex items-center justify-center text-lg font-mono font-bold transition-all ${
                      filled
                        ? "border-gold bg-gold/20 text-gold scale-105"
                        : "border-gold/30 bg-black text-transparent"
                    }`}
                  >
                    {filled ? "●" : ""}
                  </div>
                );
              })}
            </div>

            {/* Hidden Input for Keyboard Typing */}
            <input
              type="password"
              maxLength={6}
              value={pin}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, "").slice(0, 6);
                setPin(val);
                if (val.length === 6) autoSubmitPin(val);
              }}
              autoFocus
              className="sr-only"
              aria-label="Master PIN"
            />

            {/* Custom Luxury Keypad */}
            <div className="grid grid-cols-3 gap-2.5 sm:gap-3 max-w-xs mx-auto">
              {["1", "2", "3", "4", "5", "6", "7", "8", "9", "C", "0", "BACK"].map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleKeypadPress(key)}
                  disabled={isLoading}
                  className={`h-12 border text-sm uppercase font-serif font-bold transition-colors ${
                    key === "C"
                      ? "border-red-900/60 text-red-400 hover:bg-red-950/40"
                      : key === "BACK"
                      ? "border-gold/30 text-gold/80 hover:bg-gold/10 text-xs"
                      : "border-gold/40 text-gold hover:bg-gold hover:text-black"
                  }`}
                >
                  {key === "BACK" ? "⌫" : key}
                </button>
              ))}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || pin.length !== 6}
              className="w-full py-3.5 border border-gold bg-gold text-black text-xs uppercase tracking-luxury font-bold hover:bg-black hover:text-gold transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <KeyRound className="w-4 h-4" />
              <span>{isLoading ? "VERIFYING CREDENTIALS..." : "ENTER ATELIER SUITE"}</span>
            </button>
          </form>
        </div>

        {/* Back to Storefront Link */}
        <div className="text-center pt-2">
          <Link
            href="/"
            className="text-xs uppercase tracking-luxury text-gold/70 hover:text-gold underline underline-offset-4"
          >
            ← RETURN TO MAHALEELA STOREFRONT
          </Link>
        </div>
      </div>
    </div>
  );
}
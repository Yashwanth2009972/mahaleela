"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/common/Logo";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Authentication failed.");
      }

      if (data.user.role === "ADMIN" || data.user.role === "SUPER_ADMIN") {
        router.push("/admin");
      } else {
        router.push("/account");
      }
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err.message || "Invalid credentials.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 bg-white">
      <div className="w-full max-w-md border border-gold/40 bg-cream p-8 sm:p-10 shadow-lg">
        <div className="text-center mb-8">
          <Logo variant="header" className="mx-auto mb-4" />
          <h1 className="font-serif text-2xl text-gold uppercase tracking-luxury font-normal">
            CLIENT ACCESS
          </h1>
          <p className="text-xs uppercase tracking-luxury text-gold/70 mt-1">
            SIGN IN TO YOUR MAHALEELA PATRON ACCOUNT
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-3 border border-gold bg-white text-gold text-xs uppercase tracking-luxury text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[11px] uppercase tracking-luxury text-gold mb-1">
              EMAIL DISPATCH
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="CLIENT@MAISON.COM"
              className="w-full bg-white border border-gold/40 px-4 py-2.5 text-xs uppercase tracking-wider text-gold placeholder-gold/40 focus:outline-none focus:border-gold"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-[11px] uppercase tracking-luxury text-gold">
                PASSWORD
              </label>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••••••"
              className="w-full bg-white border border-gold/40 px-4 py-2.5 text-xs uppercase tracking-wider text-gold placeholder-gold/40 focus:outline-none focus:border-gold"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 border border-gold bg-gold text-white text-xs uppercase tracking-luxury hover:bg-white hover:text-gold transition-colors font-semibold disabled:opacity-50 mt-2"
          >
            {isLoading ? "AUTHENTICATING..." : "ENTER SALON"}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gold/20 text-center space-y-3">
          <p className="text-xs uppercase tracking-luxury text-gold/80">
            NEW TO THE WORLD OF MAHALEELA?
          </p>
          <Link
            href="/account/register"
            className="inline-block px-6 py-2 border border-gold bg-white text-gold text-xs uppercase tracking-luxury hover:bg-cream transition-colors"
          >
            REGISTER FOR AN ACCOUNT
          </Link>

          <div className="pt-2">
            <span className="text-[10px] uppercase tracking-luxury text-gold/60 block">
              DEMO ACCESS CREDENTIALS:
            </span>
            <span className="text-[10px] uppercase tracking-luxury text-gold block">
              ADMIN: admin@mahaleela.com / Mahaleela@2026
            </span>
            <span className="text-[10px] uppercase tracking-luxury text-gold block">
              PATRON: customer@mahaleela.com / Customer@2026
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

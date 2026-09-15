"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/common/Logo";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMsg("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }
    if (formData.password.length < 6) {
      setErrorMsg("Password must be at least 6 characters.");
      return;
    }

    setIsLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Registration failed.");
      }

      router.push("/account");
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err.message || "Registration failed.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 bg-white">
      <div className="w-full max-w-md border border-gold/40 bg-cream p-8 sm:p-10 shadow-lg">
        <div className="text-center mb-8">
          <Logo variant="header" className="mx-auto mb-4" />
          <h1 className="font-serif text-2xl text-gold uppercase tracking-luxury font-normal">
            PATRON REGISTRATION
          </h1>
          <p className="text-xs uppercase tracking-luxury text-gold/70 mt-1">
            ESTABLISH YOUR PRIVILEGED CLIENT PROFILE
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-3 border border-gold bg-white text-gold text-xs uppercase tracking-luxury text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] uppercase tracking-luxury text-gold mb-1">
              FULL NAME
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="YOUR EMINENCE"
              className="w-full bg-white border border-gold/40 px-4 py-2.5 text-xs uppercase tracking-wider text-gold placeholder-gold/40 focus:outline-none focus:border-gold"
            />
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-luxury text-gold mb-1">
              EMAIL DISPATCH
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="CLIENT@MAISON.COM"
              className="w-full bg-white border border-gold/40 px-4 py-2.5 text-xs uppercase tracking-wider text-gold placeholder-gold/40 focus:outline-none focus:border-gold"
            />
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-luxury text-gold mb-1">
              PHONE (INDIA)
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+91 98765 43210"
              className="w-full bg-white border border-gold/40 px-4 py-2.5 text-xs uppercase tracking-wider text-gold placeholder-gold/40 focus:outline-none focus:border-gold"
            />
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-luxury text-gold mb-1">
              PASSWORD
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="MINIMUM 6 CHARACTERS"
              className="w-full bg-white border border-gold/40 px-4 py-2.5 text-xs uppercase tracking-wider text-gold placeholder-gold/40 focus:outline-none focus:border-gold"
            />
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-luxury text-gold mb-1">
              CONFIRM PASSWORD
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="CONFIRM PASSWORD"
              className="w-full bg-white border border-gold/40 px-4 py-2.5 text-xs uppercase tracking-wider text-gold placeholder-gold/40 focus:outline-none focus:border-gold"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 border border-gold bg-gold text-white text-xs uppercase tracking-luxury hover:bg-white hover:text-gold transition-colors font-semibold disabled:opacity-50 mt-4"
          >
            {isLoading ? "INITIALIZING..." : "CREATE PATRON ACCOUNT"}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gold/20 text-center">
          <p className="text-xs uppercase tracking-luxury text-gold/80 mb-3">
            ALREADY AN ESTABLISHED PATRON?
          </p>
          <Link
            href="/account/login"
            className="inline-block px-6 py-2 border border-gold bg-white text-gold text-xs uppercase tracking-luxury hover:bg-cream transition-colors"
          >
            SIGN IN TO ACCOUNT
          </Link>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, Check } from "lucide-react";

export default function ExclusiveJoinPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    city: "",
    interests: "Haute Couture, Watches, Leather Goods",
    notes: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.phone) {
      setError("PLEASE COMPLETE ALL REQUIRED FIELDS.");
      return;
    }
    setIsSubmitted(true);
  };

  return (
    <div className="bg-white min-h-screen py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto border border-gold/40 p-8 sm:p-12 md:p-16 bg-cream shadow-sm relative">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 border border-gold/30 bg-white mb-4">
            <Sparkles className="w-3 h-3 text-gold" />
            <span className="text-[10px] tracking-ultra uppercase text-gold font-medium">
              PRIVILEGED APPLICATION
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl text-gold uppercase tracking-luxury font-normal">
            APPLY FOR SALON ACCESS
          </h1>

          <p className="mt-3 text-xs uppercase tracking-luxury text-gold/80 font-light leading-relaxed">
            Please submit your details for consideration by the MAHALEELA Atelier Concierge.
          </p>
        </div>

        {isSubmitted ? (
          <div className="border border-gold bg-white p-8 text-center space-y-4">
            <div className="w-12 h-12 border border-gold flex items-center justify-center mx-auto bg-cream">
              <Check className="w-5 h-5 text-gold" />
            </div>
            <h2 className="font-serif text-xl text-gold uppercase tracking-luxury">
              APPLICATION RECEIVED
            </h2>
            <p className="text-xs uppercase tracking-luxury text-gold/80 font-light leading-relaxed">
              Thank you, {formData.fullName}. The atelier concierge will review your application and send private credentials via email.
            </p>
            <div className="pt-4">
              <Link
                href="/#catalogue"
                className="inline-block px-6 py-2.5 border border-gold bg-gold text-white text-xs uppercase tracking-luxury hover:bg-white hover:text-gold transition-colors font-medium"
              >
                RETURN TO ATELIER
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs uppercase tracking-luxury text-gold mb-2 font-medium">
                FULL NAME *
              </label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="LADY / LORD / MR / MS FULL NAME"
                className="w-full px-4 py-3 bg-white border border-gold text-xs uppercase tracking-wider text-gold placeholder-gold/40 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-luxury text-gold mb-2 font-medium">
                EMAIL ADDRESS *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="CONCIERGE@EXAMPLE.COM"
                className="w-full px-4 py-3 bg-white border border-gold text-xs uppercase tracking-wider text-gold placeholder-gold/40 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-luxury text-gold mb-2 font-medium">
                  PHONE NUMBER (INDIA) *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full px-4 py-3 bg-white border border-gold text-xs uppercase tracking-wider text-gold placeholder-gold/40 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-luxury text-gold mb-2 font-medium">
                  PRIMARY RESIDENCE (CITY)
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="BENGALURU, MUMBAI, DELHI..."
                  className="w-full px-4 py-3 bg-white border border-gold text-xs uppercase tracking-wider text-gold placeholder-gold/40 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-luxury text-gold mb-2 font-medium">
                AREAS OF ARCHIVAL INTEREST
              </label>
              <input
                type="text"
                value={formData.interests}
                onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
                className="w-full px-4 py-3 bg-white border border-gold text-xs uppercase tracking-wider text-gold placeholder-gold/40 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-luxury text-gold mb-2 font-medium">
                ADDITIONAL ATELIER REQUESTS (OPTIONAL)
              </label>
              <textarea
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="SPECIFY BESPOKE SIZING OR PRIVATE SHOWING INQUIRIES..."
                className="w-full px-4 py-3 bg-white border border-gold text-xs uppercase tracking-wider text-gold placeholder-gold/40 focus:outline-none"
              />
            </div>

            {error && (
              <p className="text-xs uppercase tracking-luxury text-gold font-medium">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3.5 border border-gold bg-gold text-white text-xs uppercase tracking-luxury hover:bg-white hover:text-gold transition-colors font-medium inline-flex items-center justify-center gap-2"
            >
              <span>SUBMIT APPLICATION</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

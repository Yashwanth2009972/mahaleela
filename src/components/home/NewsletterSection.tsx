"use client";

import React, { useState } from "react";
import { Sparkles, Check } from "lucide-react";

interface NewsletterSectionProps {
  content?: {
    placeholder?: string;
    buttonText?: string;
    disclaimer?: string;
  };
}

export const NewsletterSection: React.FC<NewsletterSectionProps> = ({ content }) => {
  const placeholder = content?.placeholder || "ENTER YOUR EMAIL ADDRESS";
  const buttonText = content?.buttonText || "SUBSCRIBE";
  const disclaimer =
    content?.disclaimer ||
    "Receive private salon dispatches, new collection previews, and invitations.";

  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !email.includes("@") || !email.includes(".")) {
      setError("PLEASE ENTER A VALID EMAIL ADDRESS.");
      return;
    }

    setSubscribed(true);
  };

  return (
    <section className="bg-cream py-20 md:py-32 px-4 sm:px-6 lg:px-8 border-b border-gold/20">
      <div className="max-w-3xl mx-auto text-center border border-gold/30 p-8 sm:p-14 md:p-16 bg-white">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 border border-gold/30 bg-cream mb-4">
          <Sparkles className="w-3 h-3 text-gold" />
          <span className="text-[10px] tracking-ultra uppercase text-gold">
            THE SALON DISPATCH
          </span>
        </div>

        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-gold uppercase tracking-luxury font-normal leading-tight">
          ENTER THE WORLD OF MAHALEELA
        </h2>

        <p className="mt-4 text-xs uppercase tracking-luxury text-gold/80 max-w-md mx-auto font-light leading-relaxed">
          {disclaimer}
        </p>

        {subscribed ? (
          <div className="mt-8 p-4 border border-gold bg-cream flex items-center justify-center gap-2 text-gold">
            <Check className="w-4 h-4" />
            <span className="text-xs uppercase tracking-luxury font-medium">
              THANK YOU. YOU HAVE BEEN ENROLLED IN PRIVATE DISPATCHES.
            </span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder={placeholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 px-4 py-3 bg-cream/40 border border-gold text-xs uppercase tracking-wider text-gold placeholder-gold/50 focus:outline-none focus:bg-white"
              />
              <button
                type="submit"
                className="px-6 py-3 border border-gold bg-gold text-white text-xs uppercase tracking-luxury hover:bg-white hover:text-gold transition-colors font-medium whitespace-nowrap"
              >
                {buttonText}
              </button>
            </div>
            {error && (
              <p className="mt-2 text-[10px] tracking-luxury uppercase text-gold">
                {error}
              </p>
            )}
          </form>
        )}
      </div>
    </section>
  );
};

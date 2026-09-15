import React from "react";

export default function PrivacyPage() {
  return (
    <div className="bg-white min-h-screen py-16 md:py-24 px-4 sm:px-6 lg:px-8 border-b border-gold/20">
      <div className="max-w-4xl mx-auto">
        <div className="border-b border-gold/20 pb-6 mb-12 text-center">
          <span className="text-[10px] uppercase tracking-ultra text-gold/70 font-serif block mb-2">
            DATA SANCTUARY
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-gold uppercase tracking-luxury font-normal">
            PRIVACY POLICY
          </h1>
        </div>
        <div className="border border-gold/30 bg-cream p-8 sm:p-12 space-y-6 text-xs uppercase tracking-luxury text-gold leading-relaxed">
          <h3 className="font-serif text-base text-gold font-semibold">DISCREET PATRON CONFIDENTIALITY</h3>
          <p>
            MAHALEELA respects the utmost privacy of its esteemed patrons. We never sell, lease, or distribute your personal identity, contact details, or acquisition records to third-party commercial entities.
          </p>
          <h3 className="font-serif text-base text-gold font-semibold pt-4">DATA UTILITY</h3>
          <p>
            Information collected is strictly utilized to process your order, fulfill white-glove courier dispatch across India, and provide bespoke client concierge communications.
          </p>
          <h3 className="font-serif text-base text-gold font-semibold pt-4">PAYMENT SECURITY</h3>
          <p>
            All electronic payment details are handled via encrypted protocols. MAHALEELA does not store unencrypted financial credentials on its servers.
          </p>
        </div>
      </div>
    </div>
  );
}

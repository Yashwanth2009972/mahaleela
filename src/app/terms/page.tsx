import React from "react";

export default function TermsPage() {
  return (
    <div className="bg-white min-h-screen py-16 md:py-24 px-4 sm:px-6 lg:px-8 border-b border-gold/20">
      <div className="max-w-4xl mx-auto">
        <div className="border-b border-gold/20 pb-6 mb-12 text-center">
          <span className="text-[10px] uppercase tracking-ultra text-gold/70 font-serif block mb-2">
            LEGAL ARCHIVE
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-gold uppercase tracking-luxury font-normal">
            TERMS OF SERVICE
          </h1>
        </div>
        <div className="border border-gold/30 bg-cream p-8 sm:p-12 space-y-6 text-xs uppercase tracking-luxury text-gold leading-relaxed">
          <h3 className="font-serif text-base text-gold font-semibold">01. GENERAL ATELIER COVENANTS</h3>
          <p>
            By accessing or ordering through the official MAHALEELA website, you agree to be bound by these Terms of Service. All designs, logos, and materials are intellectual property of MAHALEELA.
          </p>
          <h3 className="font-serif text-base text-gold font-semibold pt-4">02. PRICING & ACCURACY</h3>
          <p>
            Prices are listed in Indian Rupees (?) inclusive of applicable taxes. In the event of a technical discrepancy in catalogue pricing, MAHALEELA reserves the right to notify the patron and offer cancellation or adjustment.
          </p>
          <h3 className="font-serif text-base text-gold font-semibold pt-4">03. EXCLUSIVE SALON ELIGIBILITY</h3>
          <p>
            Access to exclusive drops is granted at the discretion of the atelier administration. Misconduct or resale of limited editions may result in immediate suspension of patron privileges.
          </p>
        </div>
      </div>
    </div>
  );
}

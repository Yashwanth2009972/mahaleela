import React from "react";
import { prisma } from "@/lib/prisma";
import { RefreshCw, CheckCircle2, ShieldAlert } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ReturnsPage() {
  const returnsSetting = await prisma.siteSettings.findUnique({ where: { key: "policy_returns" } });
  const exchangeSetting = await prisma.siteSettings.findUnique({ where: { key: "policy_exchange" } });

  const returnsPolicy = returnsSetting?.value || "MAHALEELA offers a discreet 7-day complimentary return & exchange service for unworn items in pristine original condition with all security seals intact.";
  const exchangePolicy = exchangeSetting?.value || "Exchanges are accommodated promptly subject to variant availability. Contact concierge@mahaleela.com with your order number.";

  return (
    <div className="bg-white min-h-screen py-16 md:py-24 px-4 sm:px-6 lg:px-8 border-b border-gold/20">
      <div className="max-w-4xl mx-auto">
        <div className="border-b border-gold/20 pb-6 mb-12 text-center">
          <span className="text-[10px] uppercase tracking-ultra text-gold/70 font-serif block mb-2">
            CLIENT SATISFACTION
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-gold uppercase tracking-luxury font-normal">
            RETURNS & EXCHANGES
          </h1>
        </div>

        <div className="border border-gold/30 bg-cream p-8 sm:p-12 space-y-8">
          <div className="space-y-4 text-xs uppercase tracking-luxury text-gold leading-relaxed whitespace-pre-line">
            <h3 className="font-serif text-base text-gold font-semibold">RETURN GUIDELINES</h3>
            <p>{returnsPolicy}</p>

            <h3 className="font-serif text-base text-gold font-semibold pt-4">EXCHANGE POLICY</h3>
            <p>{exchangePolicy}</p>

            <h3 className="font-serif text-base text-gold font-semibold pt-4">PREREQUISITES FOR RETURN</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Item must be unworn, unwashed, and without alteration or fragrance.</li>
              <li>Official MAHALEELA presentation box, velvet dust bags, and security tag must be intact.</li>
              <li>Initiate your request within 7 calendar days of receipt.</li>
            </ul>

            <div className="border-t border-gold/20 pt-6 mt-6">
              <p className="font-semibold">CONCIERGE CONTACT FOR ASSISTANCE:</p>
              <p className="mt-1">EMAIL: concierge@mahaleela.com � TELEPHONE: 8892919723</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

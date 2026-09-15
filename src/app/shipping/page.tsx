import React from "react";
import { BRAND } from "@/lib/constants";
import { Truck, MapPin, Clock, MessageCircle } from "lucide-react";

export const dynamic = "force-dynamic";

export default function ShippingPolicyPage() {
  return (
    <div className="bg-black min-h-screen py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <span className="text-[10px] uppercase tracking-ultra text-gold/70 font-serif block">
            CLIENT CONCIERGE DISPATCH
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-gold uppercase tracking-luxury font-normal">
            SHIPPING & DELIVERY POLICY
          </h1>
          <p className="text-xs uppercase tracking-luxury text-gold/80 max-w-md mx-auto">
            DISCIPLINED PACKAGING, SECURE COURIER TRANSIT, AND LOCATION-BASED DISPATCH
          </p>
        </div>

        <div className="border border-gold/30 bg-cream p-8 sm:p-12 space-y-8">
          <div className="space-y-3">
            <h2 className="font-serif text-lg text-gold uppercase tracking-luxury">
              01. DELIVERY CHARGES POLICY
            </h2>
            <p className="text-xs uppercase tracking-luxury text-gold leading-relaxed">
              MAHALEELA DOES NOT CHARGE ARBITRARY FLAT RATES OR INFLATE PRODUCT PRICES WITH "FREE SHIPPING". DELIVERY CHARGES ARE APPLIED STRICTLY ACCORDING TO YOUR EXACT GEOGRAPHICAL LOCATION AND PINCODE ACROSS INDIA.
            </p>
            <p className="text-xs uppercase tracking-luxury text-gold leading-relaxed">
              DURING CHECKOUT (WHETHER ORDERING DIRECTLY ON THE WEBSITE OR VIA WHATSAPP), YOUR DELIVERY CHARGES WILL BE CONFIRMED TO YOU DIRECTLY BY OUR ATELIER CONCIERGE VIA WHATSAPP.
            </p>
          </div>

          <div className="space-y-3 pt-6 border-t border-gold/20">
            <h2 className="font-serif text-lg text-gold uppercase tracking-luxury">
              02. DISPATCH & TRANSIT TIMELINES
            </h2>
            <p className="text-xs uppercase tracking-luxury text-gold leading-relaxed">
              EACH PIECE IS INSPECTED IN OUR BENGALURU ATELIER BEFORE PACKAGING. ORDERS ARE DISPATCHED WITHIN 24-48 HOURS OF CONFIRMATION.
            </p>
            <ul className="text-xs uppercase tracking-luxury text-gold/80 space-y-2 list-disc list-inside">
              <li>METROPOLITAN HUBS: 2 TO 4 BUSINESS DAYS</li>
              <li>REGIONAL LOCATIONS: 4 TO 7 BUSINESS DAYS</li>
              <li>REMOTE LOCATIONS: 7 TO 9 BUSINESS DAYS</li>
            </ul>
          </div>

          <div className="space-y-3 pt-6 border-t border-gold/20">
            <h2 className="font-serif text-lg text-gold uppercase tracking-luxury">
              03. CONCIERGE INQUIRIES
            </h2>
            <p className="text-xs uppercase tracking-luxury text-gold leading-relaxed">
              FOR SPECIFIC PINCODE ESTIMATES, EXPEDITED COURIER TRANSIT, OR BULK ALLOCATIONS:
            </p>
            <div className="pt-2">
              <a
                href={`https://wa.me/91${BRAND.phone}?text=${encodeURIComponent("Hello MAHALEELA, I would like to check delivery charges and transit time to my pincode.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 border border-green-600 bg-green-950 text-green-300 text-xs uppercase tracking-luxury font-bold hover:bg-green-600 hover:text-white transition-colors inline-flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>INQUIRE ON WHATSAPP (+91 {BRAND.phone})</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

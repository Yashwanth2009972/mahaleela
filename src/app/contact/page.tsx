import React from "react";
import { BRAND } from "@/lib/constants";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="bg-white min-h-screen py-16 md:py-24 px-4 sm:px-6 lg:px-8 border-b border-gold/20">
      <div className="max-w-4xl mx-auto">
        <div className="border-b border-gold/20 pb-6 mb-12 text-center">
          <span className="text-[10px] uppercase tracking-ultra text-gold/70 font-serif block mb-2">
            CLIENT CARE
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-gold uppercase tracking-luxury font-normal">
            CONCIERGE & ATELIER
          </h1>
          <p className="text-xs uppercase tracking-luxury text-gold/80 mt-2">
            WE AWAIT YOUR DISPATCH
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="border border-gold/30 bg-cream p-8 space-y-6">
            <h2 className="font-serif text-lg text-gold uppercase tracking-luxury border-b border-gold/20 pb-3">
              DIRECT INQUIRIES
            </h2>

            <div className="flex items-start gap-4">
              <Phone className="w-5 h-5 text-gold shrink-0 mt-1" />
              <div>
                <span className="text-[10px] uppercase tracking-ultra text-gold/70 block">TELEPHONE CONCIERGE</span>
                <p className="text-xs uppercase tracking-luxury text-gold font-bold mt-0.5">{BRAND.phone}</p>
                <p className="text-[10px] uppercase tracking-luxury text-gold/70">Monday - Saturday, 10:00 AM - 7:00 PM IST</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Mail className="w-5 h-5 text-gold shrink-0 mt-1" />
              <div>
                <span className="text-[10px] uppercase tracking-ultra text-gold/70 block">ELECTRONIC DISPATCH</span>
                <p className="text-xs uppercase tracking-luxury text-gold font-bold mt-0.5">{BRAND.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <MapPin className="w-5 h-5 text-gold shrink-0 mt-1" />
              <div>
                <span className="text-[10px] uppercase tracking-ultra text-gold/70 block">ATELIER & HEADQUARTERS</span>
                <p className="text-xs uppercase tracking-luxury text-gold whitespace-pre-line mt-0.5 leading-relaxed">
                  {BRAND.address}
                </p>
              </div>
            </div>
          </div>

          <div className="border border-gold/30 bg-white p-8">
            <h2 className="font-serif text-lg text-gold uppercase tracking-luxury border-b border-gold/20 pb-3 mb-6">
              TRANSMIT A MESSAGE
            </h2>

            <form className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase tracking-luxury text-gold mb-1">NAME</label>
                <input
                  type="text"
                  required
                  placeholder="YOUR NAME"
                  className="w-full bg-cream border border-gold/40 px-3 py-2 text-xs uppercase text-gold placeholder-gold/40 focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-luxury text-gold mb-1">EMAIL</label>
                <input
                  type="email"
                  required
                  placeholder="CLIENT@MAISON.COM"
                  className="w-full bg-cream border border-gold/40 px-3 py-2 text-xs uppercase text-gold placeholder-gold/40 focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-luxury text-gold mb-1">MESSAGE</label>
                <textarea
                  rows={4}
                  required
                  placeholder="INQUIRY REGARDING SIZING, CUSTOM BESPOKE ORDERS, OR PRIVATE SHOWINGS"
                  className="w-full bg-cream border border-gold/40 px-3 py-2 text-xs uppercase text-gold placeholder-gold/40 focus:outline-none focus:border-gold"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 border border-gold bg-gold text-white text-xs uppercase tracking-luxury hover:bg-white hover:text-gold transition-colors font-medium mt-2"
              >
                TRANSMIT TO CONCIERGE
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

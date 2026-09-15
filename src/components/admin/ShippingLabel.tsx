"use client";

import React from "react";
import { BRAND } from "@/lib/constants";
import { Printer, ArrowLeft } from "lucide-react";

export function ShippingLabel({ order }: { order: any }) {
  let addressObj: any = {};
  try {
    addressObj = typeof order.shippingAddress === "string" ? JSON.parse(order.shippingAddress) : order.shippingAddress;
  } catch {
    addressObj = { addressLine1: order.shippingAddress };
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="print:hidden flex items-center justify-between border-b border-gold/30 pb-4">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="inline-flex items-center gap-1 text-xs uppercase tracking-luxury text-gold hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>BACK TO DOSSIER</span>
        </button>

        <button
          type="button"
          onClick={handlePrint}
          className="px-6 py-2.5 border border-gold bg-gold text-black text-xs uppercase tracking-luxury font-bold hover:bg-black hover:text-gold transition-colors inline-flex items-center gap-2 shadow-lg"
        >
          <Printer className="w-4 h-4" />
          <span>PRINT LUXURY SHIPPING LABEL</span>
        </button>
      </div>

      {/* Printable Shipping Label Container (Strict Print Layout) */}
      <div className="max-w-2xl mx-auto bg-white text-black p-8 sm:p-10 border-2 border-black font-sans shadow-xl print:shadow-none print:m-0 print:p-6 print:border-black">
        {/* Header with Official MAHALEELA Brand Logo */}
        <div className="flex items-center justify-between border-b-2 border-black pb-4">
          <div className="flex items-center gap-4">
            <img
              src="/assets/mahaleela-logo.jpg"
              alt="MAHALEELA Official Crest"
              className="w-16 h-16 object-contain border border-black p-1"
            />
            <div>
              <h1 className="font-serif text-2xl tracking-widest font-black uppercase text-black">
                MAHALEELA
              </h1>
              <p className="text-[9px] uppercase tracking-widest font-semibold text-neutral-700">
                HAUTE COUTURE & LUXURY ATELIER
              </p>
              <p className="text-[8px] tracking-wider text-neutral-600">
                DISPATCH DOSSIER • SECURE EXPRESS SHIPMENT
              </p>
            </div>
          </div>

          <div className="text-right">
            <div className="border border-black px-3 py-1 text-center bg-neutral-100">
              <span className="block text-[8px] uppercase tracking-wider font-bold">ORDER TYPE</span>
              <span className="font-bold text-xs uppercase text-black tracking-wider">
                {order.orderType || "WEBSITE ORDER"}
              </span>
            </div>
            <p className="text-[9px] font-mono font-bold pt-1">{order.orderNumber}</p>
          </div>
        </div>

        {/* Sender & Recipient Address Grid */}
        <div className="grid grid-cols-2 gap-4 border-b-2 border-black py-4">
          {/* FROM / SHIPPER */}
          <div className="border-r border-black pr-4 space-y-1">
            <span className="block text-[9px] uppercase tracking-wider font-black bg-black text-white px-1 py-0.5 w-fit">
              SHIP FROM (ATELIER):
            </span>
            <p className="font-serif text-xs font-bold uppercase text-black">{BRAND.fullName}</p>
            <p className="text-[10px] text-neutral-800 leading-tight whitespace-pre-line">
              {BRAND.address}
            </p>
            <p className="text-[10px] font-mono pt-1 text-black font-semibold">TEL: +91 {BRAND.phone}</p>
            <p className="text-[9px] text-neutral-600">EMAIL: {BRAND.email}</p>
          </div>

          {/* TO / CONSIGNEE */}
          <div className="space-y-1 pl-2">
            <span className="block text-[9px] uppercase tracking-wider font-black bg-black text-white px-1 py-0.5 w-fit">
              SHIP TO (PATRON):
            </span>
            <p className="font-serif text-sm font-black uppercase text-black">
              {order.customerName}
            </p>
            <p className="text-[10px] text-neutral-900 leading-tight font-medium">
              {addressObj.street || addressObj.addressLine1}
              {addressObj.landmark ? `, ${addressObj.landmark}` : ""}
            </p>
            <p className="text-[11px] font-bold uppercase text-black">
              {addressObj.city || "BENGALURU"}, {addressObj.state || "KARNATAKA"} - {addressObj.pincode || addressObj.postalCode}
            </p>
            <p className="text-[10px] font-mono font-bold text-black pt-1">
              TEL: +91 {order.phone}
            </p>
            <p className="text-[9px] text-neutral-700">{order.email}</p>
          </div>
        </div>

        {/* Barcode Mock Visual */}
        <div className="py-4 text-center border-b-2 border-black space-y-1">
          <div className="h-12 w-3/4 mx-auto bg-[repeating-linear-gradient(90deg,#000,#000_2px,transparent_2px,transparent_4px,#000_4px,#000_7px,transparent_7px,transparent_9px,#000_9px,#000_13px)]" />
          <p className="font-mono text-xs font-bold tracking-widest">
            *{order.trackingNumber || order.orderNumber}*
          </p>
        </div>

        {/* Package & Items Contents */}
        <div className="py-4 border-b-2 border-black space-y-2">
          <span className="block text-[9px] uppercase tracking-wider font-bold">
            PACKAGE CONTENTS ({order.items?.length || 0} PIECE(S)):
          </span>
          <table className="w-full text-left text-[10px] uppercase">
            <thead>
              <tr className="border-b border-black text-[9px] font-bold">
                <th className="pb-1">PIECE</th>
                <th className="pb-1">QTY</th>
                <th className="pb-1">DETAILS / COLOUR</th>
                <th className="pb-1 text-right">VALUE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-300">
              {order.items?.map((item: any) => (
                <tr key={item.id} className="py-1">
                  <td className="py-1 font-semibold">{item.productName}</td>
                  <td className="py-1 font-mono">{item.quantity}</td>
                  <td className="py-1 text-neutral-700">{item.variantInfo || "Selected Atelier Tone"}</td>
                  <td className="py-1 text-right font-mono font-semibold">
                    ₹{item.subtotal.toLocaleString("en-IN")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Dispatch & Delivery Note */}
        <div className="pt-4 flex items-center justify-between text-[9px] uppercase tracking-wider font-bold">
          <div>
            <p>DELIVERY CHARGES: ACCORDING TO LOCATION (WHATSAPP VERIFIED)</p>
            <p className="text-neutral-600 font-normal">STATUS: {order.orderStatus}</p>
          </div>
          <div className="text-right">
            <p>TOTAL VALUE: ₹{order.total.toLocaleString("en-IN")}</p>
            <p className="text-neutral-600 font-normal">
              DATE: {new Date(order.createdAt).toLocaleDateString("en-IN")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck, 
  Truck, 
  QrCode, 
  Banknote,
  Sparkles,
  MessageCircle,
  ShoppingBag
} from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { BRAND } from "@/lib/constants";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, subtotal, clearCart } = useCart();

  const [orderType, setOrderType] = useState<"WEBSITE" | "WHATSAPP">("WEBSITE");
  const [customer, setCustomer] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [address, setAddress] = useState({
    street: "",
    landmark: "",
    city: "",
    state: "Karnataka",
    pincode: "",
  });

  const [paymentMethod, setPaymentMethod] = useState<"UPI" | "CASH_ON_DELIVERY">("UPI");
  const [upiReference, setUpiReference] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<any>(null);
  const [error, setError] = useState("");

  const codFee = paymentMethod === "CASH_ON_DELIVERY" ? BRAND.shipping.codFee : 0;
  const grandTotal = subtotal + codFee;

  const handlePlaceOrder = async () => {
    setError("");

    if (!customer.name || !customer.phone || !address.street || !address.city || !address.pincode) {
      setError("Please fill in your name, phone, address, city, and pincode.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderType,
          customerName: customer.name,
          email: customer.email || `${customer.phone}@client.mahaleela.com`,
          phone: customer.phone,
          shippingAddress: address,
          items: cart,
          paymentMethod: orderType === "WHATSAPP" ? "WHATSAPP_VERIFIED" : paymentMethod,
          notes: orderType === "WHATSAPP"
            ? "Placed via WhatsApp Concierge verification"
            : paymentMethod === "UPI"
            ? `UPI Ref: ${upiReference || "Pending Verification"}`
            : "Cash on Delivery",
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Order placement failed.");
      }

      setConfirmedOrder(data);
      clearCart();

      // If WhatsApp order, prepare and open WhatsApp with pre-filled items and delivery query
      if (orderType === "WHATSAPP") {
        const itemsList = cart
          .map((i) => `• ${i.name} (Qty: ${i.quantity}, Colour: ${i.color || "Standard"}) - ₹${(i.price * i.quantity).toLocaleString("en-IN")}`)
          .join("\n");

        const waText = `Hello MAHALEELA, I would like to place an order:
• Order ID: ${data.orderNumber}
${itemsList}

• Subtotal: ₹${subtotal.toLocaleString("en-IN")}
• Patron Name: ${customer.name}
• Contact: ${customer.phone}
• Delivery Address: ${address.street}, ${address.landmark ? address.landmark + ", " : ""}${address.city}, ${address.state} - ${address.pincode}

Please let me know the delivery charges for my location and confirm my order.`;

        window.open(`https://wa.me/91${BRAND.phone}?text=${encodeURIComponent(waText)}`, "_blank");
      }
    } catch (err: any) {
      setError(err.message || "Failed to process order.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0 && !confirmedOrder) {
    return (
      <div className="bg-black min-h-screen py-24 text-center px-4">
        <div className="max-w-md mx-auto border border-gold/30 bg-cream p-10 space-y-4">
          <ShoppingBag className="w-10 h-10 text-gold mx-auto" />
          <h2 className="font-serif text-2xl text-gold uppercase tracking-luxury">
            YOUR BAG IS EMPTY
          </h2>
          <p className="text-xs uppercase tracking-luxury text-gold/80">
            Please select pieces from the catalogue before proceeding to checkout.
          </p>
          <Link
            href="/#catalogue"
            className="mt-4 inline-block px-8 py-3 border border-gold bg-gold text-black text-xs uppercase tracking-luxury font-bold hover:bg-black hover:text-gold transition-colors"
          >
            EXPLORE CATALOGUE
          </Link>
        </div>
      </div>
    );
  }

  // Confirmation View
  if (confirmedOrder) {
    const isWhatsApp = confirmedOrder.orderType === "WHATSAPP";
    return (
      <div className="bg-black min-h-screen py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto border border-gold bg-cream p-8 sm:p-12 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 border-2 border-gold flex items-center justify-center mx-auto bg-black">
            <Check className="w-8 h-8 text-gold" />
          </div>

          <span className="text-[10px] uppercase tracking-ultra text-gold font-serif block">
            {isWhatsApp ? "WHATSAPP ORDER LODGED FOR VERIFICATION" : "WEBSITE ORDER SUBMITTED FOR VERIFICATION"}
          </span>

          <h1 className="font-serif text-2xl sm:text-3xl text-gold uppercase tracking-luxury font-normal">
            ORDER: {confirmedOrder.orderNumber}
          </h1>

          <div className="border border-gold/30 p-4 bg-black/60 text-xs uppercase tracking-luxury text-gold space-y-1">
            <p>PATRON: {confirmedOrder.customerName}</p>
            <p>CONTACT: {confirmedOrder.phone}</p>
            <p className="pt-2 font-bold text-sm text-gold">
              SUBTOTAL: ₹{confirmedOrder.subtotal?.toLocaleString("en-IN")}
            </p>
            <p className="text-[10px] text-gold/80">
              + DELIVERY CHARGES WILL BE COMMUNICATED ACCORDING TO YOUR LOCATION VIA WHATSAPP
            </p>
          </div>

          <div className="pt-2 space-y-3">
            <a
              href={`https://wa.me/91${BRAND.phone}?text=${encodeURIComponent(`Hello MAHALEELA, checking status for my Order ${confirmedOrder.orderNumber}.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 border border-green-600 bg-green-950 text-green-300 text-xs uppercase tracking-luxury font-bold hover:bg-green-600 hover:text-white transition-colors flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>CHAT WITH ATELIER ON WHATSAPP FOR DELIVERY CHARGES</span>
            </a>

            <Link
              href="/#catalogue"
              className="block w-full py-3 border border-gold/40 text-gold text-xs uppercase tracking-luxury hover:bg-black transition-colors"
            >
              RETURN TO STOREFRONT
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="border-b border-gold/30 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-[10px] uppercase tracking-ultra text-gold/70 font-serif block">
              SECURE CHECKOUT & VERIFICATION
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl text-gold uppercase tracking-luxury font-normal">
              ACQUISITION DOSSIER
            </h1>
          </div>
          <Link
            href="/#catalogue"
            className="text-xs uppercase tracking-luxury text-gold hover:underline inline-flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>CONTINUE SHOPPING</span>
          </Link>
        </div>

        {error && (
          <div className="p-4 border border-red-500 bg-red-950/30 text-red-300 text-xs uppercase tracking-luxury">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT: Verification & Order Form */}
          <div className="lg:col-span-7 space-y-6">
            {/* 1. SELECT ORDER & VERIFICATION TYPE */}
            <div className="border border-gold bg-cream p-6 space-y-4">
              <span className="text-[10px] uppercase tracking-ultra text-gold font-serif block">
                STEP 01. SELECT VERIFICATION ORDER TYPE
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setOrderType("WEBSITE")}
                  className={`p-4 border text-left transition-all ${
                    orderType === "WEBSITE"
                      ? "border-gold bg-black text-gold ring-2 ring-gold"
                      : "border-gold/30 bg-black/40 text-gold/70 hover:border-gold"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-serif text-sm uppercase tracking-wider font-bold">
                      1. WEBSITE ORDER
                    </span>
                    {orderType === "WEBSITE" && <Check className="w-4 h-4 text-gold" />}
                  </div>
                  <p className="text-[10px] uppercase tracking-wider text-gold/80 leading-relaxed">
                    Place order through the website portal. Admin verifies and confirms dispatch.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setOrderType("WHATSAPP")}
                  className={`p-4 border text-left transition-all ${
                    orderType === "WHATSAPP"
                      ? "border-green-500 bg-green-950/40 text-green-300 ring-2 ring-green-500"
                      : "border-gold/30 bg-black/40 text-gold/70 hover:border-gold"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-serif text-sm uppercase tracking-wider font-bold flex items-center gap-1.5 text-green-300">
                      <MessageCircle className="w-4 h-4" />
                      2. WHATSAPP ORDER
                    </span>
                    {orderType === "WHATSAPP" && <Check className="w-4 h-4 text-green-400" />}
                  </div>
                  <p className="text-[10px] uppercase tracking-wider text-gold/80 leading-relaxed">
                    Direct automated WhatsApp message to owner. Delivery fee communicated instantly on chat.
                  </p>
                </button>
              </div>
            </div>

            {/* 2. CUSTOMER & DELIVERY COORDINATES */}
            <div className="border border-gold/30 bg-cream p-6 space-y-4">
              <span className="text-[10px] uppercase tracking-ultra text-gold font-serif block">
                STEP 02. PATRON COORDINATES & DELIVERY LOCATION
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-luxury text-gold mb-1">FULL NAME *</label>
                  <input
                    type="text"
                    value={customer.name}
                    onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                    required
                    placeholder="Enter your full name"
                    className="w-full bg-black border border-gold/40 px-3 py-2 text-xs text-gold focus:outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-luxury text-gold mb-1">
                    PHONE NUMBER (FOR WHATSAPP & DELIVERY) *
                  </label>
                  <input
                    type="tel"
                    value={customer.phone}
                    onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                    required
                    placeholder="e.g. 9876543210"
                    className="w-full bg-black border border-gold/40 px-3 py-2 text-xs text-gold focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-luxury text-gold mb-1">
                  EMAIL ADDRESS (OPTIONAL)
                </label>
                <input
                  type="email"
                  value={customer.email}
                  onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                  placeholder="patron@example.com"
                  className="w-full bg-black border border-gold/40 px-3 py-2 text-xs text-gold focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-luxury text-gold mb-1">
                  STREET ADDRESS / HOUSE / FLAT *
                </label>
                <input
                  type="text"
                  value={address.street}
                  onChange={(e) => setAddress({ ...address, street: e.target.value })}
                  required
                  placeholder="Address Line 1"
                  className="w-full bg-black border border-gold/40 px-3 py-2 text-xs text-gold focus:outline-none focus:border-gold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-luxury text-gold mb-1">LANDMARK</label>
                  <input
                    type="text"
                    value={address.landmark}
                    onChange={(e) => setAddress({ ...address, landmark: e.target.value })}
                    placeholder="Nearby landmark"
                    className="w-full bg-black border border-gold/40 px-3 py-2 text-xs text-gold focus:outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-luxury text-gold mb-1">CITY / DISTRICT *</label>
                  <input
                    type="text"
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    required
                    placeholder="e.g. Bengaluru"
                    className="w-full bg-black border border-gold/40 px-3 py-2 text-xs text-gold focus:outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-luxury text-gold mb-1">PINCODE *</label>
                  <input
                    type="text"
                    value={address.pincode}
                    onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                    required
                    placeholder="560090"
                    className="w-full bg-black border border-gold/40 px-3 py-2 text-xs text-gold focus:outline-none focus:border-gold font-mono"
                  />
                </div>
              </div>
            </div>

            {/* 3. PAYMENT METHOD (IF WEBSITE ORDER) */}
            {orderType === "WEBSITE" && (
              <div className="border border-gold/30 bg-cream p-6 space-y-4">
                <span className="text-[10px] uppercase tracking-ultra text-gold font-serif block">
                  STEP 03. PAYMENT SETTLEMENT METHOD
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("UPI")}
                    className={`p-4 border text-left transition-all ${
                      paymentMethod === "UPI"
                        ? "border-gold bg-black text-gold ring-1 ring-gold"
                        : "border-gold/30 bg-black/40 text-gold/70 hover:border-gold"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs uppercase tracking-wider font-bold">UPI PAYMENT</span>
                      <QrCode className="w-4 h-4 text-gold" />
                    </div>
                    <p className="text-[9px] text-gold/70">Instant zero-fee transfer</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("CASH_ON_DELIVERY")}
                    className={`p-4 border text-left transition-all ${
                      paymentMethod === "CASH_ON_DELIVERY"
                        ? "border-gold bg-black text-gold ring-1 ring-gold"
                        : "border-gold/30 bg-black/40 text-gold/70 hover:border-gold"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs uppercase tracking-wider font-bold">CASH ON DELIVERY</span>
                      <Banknote className="w-4 h-4 text-gold" />
                    </div>
                    <p className="text-[9px] text-gold/70">COD fee: ₹10</p>
                  </button>
                </div>

                {paymentMethod === "UPI" && (
                  <div className="p-4 border border-gold/30 bg-black space-y-2">
                    <p className="text-[10px] uppercase tracking-wider text-gold font-bold">
                      UPI ID: mahaleela@upi (OR PHONE: 8892919723)
                    </p>
                    <input
                      type="text"
                      value={upiReference}
                      onChange={(e) => setUpiReference(e.target.value)}
                      placeholder="ENTER UPI TRANSACTION UTR / REF NUMBER (OPTIONAL)"
                      className="w-full bg-cream border border-gold/40 px-3 py-2 text-xs uppercase text-gold focus:outline-none"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* RIGHT: Order Summary & Place Action */}
          <div className="lg:col-span-5 space-y-6">
            <div className="border border-gold bg-cream p-6 space-y-4 sticky top-24">
              <span className="text-[10px] uppercase tracking-ultra text-gold font-serif block border-b border-gold/20 pb-2">
                BAG DOSSIER ({cart.length} PIECES)
              </span>

              <div className="divide-y divide-gold/20 max-h-64 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div key={item.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                    <div>
                      <p className="font-serif text-gold uppercase font-medium line-clamp-1">{item.name}</p>
                      <p className="text-[10px] text-gold/70">
                        QTY: {item.quantity} {item.color ? `• ${item.color}` : ""}
                      </p>
                    </div>
                    <span className="font-serif font-bold text-gold">
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price Calculation & Location Delivery Note */}
              <div className="border-t-2 border-gold/30 pt-4 space-y-2 text-xs uppercase tracking-wider">
                <div className="flex justify-between text-gold/80">
                  <span>SUBTOTAL</span>
                  <span className="font-serif font-semibold">₹{subtotal.toLocaleString("en-IN")}</span>
                </div>

                {paymentMethod === "CASH_ON_DELIVERY" && orderType === "WEBSITE" && (
                  <div className="flex justify-between text-gold/80">
                    <span>COD CONVENIENCE CHARGE</span>
                    <span className="font-serif font-semibold">₹{BRAND.shipping.codFee}</span>
                  </div>
                )}

                {/* NO FREE DELIVERY — EXPLICIT LOCATION POLICY */}
                <div className="p-3 border border-gold/30 bg-black text-[10px] text-gold space-y-1">
                  <p className="font-bold uppercase tracking-luxury">
                    + DELIVERY CHARGES ACCORDING TO LOCATION
                  </p>
                  <p className="text-gold/70 normal-case tracking-normal">
                    Delivery fees will be confirmed on WhatsApp based on your address and pincode.
                  </p>
                </div>

                <div className="pt-2 border-t border-gold/30 flex justify-between text-sm text-gold font-bold">
                  <span>TOTAL PAYABLE</span>
                  <span className="font-serif text-base">
                    ₹{grandTotal.toLocaleString("en-IN")} <span className="text-[10px] font-normal font-sans">+ Delivery</span>
                  </span>
                </div>
              </div>

              {/* Place Order Button */}
              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={isSubmitting}
                className={`w-full py-4 border text-xs uppercase tracking-luxury font-bold transition-all flex items-center justify-center gap-2 ${
                  orderType === "WHATSAPP"
                    ? "border-green-500 bg-green-950 text-green-300 hover:bg-green-600 hover:text-white"
                    : "border-gold bg-gold text-black hover:bg-black hover:text-gold"
                }`}
              >
                {isSubmitting ? (
                  <span>COMMITTING ORDER...</span>
                ) : orderType === "WHATSAPP" ? (
                  <>
                    <MessageCircle className="w-4 h-4" />
                    <span>CONFIRM ON WHATSAPP (+91 {BRAND.phone})</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>SUBMIT WEBSITE ORDER FOR VERIFICATION</span>
                  </>
                )}
              </button>

              <p className="text-[9px] uppercase tracking-wider text-gold/60 text-center">
                ADMIN WILL VERIFY & CONFIRM LOCATION DISPATCH • NO PRE-CHARGED HIDDEN DELIVERY FEES
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

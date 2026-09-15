"use client";

import React from "react";
import Link from "next/link";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, MessageCircle } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { BRAND } from "@/lib/constants";

export default function CartPage() {
  const { cart, updateQuantity, removeItem, clearCart, subtotal } = useCart();

  if (cart.length === 0) {
    return (
      <div className="bg-black min-h-screen py-24 text-center px-4">
        <div className="max-w-md mx-auto border border-gold/30 bg-cream p-12 space-y-4">
          <ShoppingBag className="w-12 h-12 text-gold mx-auto" />
          <h1 className="font-serif text-2xl text-gold uppercase tracking-luxury">
            YOUR BAG IS EMPTY
          </h1>
          <p className="text-xs uppercase tracking-luxury text-gold/80">
            Discover the finest products and pieces of MAHALEELA.
          </p>
          <Link
            href="/#catalogue"
            className="mt-4 inline-block px-8 py-3 border border-gold bg-gold text-black text-xs uppercase tracking-luxury font-bold hover:bg-black hover:text-gold transition-colors"
          >
            DISCOVER PIECES
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="border-b border-gold/30 pb-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-ultra text-gold/70 font-serif block">
              ATELIER SELECTIONS
            </span>
            <h1 className="font-serif text-3xl text-gold uppercase tracking-luxury font-normal">
              YOUR SHOPPING BAG ({cart.length})
            </h1>
          </div>
          <button
            type="button"
            onClick={clearCart}
            className="text-xs uppercase tracking-luxury text-gold/70 hover:text-red-400"
          >
            CLEAR ALL
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="border border-gold/30 bg-cream p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-6"
              >
                <div className="relative w-24 h-32 bg-black border border-gold/20 flex-shrink-0 overflow-hidden">
                  <img
                    src={item.imageUrl || "/assets/mahaleela-logo.jpg"}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 space-y-2 text-center sm:text-left">
                  <h3 className="font-serif text-base text-gold uppercase font-medium">
                    {item.name}
                  </h3>
                  {item.color && (
                    <p className="text-[10px] uppercase tracking-wider text-gold/70">
                      COLOUR: {item.color}
                    </p>
                  )}
                  <p className="font-serif text-lg font-bold text-gold">
                    ₹{item.price.toLocaleString("en-IN")}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-gold">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                      className="px-3 py-1 text-gold hover:bg-black"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="px-3 text-xs font-mono text-gold font-bold">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-3 py-1 text-gold hover:bg-black"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="p-2 text-gold/60 hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="border border-gold bg-cream p-6 space-y-4">
              <h2 className="font-serif text-base text-gold uppercase tracking-luxury border-b border-gold/20 pb-2">
                ORDER SUMMARY
              </h2>

              <div className="space-y-2 text-xs uppercase tracking-wider">
                <div className="flex justify-between text-gold/80">
                  <span>SUBTOTAL</span>
                  <span className="font-serif font-bold">₹{subtotal.toLocaleString("en-IN")}</span>
                </div>

                <div className="p-3 border border-gold/30 bg-black text-[10px] text-gold space-y-1">
                  <p className="font-bold">DELIVERY CHARGES ACCORDING TO LOCATION</p>
                  <p className="text-gold/70 normal-case">
                    Communicated directly on WhatsApp based on your address and pincode.
                  </p>
                </div>

                <div className="pt-2 border-t border-gold/30 flex justify-between text-base text-gold font-bold">
                  <span>SUBTOTAL PAYABLE</span>
                  <span className="font-serif">₹{subtotal.toLocaleString("en-IN")}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="w-full py-4 border border-gold bg-gold text-black text-center text-xs uppercase tracking-luxury font-bold hover:bg-black hover:text-gold transition-colors block"
              >
                PROCEED TO CHECKOUT
              </Link>

              <a
                href={`https://wa.me/91${BRAND.phone}?text=${encodeURIComponent(`Hello MAHALEELA, I would like to inquire about delivery charges for my bag worth ₹${subtotal.toLocaleString("en-IN")}.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 border border-green-600/50 bg-green-950/40 text-green-300 text-center text-xs uppercase tracking-luxury hover:bg-green-600 hover:text-white transition-colors flex items-center justify-center gap-1.5"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>INQUIRE ON WHATSAPP (+91 {BRAND.phone})</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

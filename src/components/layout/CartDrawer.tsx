"use client";

import React from "react";
import Link from "next/link";
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, MessageCircle } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { BRAND } from "@/lib/constants";

export const CartDrawer: React.FC = () => {
  const { isCartOpen, setIsCartOpen, cart, updateQuantity, removeItem, subtotal } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-black border-l border-gold/30 flex flex-col justify-between shadow-2xl">
          {/* Header */}
          <div className="p-6 border-b border-gold/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-gold" />
              <h2 className="font-serif text-lg text-gold uppercase tracking-luxury font-normal">
                YOUR SHOPPING BAG
              </h2>
              <span className="text-xs text-gold/70 font-mono">({cart.length})</span>
            </div>
            <button
              type="button"
              onClick={() => setIsCartOpen(false)}
              className="p-1 text-gold hover:opacity-70 transition-opacity"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Delivery Charges Notice (Strictly no free shipping) */}
          <div className="p-3 bg-cream/40 border-b border-gold/20 text-center">
            <p className="text-[10px] uppercase tracking-luxury text-gold font-semibold">
              DELIVERY CHARGES ACCORDING TO LOCATION
            </p>
            <p className="text-[9px] uppercase tracking-wider text-gold/70 mt-0.5">
              Exact fees confirmed on WhatsApp based on your address & pincode
            </p>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-3">
                <ShoppingBag className="w-10 h-10 text-gold/50" />
                <p className="font-serif text-gold uppercase text-sm">YOUR BAG IS CURRENTLY EMPTY</p>
                <button
                  type="button"
                  onClick={() => setIsCartOpen(false)}
                  className="px-6 py-2 border border-gold bg-gold text-black text-xs uppercase tracking-luxury font-bold"
                >
                  EXPLORE PIECES
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="flex gap-4 p-3 border border-gold/20 bg-cream/20">
                  <div className="relative w-16 h-20 bg-cream border border-gold/20 flex-shrink-0 overflow-hidden">
                    <img
                      src={item.imageUrl || "/assets/mahaleela-logo.jpg"}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <h4 className="font-serif text-xs text-gold uppercase line-clamp-1">{item.name}</h4>
                        {item.color && (
                          <span className="text-[9px] uppercase tracking-wider text-gold/70 block">
                            COLOUR: {item.color}
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="text-gold/60 hover:text-red-400 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center border border-gold/40">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="px-2 py-0.5 text-gold hover:bg-cream"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-mono text-gold">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-0.5 text-gold hover:bg-cream"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="font-serif font-bold text-xs text-gold">
                        ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout Actions */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-gold/30 bg-cream/30 space-y-3">
              <div className="flex justify-between items-center text-sm font-serif text-gold font-bold">
                <span>SUBTOTAL</span>
                <span>₹{subtotal.toLocaleString("en-IN")}</span>
              </div>
              <p className="text-[9px] uppercase tracking-wider text-gold/70">
                + Delivery charges calculated according to location via WhatsApp
              </p>

              <Link
                href="/checkout"
                onClick={() => setIsCartOpen(false)}
                className="w-full py-3.5 border border-gold bg-gold text-black text-center text-xs uppercase tracking-luxury font-bold hover:bg-white transition-colors block"
              >
                PROCEED TO CHECKOUT
              </Link>

              <a
                href={`https://wa.me/91${BRAND.phone}?text=${encodeURIComponent(`Hello MAHALEELA, I am inquiring about delivery charges for my bag worth ₹${subtotal.toLocaleString("en-IN")}.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 border border-green-600/50 bg-green-950/40 text-green-300 text-center text-xs uppercase tracking-luxury hover:bg-green-600 hover:text-white transition-colors flex items-center justify-center gap-1.5"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>INQUIRE DELIVERY CHARGES ON WHATSAPP</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

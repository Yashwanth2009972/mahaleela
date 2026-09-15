"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { BRAND } from "./constants";

export interface CartItemType {
  id: string; // unique cart item key: `${productId}-${variantId || 'base'}`
  productId: string;
  name: string;
  price: number;
  mrp?: number;
  image?: string;
  imageUrl?: string;
  variantId?: string | null;
  size?: string | null;
  color?: string | null;
  quantity: number;
  categorySlug?: string;
}

interface CartContextType {
  cart: CartItemType[];
  wishlist: string[];
  addToCart: (item: Omit<CartItemType, "id">) => void;
  addItem: (item: Omit<CartItemType, "id">) => void;
  removeFromCart: (id: string) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  subtotal: number;
  shippingFee: number;
  codFee: number;
  freeShippingRemaining: number;
  cartCount: number;
  isCartDrawerOpen: boolean;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  openCartDrawer: () => void;
  closeCartDrawer: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItemType[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("mahaleela_cart");
      const savedWishlist = localStorage.getItem("mahaleela_wishlist");
      if (savedCart) setCart(JSON.parse(savedCart));
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
    } catch {
      // ignore
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem("mahaleela_cart", JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem("mahaleela_wishlist", JSON.stringify(wishlist));
    } catch {
      // ignore
    }
  }, [wishlist, isHydrated]);

  const addToCart = (item: Omit<CartItemType, "id">) => {
    const id = `${item.productId}-${item.variantId || "default"}`;
    setCart((prev) => {
      const existing = prev.find((i) => i.id === id);
      if (existing) {
        return prev.map((i) =>
          i.id === id ? { ...i, quantity: i.quantity + item.quantity } : i
        );
      }
      return [...prev, { ...item, id }];
    });
    setIsCartDrawerOpen(true);
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((i) => {
          if (i.id === id) {
            const newQty = i.quantity + delta;
            return newQty > 0 ? { ...i, quantity: newQty } : null;
          }
          return i;
        })
        .filter(Boolean) as CartItemType[]
    );
  };

  const clearCart = () => setCart([]);

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingFee = 0; // Delivery charges communicated according to location via WhatsApp
  const codFee = BRAND.shipping.codFee;
  const freeShippingRemaining = 0;
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        wishlist,
        addToCart,
        addItem: addToCart,
        removeFromCart,
        removeItem: removeFromCart,
        updateQuantity,
        clearCart,
        toggleWishlist,
        isInWishlist,
        subtotal,
        shippingFee,
        codFee,
        freeShippingRemaining,
        cartCount,
        isCartDrawerOpen,
        isCartOpen: isCartDrawerOpen,
        setIsCartOpen: setIsCartDrawerOpen,
        openCartDrawer: () => setIsCartDrawerOpen(true),
        closeCartDrawer: () => setIsCartDrawerOpen(false),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

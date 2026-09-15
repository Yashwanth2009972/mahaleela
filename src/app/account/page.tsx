import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { User, Package, MapPin, Heart, ShieldCheck, LogOut, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    redirect("/account/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: currentUser.userId },
    include: {
      orders: {
        orderBy: { createdAt: "desc" },
        include: { items: true },
      },
      addresses: true,
      wishlistItems: {
        include: {
          product: {
            include: { images: true },
          },
        },
      },
    },
  });

  if (!user) {
    redirect("/account/login");
  }

  const isAdmin = user.role === "ADMIN" || user.role === "SUPER_ADMIN";

  return (
    <div className="bg-white min-h-screen py-12 md:py-20 px-4 sm:px-6 lg:px-8 border-b border-gold/20">
      <div className="max-w-6xl mx-auto">
        {/* Header Banner */}
        <div className="border border-gold/30 bg-cream p-8 md:p-12 mb-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <span className="text-[10px] uppercase tracking-ultra text-gold/70 font-serif block mb-1">
              PATRON PROFILE
            </span>
            <h1 className="font-serif text-3xl md:text-4xl text-gold uppercase tracking-luxury font-normal">
              {user.name || "ESTEEMED PATRON"}
            </h1>
            <p className="text-xs uppercase tracking-luxury text-gold/80 mt-1">
              {user.email} {user.phone && `• ${user.phone}`}
            </p>
            <div className="mt-3 flex items-center gap-3">
              <span className="text-[10px] uppercase tracking-luxury border border-gold px-2.5 py-0.5 bg-white text-gold font-medium">
                TIER: {user.role === "CUSTOMER" ? "ESTEEMED CLIENT" : user.role}
              </span>
              <span className="text-[10px] uppercase tracking-luxury border border-gold px-2.5 py-0.5 bg-white text-gold font-medium">
                SALON ACCESS: {user.exclusiveStatus}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {isAdmin && (
              <Link
                href="/admin"
                className="px-6 py-2.5 border border-gold bg-gold text-white text-xs uppercase tracking-luxury hover:bg-white hover:text-gold transition-colors font-semibold flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>ATELIER CMS</span>
              </Link>
            )}
            <form action="/api/auth/logout" method="POST">
              <button
                type="submit"
                className="px-6 py-2.5 border border-gold bg-white text-gold text-xs uppercase tracking-luxury hover:bg-cream transition-colors flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>SIGN OUT</span>
              </button>
            </form>
          </div>
        </div>

        {/* Account Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 1. ORDERS MODULE */}
          <div className="md:col-span-2 space-y-6">
            <div className="border border-gold/30 bg-white p-6">
              <div className="flex items-center justify-between border-b border-gold/20 pb-4 mb-6">
                <div className="flex items-center gap-3">
                  <Package className="w-5 h-5 text-gold" />
                  <h2 className="font-serif text-lg text-gold uppercase tracking-luxury">
                    ACQUISITIONS & ORDERS ({user.orders.length})
                  </h2>
                </div>
                <Link
                  href="/orders"
                  className="text-[10px] uppercase tracking-luxury text-gold underline underline-offset-4"
                >
                  TRACK SHIPMENT
                </Link>
              </div>

              {user.orders.length > 0 ? (
                <div className="space-y-4">
                  {user.orders.map((order) => (
                    <div
                      key={order.id}
                      className="border border-gold/20 bg-cream p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-4"
                    >
                      <div>
                        <div className="flex items-center gap-3">
                          <span className="font-serif text-sm uppercase tracking-luxury text-gold font-bold">
                            {order.orderNumber}
                          </span>
                          <span className="text-[9px] uppercase tracking-luxury border border-gold px-2 py-0.5 bg-white text-gold">
                            {order.orderStatus}
                          </span>
                        </div>
                        <p className="text-[11px] uppercase tracking-luxury text-gold/80 mt-1">
                          {new Date(order.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })} • {order.items.length} PIECE(S)
                        </p>
                        <p className="text-xs uppercase tracking-luxury text-gold font-bold mt-1">
                          TOTAL: ₹{order.total.toLocaleString("en-IN")} • {order.paymentMethod}
                        </p>
                      </div>

                      <Link
                        href={`/orders/${order.orderNumber}`}
                        className="px-4 py-2 border border-gold bg-white text-gold text-xs uppercase tracking-luxury hover:bg-gold hover:text-white transition-colors text-center"
                      >
                        VIEW RECEIPT
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-cream border border-gold/20 p-6">
                  <p className="text-xs uppercase tracking-luxury text-gold/80 mb-4">
                    NO PRIOR ACQUISITIONS RECORDED.
                  </p>
                  <Link
                    href="/#catalogue"
                    className="inline-block px-6 py-2.5 border border-gold bg-gold text-white text-xs uppercase tracking-luxury hover:bg-white hover:text-gold transition-colors"
                  >
                    EXPLORE ARCHIVE
                  </Link>
                </div>
              )}
            </div>

            {/* 2. SAVED RESIDENCES / ADDRESSES */}
            <div className="border border-gold/30 bg-white p-6">
              <div className="flex items-center gap-3 border-b border-gold/20 pb-4 mb-6">
                <MapPin className="w-5 h-5 text-gold" />
                <h2 className="font-serif text-lg text-gold uppercase tracking-luxury">
                  SAVED RESIDENCES ({user.addresses.length})
                </h2>
              </div>

              {user.addresses.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {user.addresses.map((addr) => (
                    <div key={addr.id} className="border border-gold/20 bg-cream p-4">
                      <p className="font-serif text-xs uppercase tracking-luxury text-gold font-bold">
                        {addr.fullName}
                      </p>
                      <p className="text-[11px] uppercase tracking-luxury text-gold/80 mt-1">
                        {addr.addressLine1}, {addr.city}, {addr.state} - {addr.postalCode}
                      </p>
                      <p className="text-[10px] uppercase tracking-luxury text-gold/70 mt-1">
                        TEL: {addr.phone}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs uppercase tracking-luxury text-gold/80 py-4">
                  RESIDENCES ARE RECORDED AT TIME OF LUXURY CHECKOUT DISPATCH.
                </p>
              )}
            </div>
          </div>

          {/* Right Column: Wishlist Quick Glance & Salon Access */}
          <div className="space-y-6">
            {/* Salon Status Card */}
            <div className="border border-gold bg-cream p-6">
              <span className="text-[10px] uppercase tracking-ultra text-gold/70 block mb-1">
                PRIVATE ACCESS
              </span>
              <h3 className="font-serif text-base text-gold uppercase tracking-luxury font-semibold">
                THE EXCLUSIVE SALON
              </h3>
              <p className="text-xs uppercase tracking-luxury text-gold/80 mt-2 leading-relaxed">
                Unlock private capsule allocations, made-to-measure reservations, and private showings.
              </p>
              <Link
                href="/exclusive"
                className="mt-5 inline-flex items-center justify-between w-full px-4 py-2.5 border border-gold bg-white text-gold text-xs uppercase tracking-luxury hover:bg-gold hover:text-white transition-colors"
              >
                <span>ENTER THE SALON</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Wishlist Box */}
            <div className="border border-gold/30 bg-white p-6">
              <div className="flex items-center justify-between border-b border-gold/20 pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-gold" />
                  <h3 className="font-serif text-sm text-gold uppercase tracking-luxury">
                    SAVED PIECES ({user.wishlistItems.length})
                  </h3>
                </div>
                <Link
                  href="/wishlist"
                  className="text-[10px] uppercase tracking-luxury text-gold underline underline-offset-4"
                >
                  VIEW ALL
                </Link>
              </div>

              {user.wishlistItems.length > 0 ? (
                <div className="space-y-3">
                  {user.wishlistItems.slice(0, 3).map((item) => (
                    <div key={item.id} className="flex items-center gap-3 border-b border-gold/10 pb-3">
                      <div className="w-12 h-12 bg-cream border border-gold/30 flex items-center justify-center overflow-hidden">
                        {item.product.images?.[0] ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={item.product.images[0].url}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Heart className="w-4 h-4 text-gold" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/product/${item.product.slug}`}
                          className="text-xs uppercase tracking-luxury text-gold font-medium truncate block hover:underline"
                        >
                          {item.product.name}
                        </Link>
                        <p className="text-[10px] uppercase tracking-luxury text-gold/70 mt-0.5">
                          ₹{item.product.price.toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs uppercase tracking-luxury text-gold/70 py-4 text-center">
                  YOUR WISHLIST IS CURRENTLY EMPTY.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

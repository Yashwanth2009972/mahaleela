import React from "react";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Package, Search, ArrowRight, Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const currentUser = await getCurrentUser();
  const query = searchParams.q?.trim();

  let orders: any[] = [];

  if (query) {
    orders = await prisma.order.findMany({
      where: {
        OR: [
          { orderNumber: { contains: query } },
          { email: { contains: query } },
        ],
      },
      include: { items: true },
      orderBy: { createdAt: "desc" },
    });
  } else if (currentUser) {
    orders = await prisma.order.findMany({
      where: { userId: currentUser.userId },
      include: { items: true },
      orderBy: { createdAt: "desc" },
    });
  }

  return (
    <div className="bg-white min-h-screen py-12 md:py-20 px-4 sm:px-6 lg:px-8 border-b border-gold/20">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="border-b border-gold/20 pb-6 mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-[10px] uppercase tracking-ultra text-gold/70 font-serif block mb-1">
              DISPATCH ARCHIVE
            </span>
            <h1 className="font-serif text-3xl md:text-4xl text-gold uppercase tracking-luxury font-normal">
              ORDER TRACKING & HISTORY
            </h1>
          </div>
          <Link
            href="/account"
            className="text-xs uppercase tracking-luxury text-gold inline-flex items-center gap-1.5 hover:underline underline-offset-4"
          >
            <span>CLIENT ACCOUNT</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Order Lookup Form */}
        <div className="border border-gold/30 bg-cream p-6 mb-10">
          <h2 className="font-serif text-sm uppercase tracking-luxury text-gold font-semibold mb-3">
            LOOKUP AN ACQUISITION BY ORDER NUMBER OR EMAIL
          </h2>
          <form action="/orders" method="GET" className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              name="q"
              defaultValue={query || ""}
              placeholder="E.G. ML-XXXXXX OR CLIENT@MAISON.COM"
              className="flex-1 bg-white border border-gold/40 px-4 py-2.5 text-xs uppercase tracking-wider text-gold placeholder-gold/40 focus:outline-none focus:border-gold"
            />
            <button
              type="submit"
              className="px-6 py-2.5 border border-gold bg-gold text-white text-xs uppercase tracking-luxury hover:bg-white hover:text-gold transition-colors font-medium flex items-center justify-center gap-2"
            >
              <Search className="w-3.5 h-3.5" />
              <span>SEARCH ARCHIVE</span>
            </button>
          </form>
        </div>

        {/* Orders Listing */}
        {orders.length > 0 ? (
          <div className="space-y-6">
            {orders.map((order: any) => (
              <div key={order.id} className="border border-gold/30 bg-white p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gold/20 pb-4 mb-4 gap-2">
                  <div>
                    <span className="text-[10px] uppercase tracking-ultra text-gold/70 block">
                      ORDER IDENTIFIER
                    </span>
                    <span className="font-serif text-base uppercase tracking-luxury text-gold font-bold">
                      {order.orderNumber}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] uppercase tracking-luxury border border-gold px-3 py-1 bg-cream text-gold font-semibold">
                      STATUS: {order.orderStatus}
                    </span>
                    <Link
                      href={`/orders/${order.orderNumber}`}
                      className="px-4 py-1 border border-gold bg-white text-gold text-xs uppercase tracking-luxury hover:bg-gold hover:text-white transition-colors"
                    >
                      VIEW DOSSIER
                    </Link>
                  </div>
                </div>

                {/* Items preview */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                  {order.items.map((item: any) => (
                    <div key={item.id} className="flex items-center gap-3 bg-cream p-3 border border-gold/10">
                      <div className="w-12 h-12 bg-white border border-gold/20 shrink-0 overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.imageUrl || "/assets/mahaleela-logo.jpg"}
                          alt={item.productName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs uppercase tracking-luxury text-gold truncate font-medium">
                          {item.productName}
                        </p>
                        <p className="text-[10px] uppercase tracking-luxury text-gold/70">
                          QTY: {item.quantity} {item.variantInfo && `• ${item.variantInfo}`}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap items-center justify-between text-xs uppercase tracking-luxury text-gold/80 border-t border-gold/10 pt-4">
                  <span>DISPATCHED TO: {order.customerName} ({order.shippingAddress ? JSON.parse(order.shippingAddress)?.city || "INDIA" : "INDIA"})</span>
                  <span className="font-bold text-gold">TOTAL: ₹{order.total.toLocaleString("en-IN")} • {order.paymentMethod}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="border border-gold/30 bg-cream p-12 text-center max-w-lg mx-auto">
            <Package className="w-8 h-8 text-gold mx-auto mb-4" />
            <h3 className="font-serif text-xl text-gold uppercase tracking-luxury">
              NO ACQUISITIONS FOUND
            </h3>
            <p className="mt-2 text-xs uppercase tracking-luxury text-gold/80 leading-relaxed">
              {query
                ? `No orders match "${query}". Please verify your order number or email.`
                : "Sign in to view your orders, or enter an Order ID above."}
            </p>
            <div className="mt-6">
              <Link
                href="/collections"
                className="px-6 py-2.5 border border-gold bg-gold text-white text-xs uppercase tracking-luxury hover:bg-white hover:text-gold transition-colors inline-block"
              >
                EXPLORE ATELIER
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

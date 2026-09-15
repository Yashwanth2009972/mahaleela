import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { 
  ShoppingBag, 
  DollarSign, 
  Users, 
  Package, 
  AlertCircle, 
  Clock, 
  ArrowRight,
  Layers,
  Sparkles,
  ExternalLink,
  Plus
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  // Aggregate Metrics
  const [
    totalOrders,
    ordersWithTotal,
    totalCustomers,
    totalProducts,
    lowStockProducts,
    pendingOrders,
    recentOrders,
    recentProducts,
  ] = await Promise.all([
    prisma.order.count(),
    prisma.order.findMany({ select: { total: true } }),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.product.count({ where: { isArchived: false } }),
    prisma.product.count({ where: { stock: { lte: 5 }, isArchived: false } }),
    prisma.order.count({ where: { orderStatus: "ORDER RECEIVED" } }),
    prisma.order.findMany({
      take: 6,
      orderBy: { createdAt: "desc" },
      include: { items: true },
    }),
    prisma.product.findMany({
      take: 4,
      orderBy: { createdAt: "desc" },
      include: { images: true, category: true },
    }),
  ]);

  const totalRevenue = ordersWithTotal.reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="space-y-8">
      {/* Top Banner / Welcome */}
      <div className="border border-gold/30 bg-cream p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-ultra text-gold/70 font-serif block mb-1">
            EXECUTIVE ATELIER SUITE
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl text-gold uppercase tracking-luxury font-normal">
            MAHALEELA DASHBOARD
          </h1>
          <p className="text-xs uppercase tracking-luxury text-gold/80 mt-1">
            CENTRALIZED MANAGEMENT OF CATALOGUE, GALLERY, ORDERS & VISUAL ASSETS
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/admin/products/new"
            className="px-4 py-2 border border-gold bg-gold text-white text-xs uppercase tracking-luxury hover:bg-white hover:text-gold transition-colors font-medium flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>NEW PRODUCT</span>
          </Link>
          <Link
            href="/admin/gallery"
            className="px-4 py-2 border border-gold bg-white text-gold text-xs uppercase tracking-luxury hover:bg-cream transition-colors font-medium flex items-center gap-1.5"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>PHOTO GALLERY</span>
          </Link>
          <Link
            href="/admin/visual-assets"
            className="px-4 py-2 border border-gold bg-white text-gold text-xs uppercase tracking-luxury hover:bg-cream transition-colors font-medium flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>VISUAL ASSETS</span>
          </Link>
        </div>
      </div>

      {/* 6 Key Executive Metrics (Pure White & Cream Cards) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Metric 1: Total Revenue */}
        <div className="border border-gold/30 bg-white p-5">
          <span className="text-[9px] uppercase tracking-ultra text-gold/70 block mb-1">
            GROSS REVENUE
          </span>
          <p className="font-serif text-xl sm:text-2xl text-gold font-bold">
            ?{totalRevenue.toLocaleString("en-IN")}
          </p>
          <span className="text-[9px] uppercase tracking-luxury text-gold/60 block mt-2">
            ALL-TIME SETTLED
          </span>
        </div>

        {/* Metric 2: Total Orders */}
        <div className="border border-gold/30 bg-white p-5">
          <span className="text-[9px] uppercase tracking-ultra text-gold/70 block mb-1">
            TOTAL ORDERS
          </span>
          <p className="font-serif text-xl sm:text-2xl text-gold font-bold">
            {totalOrders}
          </p>
          <Link
            href="/admin/orders"
            className="text-[9px] uppercase tracking-luxury text-gold underline underline-offset-4 block mt-2"
          >
            MANAGE ORDERS ?
          </Link>
        </div>

        {/* Metric 3: Pending Orders */}
        <div className="border border-gold/30 bg-cream p-5">
          <span className="text-[9px] uppercase tracking-ultra text-gold/70 block mb-1">
            PENDING ORDERS
          </span>
          <p className="font-serif text-xl sm:text-2xl text-gold font-bold">
            {pendingOrders}
          </p>
          <span className="text-[9px] uppercase tracking-luxury text-gold/70 block mt-2">
            NEEDS DISPATCH
          </span>
        </div>

        {/* Metric 4: Total Products */}
        <div className="border border-gold/30 bg-white p-5">
          <span className="text-[9px] uppercase tracking-ultra text-gold/70 block mb-1">
            LIVE PRODUCTS
          </span>
          <p className="font-serif text-xl sm:text-2xl text-gold font-bold">
            {totalProducts}
          </p>
          <Link
            href="/admin/products"
            className="text-[9px] uppercase tracking-luxury text-gold underline underline-offset-4 block mt-2"
          >
            CATALOGUE ?
          </Link>
        </div>

        {/* Metric 5: Low Stock */}
        <div className="border border-gold/30 bg-cream p-5">
          <span className="text-[9px] uppercase tracking-ultra text-gold/70 block mb-1">
            LOW STOCK ITEMS
          </span>
          <p className="font-serif text-xl sm:text-2xl text-gold font-bold">
            {lowStockProducts}
          </p>
          <span className="text-[9px] uppercase tracking-luxury text-gold/70 block mt-2">
            STOCK = 5 UNITS
          </span>
        </div>

        {/* Metric 6: Customers */}
        <div className="border border-gold/30 bg-white p-5">
          <span className="text-[9px] uppercase tracking-ultra text-gold/70 block mb-1">
            REGISTERED PATRONS
          </span>
          <p className="font-serif text-xl sm:text-2xl text-gold font-bold">
            {totalCustomers}
          </p>
          <Link
            href="/admin/customers"
            className="text-[9px] uppercase tracking-luxury text-gold underline underline-offset-4 block mt-2"
          >
            CLIENTELE ?
          </Link>
        </div>
      </div>

      {/* Two Column Layout: Recent Orders & Quick Launch Shortcuts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Recent Orders Table */}
        <div className="lg:col-span-8 border border-gold/30 bg-white p-6">
          <div className="flex items-center justify-between border-b border-gold/20 pb-4 mb-6">
            <h2 className="font-serif text-base text-gold uppercase tracking-luxury font-semibold">
              RECENT ORDERS ({recentOrders.length})
            </h2>
            <Link
              href="/admin/orders"
              className="text-xs uppercase tracking-luxury text-gold underline underline-offset-4"
            >
              VIEW ALL ORDERS
            </Link>
          </div>

          {recentOrders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs uppercase tracking-luxury">
                <thead>
                  <tr className="border-b border-gold/20 text-[10px] text-gold/70">
                    <th className="pb-3">ORDER ID</th>
                    <th className="pb-3">PATRON</th>
                    <th className="pb-3">METHOD</th>
                    <th className="pb-3">STATUS</th>
                    <th className="pb-3 text-right">TOTAL</th>
                    <th className="pb-3 text-right">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gold/10">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-cream/40 transition-colors">
                      <td className="py-3.5 font-serif font-bold text-gold">
                        {order.orderNumber}
                      </td>
                      <td className="py-3.5 text-gold/80">{order.customerName}</td>
                      <td className="py-3.5 text-gold/80">{order.paymentMethod}</td>
                      <td className="py-3.5">
                        <span className="border border-gold px-2 py-0.5 bg-cream text-[9px] text-gold font-medium">
                          {order.orderStatus}
                        </span>
                      </td>
                      <td className="py-3.5 text-right font-serif font-bold text-gold">
                        ?{order.total.toLocaleString("en-IN")}
                      </td>
                      <td className="py-3.5 text-right">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="px-2.5 py-1 border border-gold text-[10px] hover:bg-gold hover:text-white transition-colors"
                        >
                          MANAGE
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center bg-cream border border-gold/20">
              <p className="text-xs uppercase tracking-luxury text-gold/80">
                NO ORDERS HAVE BEEN PLACED YET.
              </p>
              <p className="text-[10px] uppercase tracking-luxury text-gold/60 mt-1">
                TRANSACTIONS COMPLETED VIA STOREFRONT WILL REGISTER HERE AUTOMATICALLY.
              </p>
            </div>
          )}
        </div>

        {/* Right: Quick Launch & Studio Shortcuts */}
        <div className="lg:col-span-4 space-y-6">
          {/* Visual Assets & Templates Highlight Box */}
          <div className="border border-gold bg-cream p-6">
            <span className="text-[9px] uppercase tracking-ultra text-gold/70 block mb-1 font-serif">
              STUDIO SUITE
            </span>
            <h3 className="font-serif text-base text-gold uppercase tracking-luxury font-bold">
              VISUAL ASSET SYSTEM
            </h3>
            <p className="text-xs uppercase tracking-luxury text-gold/80 mt-2 leading-relaxed">
              64+ ready-to-use luxury templates for Instagram posts, stories, reel covers, campaigns, and email.
            </p>
            <div className="mt-5 space-y-2">
              <Link
                href="/admin/visual-assets"
                className="w-full py-2.5 border border-gold bg-gold text-white text-xs uppercase tracking-luxury hover:bg-white hover:text-gold transition-colors font-medium flex items-center justify-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>OPEN VISUAL ASSETS</span>
              </Link>
              <Link
                href="/admin/visual-assets/editor"
                className="w-full py-2.5 border border-gold bg-white text-gold text-xs uppercase tracking-luxury hover:bg-cream transition-colors font-medium flex items-center justify-center gap-2"
              >
                <span>LIVE TEMPLATE EDITOR</span>
              </Link>
            </div>
          </div>

          {/* CMS Controls Box */}
          <div className="border border-gold/30 bg-white p-6 space-y-3">
            <h3 className="font-serif text-sm text-gold uppercase tracking-luxury font-semibold border-b border-gold/20 pb-2">
              ATELIER CMS CONTROLS
            </h3>
            <Link
              href="/admin/homepage"
              className="flex items-center justify-between p-2.5 border border-gold/20 bg-cream hover:border-gold text-xs uppercase tracking-luxury text-gold transition-colors"
            >
              <span>HOMEPAGE BUILDER</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/admin/gallery"
              className="flex items-center justify-between p-2.5 border border-gold/20 bg-cream hover:border-gold text-xs uppercase tracking-luxury text-gold transition-colors"
            >
              <span>ATELIER PHOTO GALLERY</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/admin/media"
              className="flex items-center justify-between p-2.5 border border-gold/20 bg-cream hover:border-gold text-xs uppercase tracking-luxury text-gold transition-colors"
            >
              <span>MEDIA VAULT & UPLOADER</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/admin/exclusive"
              className="flex items-center justify-between p-2.5 border border-gold/20 bg-cream hover:border-gold text-xs uppercase tracking-luxury text-gold transition-colors"
            >
              <span>EXCLUSIVE SALON RULES</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/admin/settings"
              className="flex items-center justify-between p-2.5 border border-gold/20 bg-cream hover:border-gold text-xs uppercase tracking-luxury text-gold transition-colors"
            >
              <span>GLOBAL SITE SETTINGS</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

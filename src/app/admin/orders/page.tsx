import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ShoppingBag, Search, ExternalLink, Printer } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: { status?: string; q?: string };
}) {
  const whereClause: any = {};
  if (searchParams.status && searchParams.status !== "ALL") {
    whereClause.orderStatus = searchParams.status;
  }
  if (searchParams.q) {
    whereClause.OR = [
      { orderNumber: { contains: searchParams.q } },
      { customerName: { contains: searchParams.q } },
      { email: { contains: searchParams.q } },
    ];
  }

  const orders = await prisma.order.findMany({
    where: whereClause,
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  const statuses = [
    "ALL",
    "PENDING_ACCEPTANCE",
    "ACCEPTED",
    "REJECTED",
    "CONFIRMED",
    "PACKED",
    "SHIPPED",
    "OUT FOR DELIVERY",
    "DELIVERED",
    "CANCELLED",
  ];

  return (
    <div className="space-y-8">
      <div className="border border-gold/30 bg-cream p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-ultra text-gold/70 font-serif block mb-1">
            CLIENT DISPATCH REGISTER
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl text-gold uppercase tracking-luxury font-normal">
            ORDERS DISPATCH MANAGEMENT ({orders.length})
          </h1>
          <p className="text-xs uppercase tracking-luxury text-gold/80 mt-1">
            WEBSITE & WHATSAPP ORDERS • ACCEPT / REJECT VERIFICATION • AUTO-GENERATED SHIPPING LABELS
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gold/20 pb-4">
        {statuses.map((st) => (
          <Link
            key={st}
            href={`/admin/orders${st === "ALL" ? "" : `?status=${encodeURIComponent(st)}`}`}
            className={`px-3 py-1.5 border text-[10px] uppercase tracking-luxury transition-colors ${
              (searchParams.status === st || (!searchParams.status && st === "ALL"))
                ? "border-gold bg-gold text-black font-bold"
                : "border-gold/30 bg-cream text-gold hover:border-gold"
            }`}
          >
            {st}
          </Link>
        ))}
      </div>

      {/* Orders Table */}
      <div className="border border-gold/30 bg-black p-6 shadow-sm overflow-x-auto">
        {orders.length > 0 ? (
          <table className="w-full text-left text-xs uppercase tracking-luxury">
            <thead>
              <tr className="border-b border-gold/20 text-[10px] text-gold/70">
                <th className="pb-3">ORDER NUMBER</th>
                <th className="pb-3">TYPE</th>
                <th className="pb-3">PATRON</th>
                <th className="pb-3">ITEMS</th>
                <th className="pb-3">STATUS</th>
                <th className="pb-3">TOTAL</th>
                <th className="pb-3 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold/10">
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-cream/40 transition-colors">
                  <td className="py-3.5 font-serif font-bold text-gold">{o.orderNumber}</td>
                  <td className="py-3.5">
                    <span className={`px-2 py-0.5 border text-[9px] font-bold tracking-wider ${
                      o.orderType === "WHATSAPP"
                        ? "border-green-500/50 bg-green-950/40 text-green-300"
                        : "border-gold/40 bg-cream text-gold"
                    }`}>
                      {o.orderType || "WEBSITE"}
                    </span>
                  </td>
                  <td className="py-3.5">
                    <p className="font-medium text-gold">{o.customerName}</p>
                    <p className="text-[10px] text-gold/70">{o.phone}</p>
                  </td>
                  <td className="py-3.5 text-gold/80">{o.items.length} PIECE(S)</td>
                  <td className="py-3.5">
                    <span className={`px-2 py-0.5 border text-[9px] uppercase tracking-wider ${
                      o.orderStatus === "ACCEPTED"
                        ? "border-green-500 bg-green-950/50 text-green-300"
                        : o.orderStatus === "REJECTED"
                        ? "border-red-500 bg-red-950/50 text-red-300"
                        : "border-gold/40 bg-cream text-gold"
                    }`}>
                      {o.orderStatus}
                    </span>
                  </td>
                  <td className="py-3.5 font-serif font-bold text-gold">
                    ₹{o.total.toLocaleString("en-IN")}
                  </td>
                  <td className="py-3.5 text-right space-x-2">
                    <Link
                      href={`/admin/orders/${o.id}/shipping-label`}
                      className="inline-flex items-center gap-1 px-2.5 py-1 border border-gold/40 text-gold text-[10px] hover:bg-gold hover:text-black transition-colors"
                      title="Auto-Generated Shipping Label"
                    >
                      <Printer className="w-3 h-3" />
                      <span>LABEL</span>
                    </Link>
                    <Link
                      href={`/admin/orders/${o.id}`}
                      className="inline-flex items-center gap-1 px-2.5 py-1 border border-gold bg-cream text-gold text-[10px] hover:bg-gold hover:text-black transition-colors font-medium"
                    >
                      <span>MANAGE</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="py-12 text-center text-gold/80 space-y-2">
            <ShoppingBag className="w-8 h-8 mx-auto text-gold opacity-50" />
            <p className="font-serif text-sm">NO ORDERS MATCHING SELECTION</p>
          </div>
        )}
      </div>
    </div>
  );
}

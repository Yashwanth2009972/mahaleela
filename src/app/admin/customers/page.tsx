import React from "react";
import { prisma } from "@/lib/prisma";
import { Users, ShieldCheck } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminCustomersPage() {
  const patrons = await prisma.user.findMany({
    where: { role: "CUSTOMER" },
    include: {
      orders: { select: { total: true } },
      addresses: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8">
      <div className="border border-gold/30 bg-cream p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-ultra text-gold/70 font-serif block mb-1">
            CLIENTELE ARCHIVE
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl text-gold uppercase tracking-luxury font-normal">
            PATRONS DIRECTORY ({patrons.length})
          </h1>
          <p className="text-xs uppercase tracking-luxury text-gold/80 mt-1">
            REGISTERED CLIENTS, ORDERS FREQUENCY, AND SALON EXCLUSIVE ELIGIBILITY
          </p>
        </div>
      </div>

      <div className="border border-gold/30 bg-white p-6 shadow-sm overflow-x-auto">
        {patrons.length > 0 ? (
          <table className="w-full text-left text-xs uppercase tracking-luxury">
            <thead>
              <tr className="border-b border-gold/20 text-[10px] text-gold/70">
                <th className="pb-3">PATRON NAME</th>
                <th className="pb-3">EMAIL DISPATCH</th>
                <th className="pb-3">MOBILE</th>
                <th className="pb-3">ACQUISITIONS</th>
                <th className="pb-3">LIFETIME VALUE</th>
                <th className="pb-3">SALON STATUS</th>
                <th className="pb-3 text-right">JOINED</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold/10">
              {patrons.map((p) => {
                const totalSpent = p.orders.reduce((sum, o) => sum + o.total, 0);
                return (
                  <tr key={p.id} className="hover:bg-cream/40 transition-colors">
                    <td className="py-3.5 font-serif font-bold text-gold">{p.name || "UNREGISTERED NAME"}</td>
                    <td className="py-3.5 text-gold/80">{p.email}</td>
                    <td className="py-3.5 text-gold/80">{p.phone || "�"}</td>
                    <td className="py-3.5 font-medium text-gold">{p.orders.length} ORDERS</td>
                    <td className="py-3.5 font-serif font-bold text-gold">?{totalSpent.toLocaleString("en-IN")}</td>
                    <td className="py-3.5">
                      <span className="border border-gold px-2 py-0.5 bg-cream text-[9px] text-gold">
                        {p.exclusiveStatus}
                      </span>
                    </td>
                    <td className="py-3.5 text-right text-[10px] text-gold/70">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="p-8 text-center bg-cream border border-gold/20">
            <p className="text-xs uppercase tracking-luxury text-gold/80">NO REGISTERED PATRONS YET.</p>
          </div>
        )}
      </div>
    </div>
  );
}

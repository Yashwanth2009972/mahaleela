import { prisma } from "@/lib/prisma";
import { BadgePercent } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminOffersPage() {
  const offers = await prisma.offer.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="border border-gold/30 bg-cream p-6 sm:p-8">
        <span className="text-[10px] tracking-ultra uppercase text-gold/70 font-serif block mb-1">
          COMMERCIAL CAMPAIGNS
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl text-gold uppercase tracking-luxury font-normal">
          SEASONAL OFFERS & PROMOTIONS
        </h1>
        <p className="text-xs uppercase tracking-luxury text-gold/80 mt-1 font-light">
          CONFIGURE LIMITED-TIME PROMOTIONS, CATEGORY-WIDE DISCOUNTS, AND ARCHIVAL BENEFITS.
        </p>
      </div>

      <div className="border border-gold/30 bg-white p-6 shadow-sm">
        {offers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-gold/20 bg-cream text-gold font-serif">
                  <th className="py-3 px-4">OFFER TITLE</th>
                  <th className="py-3 px-4">DISCOUNT</th>
                  <th className="py-3 px-4">TARGET</th>
                  <th className="py-3 px-4">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gold/10">
                {offers.map((o) => (
                  <tr key={o.id} className="hover:bg-cream/40 transition-colors">
                    <td className="py-3 px-4 font-serif font-semibold text-gold uppercase">
                      {o.title}
                    </td>
                    <td className="py-3 px-4 font-serif text-gold">
                      {o.discountValue}%
                    </td>
                    <td className="py-3 px-4 uppercase text-gold/80">
                      {o.targetType}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 border border-gold bg-cream text-[9px] uppercase tracking-wider text-gold font-medium">
                        {o.isActive ? "ACTIVE" : "INACTIVE"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-10 text-center bg-cream border border-gold/20 max-w-md mx-auto space-y-3">
            <BadgePercent className="w-8 h-8 text-gold mx-auto" />
            <h3 className="font-serif text-lg text-gold uppercase tracking-luxury font-medium">
              NO ACTIVE PROMOTIONAL OFFERS
            </h3>
            <p className="text-xs uppercase tracking-luxury text-gold/80 font-light">
              MAHALEELA maintains disciplined luxury pricing. Special promotional events can be created here when desired.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { FolderTree, ExternalLink, Package } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { orderIndex: "asc" },
    include: {
      _count: { select: { products: true } },
    },
  });

  return (
    <div className="space-y-8">
      <div className="border border-gold/30 bg-cream p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-ultra text-gold/70 font-serif block mb-1">
            ATELIER ARCHITECTURE
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl text-gold uppercase tracking-luxury font-normal">
            DEPARTMENTS & CATEGORIES ({categories.length})
          </h1>
          <p className="text-xs uppercase tracking-luxury text-gold/80 mt-1">
            12 PREDEFINED LUXURY ARCHIVES (STRICTLY NO DISALLOWED DEPARTMENTS)
          </p>
        </div>
      </div>

      <div className="border border-gold/30 bg-black p-6 shadow-sm overflow-x-auto">
        <table className="w-full text-left text-xs uppercase tracking-luxury">
          <thead>
            <tr className="border-b border-gold/20 text-[10px] text-gold/70">
              <th className="pb-3">ORDER</th>
              <th className="pb-3">DEPARTMENT NAME</th>
              <th className="pb-3">SLUG</th>
              <th className="pb-3">ALLOCATED PRODUCTS</th>
              <th className="pb-3">STATUS</th>
              <th className="pb-3 text-right">STOREFRONT LINK</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gold/10">
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-cream/40 transition-colors">
                <td className="py-3.5 font-serif font-bold text-gold">0{cat.orderIndex}</td>
                <td className="py-3.5 font-serif font-bold text-gold">{cat.name}</td>
                <td className="py-3.5 text-[10px] text-gold/70">/category/{cat.slug}</td>
                <td className="py-3.5">
                  <span className="border border-gold px-2 py-0.5 bg-cream text-[9px] text-gold font-medium">
                    {cat._count.products} LIVE PIECES
                  </span>
                </td>
                <td className="py-3.5">
                  <span className="border border-gold px-2 py-0.5 bg-white text-[9px] text-gold">
                    {cat.isPublished ? "ACTIVE" : "HIDDEN"}
                  </span>
                </td>
                <td className="py-3.5 text-right">
                  <Link
                    href={`/category/${cat.slug}`}
                    target="_blank"
                    className="inline-flex items-center gap-1.5 px-3 py-1 border border-gold text-[10px] hover:bg-gold hover:text-white transition-colors"
                  >
                    <span>VIEW</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

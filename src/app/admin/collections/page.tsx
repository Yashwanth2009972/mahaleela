import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Plus, Layers, Sparkles, ExternalLink, Edit } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminCollectionsPage() {
  const collections = await prisma.collection.findMany({
    include: {
      products: { include: { product: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border border-gold/30 bg-cream p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-ultra text-gold/70 font-serif block mb-1">
            CURATION ARCHIVE
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl text-gold uppercase tracking-luxury font-normal">
            COLLECTIONS MANAGEMENT ({collections.length})
          </h1>
          <p className="text-xs uppercase tracking-luxury text-gold/80 mt-1">
            FIRST-CLASS EDITORIAL ANTHOLOGIES & CAPSULE RELEASES
          </p>
        </div>

        <Link
          href="/admin/collections/new"
          className="px-6 py-3 border border-gold bg-gold text-white text-xs uppercase tracking-luxury hover:bg-white hover:text-gold transition-colors font-medium flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>CREATE COLLECTION</span>
        </Link>
      </div>

      {/* Table or Empty state */}
      <div className="border border-gold/30 bg-white p-6 shadow-sm">
        {collections.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs uppercase tracking-luxury">
              <thead>
                <tr className="border-b border-gold/20 text-[10px] text-gold/70">
                  <th className="pb-3">IMAGE</th>
                  <th className="pb-3">COLLECTION TITLE</th>
                  <th className="pb-3">SLUG</th>
                  <th className="pb-3">ALLOCATED PIECES</th>
                  <th className="pb-3">STATUS</th>
                  <th className="pb-3">DATE CREATED</th>
                  <th className="pb-3 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gold/10">
                {collections.map((col) => (
                  <tr key={col.id} className="hover:bg-cream/40 transition-colors">
                    <td className="py-3">
                      <div className="w-14 h-10 bg-cream border border-gold/30 overflow-hidden flex items-center justify-center">
                        {col.heroImage ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={col.heroImage} alt={col.name} className="w-full h-full object-cover" />
                        ) : (
                          <Layers className="w-4 h-4 text-gold/50" />
                        )}
                      </div>
                    </td>
                    <td className="py-3 font-serif font-bold text-gold">{col.name}</td>
                    <td className="py-3 text-[10px] text-gold/70">/collection/{col.slug}</td>
                    <td className="py-3">
                      <span className="border border-gold px-2 py-0.5 bg-cream text-[9px] text-gold font-bold">
                        {col.products.length} PIECES
                      </span>
                    </td>
                    <td className="py-3">
                      <span className="border border-gold px-2 py-0.5 bg-white text-[9px] text-gold">
                        {col.isPublished ? "PUBLISHED" : "DRAFT"}
                      </span>
                    </td>
                    <td className="py-3 text-[10px] text-gold/70">
                      {new Date(col.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/collection/${col.slug}`}
                          target="_blank"
                          className="p-1 border border-gold/30 hover:bg-gold hover:text-white transition-colors text-gold"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                        <Link
                          href={`/admin/collections/${col.id}`}
                          className="px-2.5 py-1 border border-gold text-[10px] hover:bg-gold hover:text-white transition-colors text-gold font-medium"
                        >
                          EDIT & PRODUCTS
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 px-4 text-center max-w-lg mx-auto bg-cream border border-gold/30">
            <Sparkles className="w-8 h-8 text-gold mx-auto mb-4" />
            <h2 className="font-serif text-2xl text-gold uppercase tracking-luxury font-normal">
              ZERO COLLECTIONS RECORDED
            </h2>
            <p className="mt-3 text-xs uppercase tracking-luxury text-gold/80 leading-relaxed font-light">
              MAHALEELA launches with zero fake collections. Create authentic seasonal archives and allocate pieces below.
            </p>
            <div className="mt-8">
              <Link
                href="/admin/collections/new"
                className="px-8 py-3.5 border border-gold bg-gold text-white text-xs uppercase tracking-luxury hover:bg-white hover:text-gold transition-colors font-medium inline-block"
              >
                FORGE FIRST COLLECTION
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

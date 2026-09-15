import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Plus, Package, Edit, Trash2, Eye, EyeOff, Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: {
      category: true,
      images: { orderBy: { orderIndex: "asc" } },
      variants: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="border border-gold/30 bg-cream p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-ultra text-gold/70 font-serif block mb-1">
            CATALOGUE ARCHIVE
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl text-gold uppercase tracking-luxury font-normal">
            PRODUCTS DIRECTORY ({products.length})
          </h1>
          <p className="text-xs uppercase tracking-luxury text-gold/80 mt-1">
            MANAGE PIECES, TAILORING VARIANTS, PRICING & INVENTORY
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="px-6 py-3 border border-gold bg-gold text-white text-xs uppercase tracking-luxury hover:bg-white hover:text-gold transition-colors font-medium flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>CREATE PRODUCT</span>
        </Link>
      </div>

      {/* Products Table or Zero State */}
      <div className="border border-gold/30 bg-white p-6 shadow-sm">
        {products.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs uppercase tracking-luxury">
              <thead>
                <tr className="border-b border-gold/20 text-[10px] text-gold/70">
                  <th className="pb-3">IMAGE</th>
                  <th className="pb-3">NAME & SKU</th>
                  <th className="pb-3">DEPARTMENT</th>
                  <th className="pb-3">PRICE & MRP</th>
                  <th className="pb-3">STOCK</th>
                  <th className="pb-3">BADGE</th>
                  <th className="pb-3">STATUS</th>
                  <th className="pb-3 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gold/10">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-cream/40 transition-colors">
                    <td className="py-3">
                      <div className="w-12 h-14 bg-cream border border-gold/30 overflow-hidden flex items-center justify-center">
                        {p.images[0] ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={p.images[0].url} alt={p.name} className="w-full h-full object-cover" />
                        ) : (
                          <Package className="w-4 h-4 text-gold/50" />
                        )}
                      </div>
                    </td>
                    <td className="py-3">
                      <p className="font-serif font-bold text-gold">{p.name}</p>
                      <p className="text-[10px] text-gold/60">{p.sku || "NO SKU"}</p>
                    </td>
                    <td className="py-3 text-gold/80">{p.category?.name}</td>
                    <td className="py-3 font-serif">
                      <span className="font-bold text-gold">?{p.price.toLocaleString("en-IN")}</span>
                      {p.mrp > p.price && (
                        <span className="ml-1 text-gold/50 line-through text-[10px]">
                          ?{p.mrp.toLocaleString("en-IN")}
                        </span>
                      )}
                    </td>
                    <td className="py-3">
                      <span className={`font-semibold ${p.stock <= 5 ? "text-gold underline" : "text-gold"}`}>
                        {p.stock} UNITS
                      </span>
                    </td>
                    <td className="py-3">
                      {p.badge ? (
                        <span className="border border-gold px-2 py-0.5 bg-cream text-[9px] text-gold">
                          {p.badge}
                        </span>
                      ) : (
                        <span className="text-[10px] text-gold/40">�</span>
                      )}
                    </td>
                    <td className="py-3">
                      <span className="border border-gold px-2 py-0.5 bg-white text-[9px] text-gold">
                        {p.isPublished ? "PUBLISHED" : "DRAFT"}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/product/${p.slug}`}
                          target="_blank"
                          className="p-1 border border-gold/30 hover:bg-gold hover:text-white transition-colors text-gold"
                          title="View on Storefront"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Link>
                        <Link
                          href={`/admin/products/${p.id}`}
                          className="px-2.5 py-1 border border-gold text-[10px] hover:bg-gold hover:text-white transition-colors text-gold font-medium"
                        >
                          EDIT
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          /* Graceful Luxury Empty State � Zero Fake Products */
          <div className="py-16 px-4 text-center max-w-lg mx-auto bg-cream border border-gold/30">
            <Sparkles className="w-8 h-8 text-gold mx-auto mb-4" />
            <h2 className="font-serif text-2xl text-gold uppercase tracking-luxury font-normal">
              INITIAL CATALOGUE IS EMPTY
            </h2>
            <p className="mt-3 text-xs uppercase tracking-luxury text-gold/80 leading-relaxed font-light">
              MAHALEELA contains strictly zero fake products. Ready for real pieces to be introduced through the atelier creation form.
            </p>
            <div className="mt-8">
              <Link
                href="/admin/products/new"
                className="px-8 py-3.5 border border-gold bg-gold text-white text-xs uppercase tracking-luxury hover:bg-white hover:text-gold transition-colors font-medium inline-block"
              >
                CREATE FIRST PRODUCT
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

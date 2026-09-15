import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ArrowRight, Sparkles } from "lucide-react";
import { PREDEFINED_CATEGORIES } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function CollectionsPage() {
  const collections = await prisma.collection.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: "desc" },
    include: {
      products: {
        include: {
          product: true,
        },
      },
    },
  });

  return (
    <div className="bg-white min-h-screen pb-24">
      {/* Header Banner */}
      <div className="bg-cream border-b border-gold/30 py-16 sm:py-24 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-2 text-[10px] tracking-ultra uppercase text-gold/70 mb-4">
            <Link href="/" className="hover:text-gold">
              HOME
            </Link>
            <span>/</span>
            <span className="text-gold font-semibold">COLLECTIONS & DEPARTMENTS</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl text-gold uppercase tracking-luxury font-normal">
            THE ARCHIVAL REGISTRY
          </h1>

          <p className="mt-4 text-xs sm:text-sm uppercase tracking-luxury text-gold/80 max-w-xl mx-auto font-light leading-relaxed">
            EXPLORE CURATED COLLECTIONS AND PERMANENT HAUTE COUTURE DEPARTMENTS CRAFTED BY THE MAHALEELA ATELIER.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 space-y-16">
        {/* Section 1: Curated Collections (From Database) */}
        <div>
          <div className="border-b border-gold/20 pb-4 mb-8 flex items-center justify-between">
            <h2 className="font-serif text-2xl sm:text-3xl text-gold uppercase tracking-luxury">
              CURATED EDITIONS
            </h2>
            <span className="text-xs uppercase tracking-luxury text-gold/70">
              {collections.length} COLLECTIONS
            </span>
          </div>

          {collections.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {collections.map((col) => (
                <Link
                  key={col.id}
                  href={`/collection/${col.slug}`}
                  className="group border border-gold/30 bg-cream p-8 flex flex-col justify-between hover:bg-white hover:border-gold transition-all duration-300 min-h-[260px]"
                >
                  <div>
                    <span className="text-[10px] uppercase tracking-ultra text-gold/60 font-serif">
                      {col.products.length} PIECES
                    </span>
                    <h3 className="font-serif text-2xl text-gold uppercase tracking-wider mt-2 group-hover:translate-x-1 transition-transform">
                      {col.name}
                    </h3>
                    {col.description && (
                      <p className="mt-3 text-xs uppercase tracking-luxury text-gold/70 line-clamp-3 font-light">
                        {col.description}
                      </p>
                    )}
                  </div>

                  <div className="mt-6 pt-4 border-t border-gold/20 flex items-center justify-between text-xs uppercase tracking-luxury text-gold">
                    <span>EXPLORE COLLECTION</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="border border-gold/30 bg-cream p-10 text-center max-w-xl mx-auto">
              <Sparkles className="w-6 h-6 text-gold mx-auto mb-3" />
              <h3 className="font-serif text-lg text-gold uppercase tracking-luxury">
                NEW COLLECTIONS IN CURATION
              </h3>
              <p className="mt-2 text-xs uppercase tracking-luxury text-gold/80 font-light">
                Our bespoke editorial collections are being curated. Explore our 11 permanent departments below.
              </p>
            </div>
          )}
        </div>

        {/* Section 2: Permanent Departments (The 11 Categories) */}
        <div>
          <div className="border-b border-gold/20 pb-4 mb-8 flex items-center justify-between">
            <h2 className="font-serif text-2xl sm:text-3xl text-gold uppercase tracking-luxury">
              PERMANENT DEPARTMENTS
            </h2>
            <span className="text-xs uppercase tracking-luxury text-gold/70">
              11 CATEGORIES
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PREDEFINED_CATEGORIES.map((cat, idx) => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className="group border border-gold/20 bg-white p-6 flex items-center justify-between hover:border-gold hover:bg-cream transition-all duration-300"
              >
                <div>
                  <span className="text-[9px] uppercase tracking-ultra text-gold/50 font-serif">
                    DEPT {String(idx + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-serif text-lg text-gold uppercase tracking-wider mt-1 group-hover:underline underline-offset-4">
                    {cat.name}
                  </h3>
                </div>
                <div className="w-8 h-8 border border-gold/30 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-white transition-colors">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/product/ProductCard";
import { ArrowLeft, Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

interface CollectionPageProps {
  params: {
    slug: string;
  };
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { slug } = params;

  const collection = await prisma.collection.findUnique({
    where: { slug },
    include: {
      products: {
        orderBy: { sortOrder: "asc" },
        include: {
          product: {
            include: {
              category: { select: { name: true, slug: true } },
              images: { orderBy: { orderIndex: "asc" } },
            },
          },
        },
      },
    },
  });

  if (!collection) {
    notFound();
  }

  const products = collection.products
    .map((cp) => cp.product)
    .filter((p) => p.isPublished && !p.isArchived);

  return (
    <div className="bg-white min-h-screen pb-24">
      {/* Editorial Header */}
      <div className="bg-cream border-b border-gold/30 py-16 sm:py-24 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="flex items-center justify-center gap-2 text-[10px] tracking-ultra uppercase text-gold/70 mb-4">
            <Link href="/" className="hover:text-gold">
              HOME
            </Link>
            <span>/</span>
            <Link href="/collections" className="hover:text-gold">
              COLLECTIONS
            </Link>
            <span>/</span>
            <span className="text-gold font-semibold">{collection.name}</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl text-gold uppercase tracking-luxury font-normal">
            {collection.name}
          </h1>

          {collection.description && (
            <p className="mt-4 text-xs sm:text-sm uppercase tracking-luxury text-gold/80 max-w-xl mx-auto font-light leading-relaxed">
              {collection.description}
            </p>
          )}

          <div className="mt-6 flex items-center justify-center gap-6 text-[10px] tracking-ultra uppercase text-gold/70">
            <span>{products.length} ARCHIVAL PIECES</span>
            <span>•</span>
            <span>LIMITED EDITION</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="mb-8">
          <Link
            href="/collections"
            className="text-xs uppercase tracking-luxury text-gold hover:opacity-75 inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>ALL COLLECTIONS</span>
          </Link>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="border border-gold/30 bg-cream p-12 sm:p-20 text-center flex flex-col items-center justify-center max-w-2xl mx-auto my-8">
            <div className="w-14 h-14 border border-gold flex items-center justify-center mb-6 bg-white">
              <Sparkles className="w-6 h-6 text-gold" />
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl text-gold uppercase tracking-luxury font-normal">
              CURATION IN PROGRESS
            </h2>
            <p className="mt-4 text-xs uppercase tracking-luxury text-gold/80 font-light leading-relaxed max-w-md">
              Pieces for this collection are currently being prepared for release. Return shortly to explore the newly catalogued editions.
            </p>
            <Link
              href="/collections"
              className="mt-8 px-6 py-3 border border-gold bg-gold text-white text-xs uppercase tracking-luxury hover:bg-white hover:text-gold transition-colors font-medium"
            >
              EXPLORE OTHER COLLECTIONS
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

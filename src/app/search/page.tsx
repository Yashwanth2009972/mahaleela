import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/product/ProductCard";
import { Search, Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

interface SearchPageProps {
  searchParams: {
    q?: string;
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q?.trim() || "";

  let products: any[] = [];
  if (query) {
    products = await prisma.product.findMany({
      where: {
        isPublished: true,
        isArchived: false,
        OR: [
          { name: { contains: query } },
          { description: { contains: query } },
          { sku: { contains: query } },
          { category: { name: { contains: query } } },
        ],
      },
      include: {
        category: { select: { name: true, slug: true } },
        images: { orderBy: { orderIndex: "asc" } },
      },
    });
  }

  return (
    <div className="bg-white min-h-screen pb-24">
      {/* Search Header */}
      <div className="bg-cream border-b border-gold/30 py-16 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-2xl mx-auto">
          <span className="text-[10px] tracking-ultra uppercase text-gold/70 font-serif block mb-2">
            ARCHIVAL SEARCH
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl text-gold uppercase tracking-luxury font-normal">
            SEARCH THE CATALOGUE
          </h1>

          {/* Search Input Form */}
          <form action="/search" method="GET" className="mt-8 flex gap-2 max-w-xl mx-auto">
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="SEARCH BY NAME, CATEGORY, OR SKU..."
              className="flex-1 px-4 py-3 bg-white border border-gold text-xs uppercase tracking-wider text-gold placeholder-gold/50 focus:outline-none"
            />
            <button
              type="submit"
              className="px-6 py-3 border border-gold bg-gold text-white text-xs uppercase tracking-luxury hover:bg-white hover:text-gold transition-colors font-medium"
            >
              SEARCH
            </button>
          </form>

          {query && (
            <p className="mt-4 text-xs uppercase tracking-luxury text-gold/80">
              {products.length} {products.length === 1 ? "RESULT" : "RESULTS"} FOR "{query}"
            </p>
          )}
        </div>
      </div>

      {/* Results Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="border border-gold/30 bg-cream p-12 sm:p-20 text-center flex flex-col items-center justify-center max-w-2xl mx-auto">
            <div className="w-12 h-12 border border-gold flex items-center justify-center mb-4 bg-white">
              <Search className="w-5 h-5 text-gold" />
            </div>
            <h3 className="font-serif text-2xl text-gold uppercase tracking-luxury font-normal">
              {query ? "NO MATCHING EDITIONS FOUND" : "BEGIN YOUR ARCHIVAL SEARCH"}
            </h3>
            <p className="mt-3 text-xs uppercase tracking-luxury text-gold/80 font-light leading-relaxed max-w-md">
              {query
                ? `No items in our atelier database match "${query}". Try searching for categories like "SHIRTS", "WATCHES", or "WALLETS".`
                : "Enter keywords, categories, or archive references above to locate garments and accessories."}
            </p>
            <div className="mt-8 flex gap-4">
              <Link
                href="/#catalogue"
                className="px-6 py-2.5 border border-gold bg-gold text-white text-xs uppercase tracking-luxury hover:bg-white hover:text-gold transition-colors font-medium"
              >
                BROWSE CATALOGUE
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

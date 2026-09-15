import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/product/ProductCard";
import { ArrowLeft, Sparkles, Filter } from "lucide-react";

export const dynamic = "force-dynamic";

interface CategoryPageProps {
  params: {
    slug: string;
  };
  searchParams?: {
    sort?: string;
  };
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = params;

  // Fetch category
  const category = await prisma.category.findUnique({
    where: { slug },
  });

  if (!category) {
    notFound();
  }

  // Determine sort order
  let orderBy: any = { createdAt: "desc" };
  if (searchParams?.sort === "price-low") orderBy = { price: "asc" };
  if (searchParams?.sort === "price-high") orderBy = { price: "desc" };

  // Fetch products in this category
  const products = await prisma.product.findMany({
    where: {
      categoryId: category.id,
      isPublished: true,
      isArchived: false,
    },
    orderBy,
    include: {
      category: { select: { name: true, slug: true } },
      images: { orderBy: { orderIndex: "asc" } },
    },
  });

  return (
    <div className="bg-white min-h-screen pb-24">
      {/* Category Header Banner */}
      <div className="bg-cream border-b border-gold/30 py-16 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          {/* Breadcrumb */}
          <div className="flex items-center justify-center gap-2 text-[10px] tracking-ultra uppercase text-gold/70 mb-4">
            <Link href="/" className="hover:text-gold">
              HOME
            </Link>
            <span>/</span>
            <Link href="/#catalogue" className="hover:text-gold">
              DEPARTMENTS
            </Link>
            <span>/</span>
            <span className="text-gold font-semibold">{category.name}</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl text-gold uppercase tracking-luxury font-normal">
            {category.name}
          </h1>

          {category.description && (
            <p className="mt-4 text-xs sm:text-sm uppercase tracking-luxury text-gold/80 max-w-xl mx-auto font-light leading-relaxed">
              {category.description}
            </p>
          )}

          <div className="mt-6 flex items-center justify-center gap-6 text-[10px] tracking-ultra uppercase text-gold/70">
            <span>{products.length} AVAILABLE EDITIONS</span>
            <span>•</span>
            <span>ATELIER DISPATCH</span>
          </div>
        </div>
      </div>

      {/* Product List and Sorting Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-gold/20 pb-4 mb-8">
          <Link
            href="/#catalogue"
            className="text-xs uppercase tracking-luxury text-gold hover:opacity-75 inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>ALL DEPARTMENTS</span>
          </Link>

          {/* Sort Dropdown Links */}
          <div className="flex items-center gap-4 text-xs uppercase tracking-luxury text-gold">
            <span className="text-gold/60 hidden sm:inline">SORT:</span>
            <Link
              href={`/category/${slug}`}
              className={`hover:underline underline-offset-4 ${!searchParams?.sort ? "font-bold text-gold" : "text-gold/70"}`}
            >
              NEWEST
            </Link>
            <span>•</span>
            <Link
              href={`/category/${slug}?sort=price-low`}
              className={`hover:underline underline-offset-4 ${searchParams?.sort === "price-low" ? "font-bold text-gold" : "text-gold/70"}`}
            >
              PRICE: LOW TO HIGH
            </Link>
            <span>•</span>
            <Link
              href={`/category/${slug}?sort=price-high`}
              className={`hover:underline underline-offset-4 ${searchParams?.sort === "price-high" ? "font-bold text-gold" : "text-gold/70"}`}
            >
              PRICE: HIGH TO LOW
            </Link>
          </div>
        </div>

        {/* Product Grid or Graceful Empty State */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          /* Intentional Luxury Empty State — Zero Demo Products */
          <div className="border border-gold/30 bg-cream p-12 sm:p-20 text-center flex flex-col items-center justify-center max-w-2xl mx-auto my-8">
            <div className="w-14 h-14 border border-gold flex items-center justify-center mb-6 bg-white">
              <Sparkles className="w-6 h-6 text-gold" />
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl text-gold uppercase tracking-luxury font-normal">
              EDITIONS IN THE ATELIER
            </h2>
            <p className="mt-4 text-xs uppercase tracking-luxury text-gold/80 font-light leading-relaxed max-w-md">
              Pieces for {category.name} are currently undergoing meticulous tailoring and quality certification. Join our salon dispatch to be notified upon first release.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link
                href="/exclusive/join"
                className="px-6 py-3 border border-gold bg-gold text-white text-xs uppercase tracking-luxury hover:bg-white hover:text-gold transition-colors font-medium"
              >
                REQUEST EARLY ACCESS
              </Link>
              <Link
                href="/"
                className="px-6 py-3 border border-gold bg-white text-gold text-xs uppercase tracking-luxury hover:bg-cream transition-colors font-medium"
              >
                RETURN HOME
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

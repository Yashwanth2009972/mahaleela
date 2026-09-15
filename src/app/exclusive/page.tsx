import { prisma } from "@/lib/prisma";
import { StorefrontCatalogue } from "@/components/home/StorefrontCatalogue";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ExclusivePage() {
  const categories = await prisma.category.findMany({
    where: { isPublished: true },
    orderBy: { orderIndex: "asc" },
  });

  const products = await prisma.product.findMany({
    where: { isPublished: true, isArchived: false },
    orderBy: { createdAt: "desc" },
    include: {
      category: { select: { id: true, name: true, slug: true } },
      images: { orderBy: { orderIndex: "asc" } },
      variants: true,
    },
  });

  const coupons = await prisma.coupon.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="w-full bg-black min-h-screen pt-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2 text-center">
        <span className="text-[10px] uppercase tracking-ultra text-gold font-serif block">
          THE EXCLUSIVE SALON
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-gold uppercase tracking-luxury font-normal">
          EXCLUSIVE ALLOCATIONS
        </h1>
      </div>

      {/* Categories horizontal scroll above + products catalogue below */}
      <StorefrontCatalogue initialProducts={products} categories={categories} coupons={coupons} />
    </main>
  );
}

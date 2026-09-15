import { prisma } from "@/lib/prisma";
import { HeroBanner } from "@/components/home/HeroBanner";
import { StorefrontCatalogue } from "@/components/home/StorefrontCatalogue";
import { PhotoGallerySection } from "@/components/home/PhotoGallerySection";
import { SocialSection } from "@/components/home/SocialSection";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomePage() {
  // 1. Fetch active hero banner (highest priority)
  const activeBanner = await prisma.banner.findFirst({
    where: { isActive: true },
    orderBy: { priority: "desc" },
  });

  // 2. Fetch categories (all 12 predefined)
  const categories = await prisma.category.findMany({
    where: { isPublished: true },
    orderBy: { orderIndex: "asc" },
  });

  // 3. Fetch catalogue products
  const products = await prisma.product.findMany({
    where: { isPublished: true, isArchived: false },
    orderBy: { createdAt: "desc" },
    include: {
      category: { select: { id: true, name: true, slug: true } },
      images: { orderBy: { orderIndex: "asc" } },
      variants: true,
    },
  });

  // 4. Fetch active coupons for catalogue bar
  const coupons = await prisma.coupon.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
  });

  // 5. Fetch 9:16 gallery items
  const galleryItems = await prisma.galleryItem.findMany({
    where: { isActive: true },
    orderBy: { orderIndex: "asc" },
  });

  return (
    <main className="w-full bg-black min-h-screen">
      {/* 1. Hero Banner: Separate 21:9 Desktop & 9:16 Mobile */}
      <HeroBanner banner={activeBanner} />

      {/* 2. Horizontal Scroll Category Bar + 2-Row Vertical Product Grid with Automatic RED Discount & Circle Colors */}
      <StorefrontCatalogue initialProducts={products} categories={categories} coupons={coupons} />

      {/* 3. 9:16 Photo Gallery below products */}
      <PhotoGallerySection items={galleryItems} />

      {/* 4. THE MAHALEELA SOCIETY — SOCIAL VISIBLE ON STOREFRONT below Photo Gallery */}
      <SocialSection />
    </main>
  );
}

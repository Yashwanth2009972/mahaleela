import { prisma } from "@/lib/prisma";
import { HeroBanner } from "@/components/home/HeroBanner";
import { StorefrontCatalogue } from "@/components/home/StorefrontCatalogue";
import { PhotoGallerySection } from "@/components/home/PhotoGallerySection";
import { SocialSection } from "@/components/home/SocialSection";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomePage() {
  let activeBanner = null;
  let categories: any[] = [];
  let products: any[] = [];
  let coupons: any[] = [];
  let galleryItems: any[] = [];

  try {
    const [bannerRes, catRes, prodRes, coupRes, gallRes] = await Promise.all([
      prisma.banner.findFirst({
        where: { isActive: true },
        orderBy: { priority: "desc" },
      }).catch(() => null),
      prisma.category.findMany({
        where: { isPublished: true },
        orderBy: { orderIndex: "asc" },
      }).catch(() => []),
      prisma.product.findMany({
        where: { isPublished: true, isArchived: false },
        orderBy: { createdAt: "desc" },
        include: {
          category: { select: { id: true, name: true, slug: true } },
          images: { orderBy: { orderIndex: "asc" } },
          variants: true,
        },
      }).catch(() => []),
      prisma.coupon.findMany({
        where: { isActive: true },
        orderBy: { createdAt: "desc" },
      }).catch(() => []),
      prisma.galleryItem.findMany({
        where: { isActive: true },
        orderBy: { orderIndex: "asc" },
      }).catch(() => []),
    ]);

    activeBanner = bannerRes;
    categories = catRes || [];
    products = prodRes || [];
    coupons = coupRes || [];
    galleryItems = gallRes || [];
  } catch (err) {
    console.error("Database query fallback on HomePage:", err);
  }

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

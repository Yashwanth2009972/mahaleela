import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductDetailClient } from "@/components/product/ProductDetailClient";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    select: { name: true, description: true, seoTitle: true, seoDescription: true },
  });

  if (!product) return { title: "Product Not Found | MAHALEELA" };

  return {
    title: product.seoTitle || `${product.name} | MAHALEELA Haute Couture`,
    description: product.seoDescription || product.description || "MAHALEELA luxury edition.",
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = params;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: { select: { name: true, slug: true } },
      images: { orderBy: { orderIndex: "asc" } },
      variants: {
        where: { isAvailable: true },
        orderBy: { size: "asc" },
      },
    },
  });

  if (!product || !product.isPublished || product.isArchived) {
    notFound();
  }

  return (
    <div className="bg-white min-h-screen">
      <ProductDetailClient product={product} />
    </div>
  );
}

import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ArrowLeft, Trash2, ExternalLink } from "lucide-react";
import { ProductEditForm } from "./ProductEditForm";

export const dynamic = "force-dynamic";

export default async function ProductEditPage({
  params,
}: {
  params: { id: string };
}) {
  const [product, categories, collections] = await Promise.all([
    prisma.product.findUnique({
      where: { id: params.id },
      include: {
        images: { orderBy: { orderIndex: "asc" } },
        variants: true,
        collections: true,
      },
    }),
    prisma.category.findMany({ orderBy: { orderIndex: "asc" } }),
    prisma.collection.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between border-b border-gold/20 pb-4">
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-luxury text-gold hover:underline underline-offset-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>RETURN TO CATALOGUE</span>
        </Link>
        <Link
          href={`/product/${product.slug}`}
          target="_blank"
          className="inline-flex items-center gap-1.5 text-xs uppercase tracking-luxury text-gold underline underline-offset-4"
        >
          <span>VIEW ON STOREFRONT</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="border border-gold/30 bg-cream p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-ultra text-gold/70 font-serif block mb-1">
            PIECE DOSSIER
          </span>
          <h1 className="font-serif text-2xl text-gold uppercase tracking-luxury font-normal">
            EDIT: {product.name}
          </h1>
          <p className="text-xs uppercase tracking-luxury text-gold/80 mt-1">
            SKU: {product.sku || "UNASSIGNED"} � CREATED: {new Date(product.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      <ProductEditForm product={product} categories={categories} collections={collections} />
    </div>
  );
}

import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { CollectionEditForm } from "./CollectionEditForm";

export const dynamic = "force-dynamic";

export default async function CollectionDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [collection, allProducts] = await Promise.all([
    prisma.collection.findUnique({
      where: { id: params.id },
      include: {
        products: {
          include: { product: { include: { images: true } } },
          orderBy: { sortOrder: "asc" },
        },
      },
    }),
    prisma.product.findMany({
      where: { isArchived: false },
      include: { images: true },
    }),
  ]);

  if (!collection) notFound();

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between border-b border-gold/20 pb-4">
        <Link
          href="/admin/collections"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-luxury text-gold hover:underline underline-offset-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>RETURN TO COLLECTIONS</span>
        </Link>
        <Link
          href={`/collection/${collection.slug}`}
          target="_blank"
          className="inline-flex items-center gap-1.5 text-xs uppercase tracking-luxury text-gold underline underline-offset-4"
        >
          <span>VIEW STOREFRONT</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="border border-gold/30 bg-cream p-6 sm:p-8">
        <h1 className="font-serif text-2xl text-gold uppercase tracking-luxury font-normal">
          EDIT: {collection.name}
        </h1>
        <p className="text-xs uppercase tracking-luxury text-gold/80 mt-1">
          /collection/{collection.slug} � {collection.products.length} ALLOCATED PIECES
        </p>
      </div>

      <CollectionEditForm collection={collection} allProducts={allProducts} />
    </div>
  );
}

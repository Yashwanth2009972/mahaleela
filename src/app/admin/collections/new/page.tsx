import { prisma } from "@/lib/prisma";
import { NewCollectionClient } from "./NewCollectionClient";

export const dynamic = "force-dynamic";

export default async function NewCollectionPage() {
  const products = await prisma.product.findMany({
    where: { isArchived: false },
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, sku: true, price: true },
  });

  return (
    <div className="space-y-6">
      <div className="border border-gold/30 bg-cream p-6 sm:p-8">
        <span className="text-[10px] tracking-ultra uppercase text-gold/70 font-serif block mb-1">
          ARCHIVAL CURATION
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl text-gold uppercase tracking-luxury font-normal">
          CREATE NEW COLLECTION
        </h1>
        <p className="text-xs uppercase tracking-luxury text-gold/80 mt-1 font-light">
          CRAFT A DEDICATED EDITORIAL COLLECTION AND LINK PRODUCTS.
        </p>
      </div>

      <NewCollectionClient products={products} />
    </div>
  );
}

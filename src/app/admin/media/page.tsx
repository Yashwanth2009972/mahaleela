import { prisma } from "@/lib/prisma";
import { MediaLibraryClient } from "./MediaLibraryClient";

export const dynamic = "force-dynamic";

export default async function AdminMediaPage() {
  const media = await prisma.media.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="border border-gold/30 bg-cream p-6 sm:p-8">
        <span className="text-[10px] tracking-ultra uppercase text-gold/70 font-serif block mb-1">
          ASSET MANAGEMENT
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl text-gold uppercase tracking-luxury font-normal">
          CENTRALIZED MEDIA LIBRARY
        </h1>
        <p className="text-xs uppercase tracking-luxury text-gold/80 mt-1 font-light">
          UPLOAD, PREVIEW, COPY ASSET URLS, AND MANAGE LUXURY PHOTOGRAPHY FOR ALL PRODUCTS & COLLECTIONS.
        </p>
      </div>

      <MediaLibraryClient initialMedia={media} />
    </div>
  );
}

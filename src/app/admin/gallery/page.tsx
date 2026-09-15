import { prisma } from "@/lib/prisma";
import { GalleryManagerClient } from "@/components/admin/GalleryManagerClient";

export const dynamic = "force-dynamic";

export default async function AdminGalleryPage() {
  const items = await prisma.galleryItem.findMany({
    orderBy: { orderIndex: "asc" },
  });

  return <GalleryManagerClient initialItems={items} />;
}

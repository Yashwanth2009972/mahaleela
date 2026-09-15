import { prisma } from "@/lib/prisma";
import { BannersManagerClient } from "@/components/admin/BannersManagerClient";

export const dynamic = "force-dynamic";

export default async function AdminBannersPage() {
  const banners = await prisma.banner.findMany({
    orderBy: { priority: "desc" },
  });

  return <BannersManagerClient initialBanners={banners} />;
}

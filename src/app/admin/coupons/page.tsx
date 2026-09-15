import { prisma } from "@/lib/prisma";
import { CouponsManagerClient } from "@/components/admin/CouponsManagerClient";

export const dynamic = "force-dynamic";

export default async function AdminCouponsPage() {
  const coupons = await prisma.coupon.findMany({
    orderBy: { createdAt: "desc" },
  });

  return <CouponsManagerClient initialCoupons={coupons} />;
}

import React from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ShippingLabel } from "@/components/admin/ShippingLabel";

export const dynamic = "force-dynamic";

export default async function AdminShippingLabelPage({
  params,
}: {
  params: { id: string };
}) {
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: { items: true },
  });

  if (!order) notFound();

  return <ShippingLabel order={order} />;
}

import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ORDER_STATUSES } from "@/lib/constants";
import { ArrowLeft } from "lucide-react";
import { OrderStatusUpdateForm } from "./OrderStatusUpdateForm";

export const dynamic = "force-dynamic";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: { items: true, user: true },
  });

  if (!order) notFound();

  let addressObj: any = {};
  try {
    addressObj = JSON.parse(order.shippingAddress);
  } catch {
    addressObj = { addressLine1: order.shippingAddress };
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between border-b border-gold/20 pb-4">
        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-luxury text-gold hover:underline underline-offset-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>RETURN TO ORDERS</span>
        </Link>
        <span className="font-serif text-sm uppercase tracking-luxury text-gold font-semibold">
          ORDER AUDIT TRAIL
        </span>
      </div>

      <div className="border border-gold/30 bg-cream p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-ultra text-gold/70 font-serif block mb-1">
            DOSSIER
          </span>
          <h1 className="font-serif text-2xl text-gold uppercase tracking-luxury font-normal">
            ORDER: {order.orderNumber}
          </h1>
          <p className="text-xs uppercase tracking-luxury text-gold/80 mt-1">
            CLIENT: {order.customerName} ({order.email})
          </p>
        </div>

        <div className="text-right sm:border-l sm:border-gold/20 sm:pl-6">
          <span className="text-[9px] uppercase tracking-ultra text-gold/70 block">TOTAL PAYABLE</span>
          <span className="font-serif text-xl font-bold text-gold">?{order.total.toLocaleString("en-IN")}</span>
        </div>
      </div>

      {/* Status Update Control Component */}
      <OrderStatusUpdateForm order={order} addressObj={addressObj} />
    </div>
  );
}

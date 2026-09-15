import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ORDER_STATUSES, BRAND } from "@/lib/constants";
import { Check, Clock, Truck, ArrowLeft, ShieldCheck, MapPin } from "lucide-react";

export const dynamic = "force-dynamic";

interface OrderPageProps {
  params: {
    id: string; // can be orderNumber or ID
  };
}

export default async function OrderDetailPage({ params }: OrderPageProps) {
  const { id } = params;

  const order = await prisma.order.findFirst({
    where: {
      OR: [{ orderNumber: id }, { id: id }],
    },
    include: {
      items: true,
    },
  });

  if (!order) {
    notFound();
  }

  let address: any = {};
  try {
    address = JSON.parse(order.shippingAddress);
  } catch {
    address = { street: order.shippingAddress };
  }

  // Calculate timeline milestone index
  const standardMilestones = [
    "ORDER RECEIVED",
    "CONFIRMED",
    "PACKED",
    "SHIPPED",
    "OUT FOR DELIVERY",
    "DELIVERED",
  ];

  const currentStatusIndex = standardMilestones.indexOf(order.orderStatus);
  const isSpecialStatus = ["CANCELLED", "RETURN REQUESTED", "RETURNED"].includes(
    order.orderStatus
  );

  return (
    <div className="bg-white min-h-screen pb-24">
      {/* Header Banner */}
      <div className="bg-cream border-b border-gold/30 py-16 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto">
          <span className="text-[10px] tracking-ultra uppercase text-gold/70 font-serif block mb-2">
            ATELIER LOGISTICS
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl text-gold uppercase tracking-luxury font-normal">
            ORDER {order.orderNumber}
          </h1>
          <p className="mt-3 text-xs uppercase tracking-luxury text-gold/80 font-light">
            STATUS: <span className="font-semibold">{order.orderStatus}</span> • PAYMENT: {order.paymentStatus} ({order.paymentMethod})
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="mb-8">
          <Link
            href="/orders"
            className="text-xs uppercase tracking-luxury text-gold hover:opacity-75 inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>BACK TO ORDER REGISTRY</span>
          </Link>
        </div>

        {/* 9 Progression Status Timeline */}
        <div className="border border-gold/30 bg-cream p-8 sm:p-10 mb-10">
          <h3 className="font-serif text-lg text-gold uppercase tracking-wider mb-6 font-medium">
            CONSIGNMENT PROGRESSION
          </h3>

          {!isSpecialStatus ? (
            <div className="relative">
              {/* Progress Line */}
              <div className="hidden sm:block absolute top-5 left-6 right-6 h-[1px] bg-gold/30 z-0" />

              <div className="grid grid-cols-2 sm:grid-cols-6 gap-4 relative z-10">
                {standardMilestones.map((ms, idx) => {
                  const isPassed = currentStatusIndex >= idx;
                  const isCurrent = currentStatusIndex === idx;

                  return (
                    <div key={ms} className="flex flex-col items-center text-center">
                      <div
                        className={`w-10 h-10 border flex items-center justify-center transition-all ${
                          isPassed
                            ? "border-gold bg-gold text-white"
                            : "border-gold/30 bg-white text-gold/50"
                        }`}
                      >
                        {isPassed ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <span className="font-serif text-xs">{idx + 1}</span>
                        )}
                      </div>
                      <span
                        className={`text-[9px] uppercase tracking-luxury mt-3 ${
                          isCurrent ? "font-bold text-gold underline underline-offset-4" : "text-gold/70"
                        }`}
                      >
                        {ms}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="p-4 border border-gold bg-white text-center">
              <span className="font-serif text-sm uppercase tracking-wider text-gold font-bold">
                ATTENTION: CONSIGNMENT STATUS IS {order.orderStatus}
              </span>
              <p className="text-xs uppercase tracking-luxury text-gold/70 mt-1">
                For inquiries, please contact our concierge at {BRAND.phone} or concierge@mahaleela.com.
              </p>
            </div>
          )}

          {order.trackingNumber && (
            <div className="mt-8 pt-6 border-t border-gold/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs uppercase tracking-luxury text-gold">
              <div>
                <span className="text-gold/60">WAYBILL TRACKING: </span>
                <span className="font-semibold font-serif">{order.trackingNumber}</span>
              </div>
              {order.trackingUrl && (
                <a
                  href={order.trackingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 border border-gold bg-white text-gold hover:bg-gold hover:text-white transition-colors"
                >
                  TRACK ON COURIER PORTAL
                </a>
              )}
            </div>
          )}
        </div>

        {/* Order Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Order Items */}
          <div className="md:col-span-8 border border-gold/30 bg-white p-6">
            <h3 className="font-serif text-base uppercase tracking-wider text-gold font-medium mb-4 pb-3 border-b border-gold/20">
              ACQUISITIONS ({order.items.length} PIECES)
            </h3>

            <div className="divide-y divide-gold/10">
              {order.items.map((item) => (
                <div key={item.id} className="py-4 flex justify-between items-center text-xs">
                  <div>
                    <h4 className="font-serif uppercase text-gold font-medium text-sm">
                      {item.productName}
                    </h4>
                    {item.variantInfo && (
                      <p className="text-[10px] uppercase tracking-luxury text-gold/70 mt-0.5">
                        {item.variantInfo}
                      </p>
                    )}
                    <p className="text-[10px] uppercase tracking-luxury text-gold/60 mt-0.5">
                      QTY: {item.quantity} • ₹{item.price.toLocaleString("en-IN")} PER PIECE
                    </p>
                  </div>
                  <span className="font-serif font-semibold text-gold text-sm">
                    ₹{item.subtotal.toLocaleString("en-IN")}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-gold/20 pt-4 mt-4 space-y-2 text-xs uppercase tracking-luxury text-gold">
              <div className="flex justify-between">
                <span>SUBTOTAL</span>
                <span className="font-serif">₹{order.subtotal.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between">
                <span>SHIPPING</span>
                <span className="font-serif">
                  {order.shippingFee === 0 ? "AS PER LOCATION" : `₹${order.shippingFee}`}
                </span>
              </div>
              {order.codFee > 0 && (
                <div className="flex justify-between">
                  <span>COD CONVENIENCE FEE</span>
                  <span className="font-serif">₹{order.codFee}</span>
                </div>
              )}
              <div className="flex justify-between font-serif font-bold text-base pt-2 border-t border-gold/20">
                <span>TOTAL CONSIGNMENT VALUE</span>
                <span>₹{order.total.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>

          {/* Shipping & Consignee Information */}
          <div className="md:col-span-4 space-y-6">
            <div className="border border-gold/30 bg-cream p-6 text-xs uppercase tracking-luxury text-gold space-y-3">
              <h4 className="font-serif text-sm font-semibold pb-2 border-b border-gold/20">
                CONSIGNEE DETAILS
              </h4>
              <p className="font-semibold">{order.customerName}</p>
              <p>{order.email}</p>
              <p>{order.phone}</p>
            </div>

            <div className="border border-gold/30 bg-cream p-6 text-xs uppercase tracking-luxury text-gold space-y-3">
              <h4 className="font-serif text-sm font-semibold pb-2 border-b border-gold/20">
                DELIVERY DESTINATION
              </h4>
              <p className="whitespace-pre-line leading-relaxed">
                {address.street}
                {address.landmark ? `\nLandmark: ${address.landmark}` : ""}
                {`\n${address.city}, ${address.state} - ${address.pincode}`}
                {`\nINDIA`}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

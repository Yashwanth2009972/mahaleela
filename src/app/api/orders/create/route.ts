import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      orderType,
      customerName,
      email,
      phone,
      shippingAddress,
      items,
      paymentMethod,
      notes,
    } = body;

    if (!customerName || !phone || !items || items.length === 0) {
      return NextResponse.json({ error: "Missing required order coordinates." }, { status: 400 });
    }

    // Calculate subtotal
    const subtotal = items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
    const codFee = paymentMethod === "CASH_ON_DELIVERY" ? 10 : 0;
    const total = subtotal + codFee;

    // Generate unique order number
    const orderNumber = `MHL-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerName,
        email: email || `${phone}@client.mahaleela.com`,
        phone,
        orderType: orderType || "WEBSITE",
        shippingAddress: typeof shippingAddress === "string" ? shippingAddress : JSON.stringify(shippingAddress),
        subtotal,
        codFee,
        shippingFee: 0, // delivery fee communicated on whatsapp according to location
        total,
        paymentMethod: paymentMethod || "UPI",
        paymentStatus: "PENDING",
        orderStatus: "PENDING_ACCEPTANCE",
        notes: notes || null,
        items: {
          create: items.map((item: any) => ({
            productId: item.productId || null,
            productName: item.name,
            variantInfo: item.color || item.size || null,
            price: item.price,
            quantity: item.quantity,
            imageUrl: item.imageUrl || null,
            subtotal: item.price * item.quantity,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    revalidatePath("/admin/orders");
    return NextResponse.json(order);
  } catch (err: any) {
    console.error("Order creation error:", err);
    return NextResponse.json({ error: err.message || "Failed to lodge order." }, { status: 500 });
  }
}

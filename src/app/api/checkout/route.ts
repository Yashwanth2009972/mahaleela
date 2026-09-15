import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { BRAND } from '@/lib/constants';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      customerName,
      email,
      phone,
      shippingAddress,
      items,
      paymentMethod,
      upiId,
      notes,
    } = body;

    if (!customerName || !email || !phone || !shippingAddress || !items || !items.length) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    if (paymentMethod !== 'UPI' && paymentMethod !== 'CASH_ON_DELIVERY') {
      return NextResponse.json({ error: 'Valid payment methods are UPI or CASH_ON_DELIVERY.' }, { status: 400 });
    }

    let subtotal = 0;
    const orderItemsData = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        include: { images: true },
      });

      const itemPrice = product ? product.price : item.price;
      const itemSubtotal = itemPrice * item.quantity;
      subtotal += itemSubtotal;

      orderItemsData.push({
        productId: product ? product.id : null,
        variantId: item.variantId || null,
        productName: product ? product.name : item.name,
        variantInfo: [item.size, item.color].filter(Boolean).join(' / ') || null,
        price: itemPrice,
        quantity: item.quantity,
        imageUrl: product?.images?.[0]?.url || item.image || '/assets/mahaleela-logo.jpg',
        subtotal: itemSubtotal,
      });
    }

    const shippingFee = 0; // Location-based delivery charges communicated via WhatsApp
    const codFee = paymentMethod === 'CASH_ON_DELIVERY' ? BRAND.shipping.codFee : 0;
    const total = subtotal + codFee;

    const currentUser = await getCurrentUser();
    const orderNumber = 'ML-' + Date.now().toString(36).toUpperCase() + '-' + Math.floor(1000 + Math.random() * 9000);

    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: currentUser?.userId || null,
        customerName,
        email,
        phone,
        shippingAddress: typeof shippingAddress === 'string' ? shippingAddress : JSON.stringify(shippingAddress),
        subtotal,
        shippingFee,
        codFee,
        total,
        paymentMethod,
        paymentStatus: 'PENDING',
        orderStatus: 'ORDER RECEIVED',
        notes: notes || (paymentMethod === 'UPI' && upiId ? 'UPI VPA: ' + upiId : null),
        items: {
          create: orderItemsData,
        },
      },
      include: {
        items: true,
      },
    });

    return NextResponse.json({
      success: true,
      orderNumber: order.orderNumber,
      orderId: order.id,
      total: order.total,
    });
  } catch (error: any) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: 'Failed to process order.' }, { status: 500 });
  }
}

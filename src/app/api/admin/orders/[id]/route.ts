import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: { items: true, user: true },
  });
  if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  return NextResponse.json({ order });
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { orderStatus, paymentStatus, trackingNumber, trackingUrl, notes } = await req.json();
    const updated = await prisma.order.update({
      where: { id: params.id },
      data: {
        orderStatus,
        paymentStatus,
        trackingNumber,
        trackingUrl,
        notes,
      },
    });

    // Record audit log
    await prisma.auditLog.create({
      data: {
        adminId: admin.userId,
        adminEmail: admin.email,
        action: `UPDATE_ORDER_STATUS: ${updated.orderNumber} -> ${orderStatus}`,
        details: JSON.stringify({ orderStatus, paymentStatus, trackingNumber }),
      },
    });

    return NextResponse.json({ success: true, order: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

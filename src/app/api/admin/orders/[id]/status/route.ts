import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { orderStatus, trackingNumber, trackingUrl, paymentStatus } = body;

    const order = await prisma.order.update({
      where: { id: params.id },
      data: {
        ...(orderStatus && { orderStatus }),
        ...(trackingNumber !== undefined && { trackingNumber }),
        ...(trackingUrl !== undefined && { trackingUrl }),
        ...(paymentStatus && { paymentStatus }),
      },
    });

    await prisma.auditLog.create({
      data: {
        adminId: admin.userId,
        adminEmail: admin.email,
        action: "UPDATE_ORDER_STATUS",
        details: `Order ${order.orderNumber} updated to status "${orderStatus || order.orderStatus}"`,
      },
    });

    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

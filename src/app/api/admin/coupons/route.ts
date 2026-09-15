import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

export async function GET() {
  const coupons = await prisma.coupon.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ coupons });
}

export async function POST(req: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { code, discountValue, discountType, minOrder, isActive } = body;

    if (!code || !discountValue) {
      return NextResponse.json({ error: "Coupon code and discount value are required" }, { status: 400 });
    }

    const coupon = await prisma.coupon.create({
      data: {
        code: code.trim().toUpperCase(),
        discountValue: Number(discountValue),
        discountType: discountType || "PERCENTAGE",
        minOrder: Number(minOrder) || 0,
        isActive: isActive !== undefined ? Boolean(isActive) : true,
      },
    });

    revalidatePath("/");
    revalidatePath("/checkout");
    return NextResponse.json({ success: true, coupon });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing coupon ID" }, { status: 400 });

    await prisma.coupon.delete({ where: { id } });
    revalidatePath("/");
    revalidatePath("/checkout");
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

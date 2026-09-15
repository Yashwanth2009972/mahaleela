export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export async function GET() {
  const offers = await prisma.offer.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json({ offers });
}

export async function POST(req: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { title, description, discountType, discountValue, targetType, isActive } = await req.json();
    const offer = await prisma.offer.create({
      data: {
        title,
        description,
        discountType: discountType || 'PERCENTAGE',
        discountValue: Number(discountValue),
        targetType: targetType || 'ALL',
        isActive: isActive !== undefined ? isActive : true,
      },
    });
    return NextResponse.json({ success: true, offer });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

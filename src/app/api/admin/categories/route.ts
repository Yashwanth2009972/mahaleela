export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export async function GET() {
  const categories = await prisma.category.findMany({
    orderBy: { orderIndex: 'asc' },
    include: { _count: { select: { products: true } } },
  });
  return NextResponse.json({ categories });
}

export async function PUT(req: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { id, description, image, isPublished, orderIndex } = await req.json();
    const updated = await prisma.category.update({
      where: { id },
      data: { description, image, isPublished, orderIndex },
    });
    return NextResponse.json({ success: true, category: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

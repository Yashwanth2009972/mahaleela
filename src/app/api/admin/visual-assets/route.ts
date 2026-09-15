export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export async function GET(req: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');

  const whereClause: any = {};
  if (category && category !== 'ALL') {
    whereClause.category = category;
  }

  const [templates, brandAssets] = await Promise.all([
    prisma.visualTemplate.findMany({
      where: whereClause,
      orderBy: { createdAt: 'asc' },
    }),
    prisma.visualAsset.findMany({
      orderBy: { createdAt: 'asc' },
    }),
  ]);

  return NextResponse.json({ templates, brandAssets });
}

export async function POST(req: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { name, category, aspectRatio, styleName, config } = await req.json();

    if (!name || !category) {
      return NextResponse.json({ error: 'Name and category are required' }, { status: 400 });
    }

    const template = await prisma.visualTemplate.create({
      data: {
        name,
        category,
        aspectRatio: aspectRatio || '1:1',
        styleName: styleName || 'CUSTOM',
        config: typeof config === 'string' ? config : JSON.stringify(config),
      },
    });

    return NextResponse.json({ success: true, template });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to create template' }, { status: 500 });
  }
}

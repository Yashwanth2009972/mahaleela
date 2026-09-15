import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const ids = searchParams.get('ids');
    const categorySlug = searchParams.get('category');
    const collectionSlug = searchParams.get('collection');

    const whereClause: any = {
      isPublished: true,
      isArchived: false,
    };

    if (ids) {
      whereClause.id = { in: ids.split(',') };
    }

    if (categorySlug) {
      whereClause.category = { slug: categorySlug };
    }

    if (collectionSlug) {
      whereClause.collections = {
        some: { collection: { slug: collectionSlug } },
      };
    }

    const products = await prisma.product.findMany({
      where: whereClause,
      include: {
        images: { orderBy: { orderIndex: 'asc' } },
        category: { select: { name: true, slug: true } },
        variants: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.error('Fetch products error:', error);
    return NextResponse.json({ error: 'Failed to fetch products.' }, { status: 500 });
  }
}

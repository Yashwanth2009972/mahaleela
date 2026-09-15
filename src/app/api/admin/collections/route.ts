import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const collections = await prisma.collection.findMany({
    include: {
      products: {
        include: { product: { include: { images: true } } },
        orderBy: { sortOrder: 'asc' },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ collections });
}

export async function POST(req: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { name, slug, description, heroImage, mobileHeroImage, bannerImage, seoTitle, seoDescription, isPublished, productIds } = await req.json();

    if (!name) return NextResponse.json({ error: 'Collection name is required.' }, { status: 400 });

    const finalSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const collection = await prisma.collection.create({
      data: {
        name,
        slug: finalSlug,
        description,
        heroImage,
        mobileHeroImage,
        bannerImage,
        seoTitle,
        seoDescription,
        isPublished: isPublished !== undefined ? isPublished : true,
        publishDate: new Date(),
        products: {
          create: (productIds || []).map((pId: string, index: number) => ({
            productId: pId,
            sortOrder: index,
          })),
        },
      },
      include: {
        products: true,
      },
    });

    return NextResponse.json({ success: true, collection });
  } catch (err: any) {
    console.error('Create collection error:', err);
    return NextResponse.json({ error: err.message || 'Failed to create collection.' }, { status: 500 });
  }
}

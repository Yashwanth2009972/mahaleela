import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const collection = await prisma.collection.findUnique({
    where: { id: params.id },
    include: {
      products: {
        include: { product: { include: { images: true } } },
        orderBy: { sortOrder: 'asc' },
      },
    },
  });

  if (!collection) return NextResponse.json({ error: 'Collection not found' }, { status: 404 });
  return NextResponse.json({ collection });
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { name, slug, description, heroImage, mobileHeroImage, bannerImage, seoTitle, seoDescription, isPublished, productIds } = await req.json();

    const collection = await prisma.collection.update({
      where: { id: params.id },
      data: {
        name,
        slug,
        description,
        heroImage,
        mobileHeroImage,
        bannerImage,
        seoTitle,
        seoDescription,
        isPublished,
      },
    });

    if (productIds && Array.isArray(productIds)) {
      await prisma.collectionProduct.deleteMany({ where: { collectionId: params.id } });
      await prisma.collectionProduct.createMany({
        data: productIds.map((pId: string, idx: number) => ({
          collectionId: params.id,
          productId: pId,
          sortOrder: idx,
        })),
      });
    }

    return NextResponse.json({ success: true, collection });
  } catch (err: any) {
    console.error('Update collection error:', err);
    return NextResponse.json({ error: err.message || 'Failed to update collection' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await prisma.collection.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}

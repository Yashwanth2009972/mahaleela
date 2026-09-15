import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: {
      category: true,
      images: { orderBy: { orderIndex: 'asc' } },
      variants: true,
      collections: { include: { collection: true } },
    },
  });

  if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  return NextResponse.json({ product });
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const {
      name,
      slug,
      categoryId,
      description,
      price,
      mrp,
      sku,
      stock,
      badge,
      isPublished,
      isArchived,
      details,
      sizeFit,
      materialCare,
      shippingReturns,
      seoTitle,
      seoDescription,
      images,
      variants,
      collectionIds,
    } = body;

    const calculatedDiscount = mrp && mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;

    // Update base product
    const updated = await prisma.product.update({
      where: { id: params.id },
      data: {
        name,
        slug,
        categoryId,
        description,
        price: price !== undefined ? Number(price) : undefined,
        mrp: mrp !== undefined ? Number(mrp) : undefined,
        discount: calculatedDiscount,
        sku,
        stock: stock !== undefined ? Number(stock) : undefined,
        badge,
        isPublished,
        isArchived,
        details,
        sizeFit,
        materialCare,
        shippingReturns,
        seoTitle,
        seoDescription,
      },
    });

    // If new images provided, refresh
    if (images && Array.isArray(images)) {
      await prisma.productImage.deleteMany({ where: { productId: params.id } });
      await prisma.productImage.createMany({
        data: images.map((url: string, index: number) => ({
          productId: params.id,
          url,
          isPrimary: index === 0,
          orderIndex: index,
        })),
      });
    }

    // If variants provided, refresh
    if (variants && Array.isArray(variants)) {
      await prisma.productVariant.deleteMany({ where: { productId: params.id } });
      await prisma.productVariant.createMany({
        data: variants.map((v: any) => ({
          productId: params.id,
          size: v.size || null,
          color: v.color || null,
          sku: v.sku || null,
          price: v.price ? Number(v.price) : Number(price || 0),
          mrp: v.mrp ? Number(v.mrp) : Number(mrp || price || 0),
          stock: v.stock ? Number(v.stock) : 0,
          isAvailable: true,
        })),
      });
    }

    // If collections provided, refresh
    if (collectionIds && Array.isArray(collectionIds)) {
      await prisma.collectionProduct.deleteMany({ where: { productId: params.id } });
      await prisma.collectionProduct.createMany({
        data: collectionIds.map((cId: string, idx: number) => ({
          productId: params.id,
          collectionId: cId,
          sortOrder: idx,
        })),
      });
    }

    return NextResponse.json({ success: true, product: updated });
  } catch (err: any) {
    console.error('Update product error:', err);
    return NextResponse.json({ error: err.message || 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await prisma.product.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}

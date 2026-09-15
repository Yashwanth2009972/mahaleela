export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export async function GET(req: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const products = await prisma.product.findMany({
    include: {
      category: true,
      images: { orderBy: { orderIndex: 'asc' } },
      variants: true,
      collections: { include: { collection: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ products });
}

export async function POST(req: Request) {
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
      details,
      sizeFit,
      materialCare,
      shippingReturns,
      seoTitle,
      seoDescription,
      images, // array of urls
      variants, // array of { size, color, sku, price, mrp, stock }
      collectionIds, // array of string ids
    } = body;

    if (!name || !categoryId || price === undefined) {
      return NextResponse.json({ error: 'Name, category, and price are required.' }, { status: 400 });
    }

    const calculatedDiscount = mrp && mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;
    const finalSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const product = await prisma.product.create({
      data: {
        name,
        slug: finalSlug,
        categoryId,
        description,
        price: Number(price),
        mrp: Number(mrp || price),
        discount: calculatedDiscount,
        sku: sku || `SKU-${Date.now()}`,
        stock: Number(stock || 0),
        badge: badge || null,
        isPublished: isPublished !== undefined ? isPublished : true,
        details,
        sizeFit,
        materialCare,
        shippingReturns,
        seoTitle,
        seoDescription,
        images: {
          create: (images || []).map((url: string, index: number) => ({
            url,
            isPrimary: index === 0,
            orderIndex: index,
          })),
        },
        variants: {
          create: (variants || []).map((v: any) => ({
            size: v.size || null,
            color: v.color || null,
            sku: v.sku || null,
            price: v.price ? Number(v.price) : Number(price),
            mrp: v.mrp ? Number(v.mrp) : Number(mrp || price),
            stock: v.stock ? Number(v.stock) : 0,
            isAvailable: true,
          })),
        },
        collections: {
          create: (collectionIds || []).map((cId: string, idx: number) => ({
            collectionId: cId,
            sortOrder: idx,
          })),
        },
      },
      include: {
        images: true,
        variants: true,
        category: true,
      },
    });

    return NextResponse.json({ success: true, product });
  } catch (err: any) {
    console.error('Create product error:', err);
    return NextResponse.json({ error: err.message || 'Failed to create product.' }, { status: 500 });
  }
}

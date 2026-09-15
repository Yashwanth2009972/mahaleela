import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const template = await prisma.visualTemplate.findUnique({ where: { id: params.id } });
  if (!template) return NextResponse.json({ error: 'Template not found' }, { status: 404 });

  return NextResponse.json({ template });
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { name, category, aspectRatio, styleName, config, isPublished } = await req.json();

    const template = await prisma.visualTemplate.update({
      where: { id: params.id },
      data: {
        name,
        category,
        aspectRatio,
        styleName,
        config: typeof config === 'string' ? config : JSON.stringify(config),
        isPublished,
      },
    });

    return NextResponse.json({ success: true, template });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update template' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await prisma.visualTemplate.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}

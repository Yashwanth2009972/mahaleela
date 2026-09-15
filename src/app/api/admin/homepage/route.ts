import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export async function GET() {
  const sections = await prisma.homepageSection.findMany({ orderBy: { sortOrder: 'asc' } });
  return NextResponse.json({ sections });
}

export async function PUT(req: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { sections } = await req.json(); // array of { id, isVisible, sortOrder, content, title, subtitle }

    for (const sec of sections) {
      await prisma.homepageSection.update({
        where: { id: sec.id },
        data: {
          isVisible: sec.isVisible,
          sortOrder: sec.sortOrder,
          content: typeof sec.content === 'string' ? sec.content : JSON.stringify(sec.content),
          title: sec.title,
          subtitle: sec.subtitle,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

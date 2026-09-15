import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

export async function GET() {
  const items = await prisma.galleryItem.findMany({
    where: { isActive: true },
    orderBy: { orderIndex: "asc" },
  });
  return NextResponse.json({ items });
}

export async function POST(req: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { url, title, subtitle, orderIndex } = body;

    if (!url) {
      return NextResponse.json({ error: "Image URL is required" }, { status: 400 });
    }

    const item = await prisma.galleryItem.create({
      data: {
        url,
        title: title || "MAHALEELA EDITION",
        subtitle: subtitle || "HAUTE COUTURE",
        orderIndex: Number(orderIndex) || 0,
        isActive: true,
      },
    });

    revalidatePath("/");
    return NextResponse.json({ success: true, item });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing gallery item ID" }, { status: 400 });

    await prisma.galleryItem.delete({ where: { id } });
    revalidatePath("/");
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

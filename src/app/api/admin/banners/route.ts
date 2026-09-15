import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

export async function GET() {
  const banners = await prisma.banner.findMany({
    orderBy: { priority: "desc" },
  });
  return NextResponse.json({ banners });
}

export async function POST(req: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { desktopImage, mobileImage, headline, subtitle, ctaText, ctaUrl, priority, isActive } = body;

    if (!desktopImage) {
      return NextResponse.json({ error: "Desktop banner image (21:9) is required." }, { status: 400 });
    }

    const banner = await prisma.banner.create({
      data: {
        desktopImage,
        mobileImage: mobileImage || desktopImage,
        headline: headline || null,
        subtitle: subtitle || null,
        ctaText: ctaText || "EXPLORE PIECES",
        ctaUrl: ctaUrl || "/#catalogue",
        priority: Number(priority) || 0,
        isActive: isActive !== undefined ? Boolean(isActive) : true,
      },
    });

    revalidatePath("/");
    return NextResponse.json({ success: true, banner });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { id, desktopImage, mobileImage, headline, subtitle, ctaText, ctaUrl, priority, isActive } = body;

    const banner = await prisma.banner.update({
      where: { id },
      data: {
        desktopImage,
        mobileImage: mobileImage || desktopImage,
        headline,
        subtitle,
        ctaText,
        ctaUrl,
        priority: Number(priority) || 0,
        isActive: Boolean(isActive),
      },
    });

    revalidatePath("/");
    return NextResponse.json({ success: true, banner });
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
    if (!id) return NextResponse.json({ error: "Missing banner ID" }, { status: 400 });

    await prisma.banner.delete({ where: { id } });
    revalidatePath("/");
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

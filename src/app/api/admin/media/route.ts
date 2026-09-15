import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export async function GET() {
  const media = await prisma.media.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json({ media });
}

import { promises as fs } from "fs";
import path from "path";

export async function POST(req: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file") as File | null;
      if (!file) return NextResponse.json({ error: "No file received" }, { status: 400 });

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadsDir = path.join(process.cwd(), "public", "uploads");
      await fs.mkdir(uploadsDir, { recursive: true });

      const originalExt = path.extname(file.name) || ".jpg";
      const sanitizedBase = file.name
        .replace(originalExt, "")
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "-")
        .substring(0, 30);
      const uniqueFilename = `${Date.now()}-${sanitizedBase || "media"}${originalExt}`;
      const destinationPath = path.join(uploadsDir, uniqueFilename);

      await fs.writeFile(destinationPath, buffer);
      const publicUrl = `/uploads/${uniqueFilename}`;

      const item = await prisma.media.create({
        data: {
          filename: uniqueFilename,
          url: publicUrl,
          mimeType: file.type || "image/jpeg",
          size: file.size,
          width: 1920,
          height: 1080,
          alt: file.name || "MAHALEELA Asset",
        },
      });

      return NextResponse.json({ success: true, media: item, url: publicUrl });
    }

    const { filename, url, alt, width, height } = await req.json();
    const item = await prisma.media.create({
      data: {
        filename: filename || 'media-asset',
        url,
        alt: alt || 'MAHALEELA Media Asset',
        width: width || 1080,
        height: height || 1080,
      },
    });
    return NextResponse.json({ success: true, media: item });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

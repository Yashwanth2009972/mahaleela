import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import cloudinary from "@/lib/cloudinary";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized atelier access" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No image file received from device" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadResult: any = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "mahaleela",
            resource_type: "image",
            use_filename: true,
            unique_filename: true,
            overwrite: false,
          },
          (error, result) => {
            if (error || !result) {
              reject(error || new Error("Cloudinary upload failed"));
            } else {
              resolve(result);
            }
          }
        )
        .end(buffer);
    });

    const publicUrl = uploadResult.secure_url;

    const media = await prisma.media.create({
      data: {
        filename: file.name || "mahaleela-asset",
        url: publicUrl,
        mimeType: file.type || "image/jpeg",
        size: uploadResult.bytes || file.size,
        width: uploadResult.width || 1920,
        height: uploadResult.height || 1080,
        alt: file.name || "MAHALEELA Asset",
      },
    });

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename: file.name,
      size: file.size,
      mimeType: file.type,
      media,
    });
  } catch (err: any) {
    console.error("Cloudinary upload failure:", err);
    return NextResponse.json({ error: err.message || "Failed to upload image file" }, { status: 500 });
  }
}
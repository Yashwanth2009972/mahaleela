import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { signToken } from "@/lib/auth";

export const dynamic = "force-dynamic";

const DEFAULT_MASTER_PIN = "182009";
const ADMIN_EMAIL = "leelambikamahadeva@gmail.com";

export async function POST(req: Request) {
  try {
    const { pin } = await req.json();

    // Fetch dynamic master PIN if changed by owner in admin panel
    let currentMasterPin = DEFAULT_MASTER_PIN;
    try {
      const pinSetting = await prisma.siteSettings.findUnique({
        where: { key: "master_admin_pin" },
      });
      if (pinSetting?.value) {
        currentMasterPin = pinSetting.value.trim();
      }
    } catch {}

    if (!pin || pin.toString().trim() !== currentMasterPin) {
      return NextResponse.json(
        { error: "Incorrect security PIN. Access denied." },
        { status: 401 }
      );
    }

    // Ensure the admin user exists in the database
    let admin = await prisma.user.findUnique({
      where: { email: ADMIN_EMAIL },
    });

    if (!admin) {
      admin = await prisma.user.create({
        data: {
          email: ADMIN_EMAIL,
          name: "MAHALEELA Owner",
          role: "ADMIN",
        },
      });
    } else if (admin.role !== "ADMIN" && admin.role !== "SUPER_ADMIN") {
      admin = await prisma.user.update({
        where: { id: admin.id },
        data: { role: "ADMIN" },
      });
    }

    // Generate admin session JWT token
    const token = signToken({
      userId: admin.id,
      email: admin.email,
      role: "ADMIN",
      name: admin.name,
    });

    // Set HTTP-only secure cookie
    const cookieStore = cookies();
    cookieStore.set("mahaleela_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: "/",
    });

    return NextResponse.json({
      success: true,
      redirect: "/admin",
      message: "Atelier access granted.",
    });
  } catch (err: any) {
    console.error("Admin PIN authentication failure:", err);
    return NextResponse.json(
      { error: err.message || "Authentication system failure." },
      { status: 500 }
    );
  }
}
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { signToken } from "@/lib/auth";

export const dynamic = "force-dynamic";

const MASTER_ADMIN_PIN = "182009";
const ADMIN_EMAIL = "leelambikamahadeva@gmail.com";

export async function POST(req: Request) {
  try {
    const { pin } = await req.json();

    if (!pin || pin.toString().trim() !== MASTER_ADMIN_PIN) {
      return NextResponse.json(
        { error: "Invalid master security PIN code. Access denied." },
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
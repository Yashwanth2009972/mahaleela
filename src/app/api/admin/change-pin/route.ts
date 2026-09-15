import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

const DEFAULT_MASTER_PIN = "182009";

export async function POST(req: Request) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized atelier access" }, { status: 401 });
  }

  try {
    const { currentPin, newPin, confirmPin } = await req.json();

    if (!currentPin || !newPin || !confirmPin) {
      return NextResponse.json(
        { error: "Please complete all PIN fields." },
        { status: 400 }
      );
    }

    // Verify current PIN
    let currentMasterPin = DEFAULT_MASTER_PIN;
    const pinSetting = await prisma.siteSettings.findUnique({
      where: { key: "master_admin_pin" },
    });
    if (pinSetting?.value) {
      currentMasterPin = pinSetting.value.trim();
    }

    if (currentPin.toString().trim() !== currentMasterPin) {
      return NextResponse.json(
        { error: "Current PIN is incorrect." },
        { status: 400 }
      );
    }

    // Validate new PIN (strictly 6 numeric digits)
    const cleanNewPin = newPin.toString().trim();
    if (!/^\d{6}$/.test(cleanNewPin)) {
      return NextResponse.json(
        { error: "New PIN must be exactly 6 digits (numbers only)." },
        { status: 400 }
      );
    }

    if (cleanNewPin !== confirmPin.toString().trim()) {
      return NextResponse.json(
        { error: "New PIN and Confirmation PIN do not match." },
        { status: 400 }
      );
    }

    if (cleanNewPin === currentMasterPin) {
      return NextResponse.json(
        { error: "New PIN cannot be the same as current PIN." },
        { status: 400 }
      );
    }

    // Save updated PIN to SiteSettings
    await prisma.siteSettings.upsert({
      where: { key: "master_admin_pin" },
      update: { value: cleanNewPin },
      create: { key: "master_admin_pin", value: cleanNewPin },
    });

    return NextResponse.json({
      success: true,
      message: "Master Security PIN updated successfully.",
    });
  } catch (err: any) {
    console.error("Failed to change master PIN:", err);
    return NextResponse.json(
      { error: err.message || "Failed to update security PIN." },
      { status: 500 }
    );
  }
}
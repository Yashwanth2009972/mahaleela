import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export async function POST() {
  const cookieStore = cookies();
  cookieStore.delete("mahaleela_session");
  return NextResponse.json({ success: true, redirect: "/admin/login" });
}

export async function GET(req: Request) {
  const cookieStore = cookies();
  cookieStore.delete("mahaleela_session");
  return NextResponse.redirect(new URL("/admin/login", req.url));
}
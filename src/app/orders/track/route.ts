import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const orderNumber = searchParams.get("orderNumber")?.trim();
  if (orderNumber) {
    return NextResponse.redirect(new URL(`/orders/${orderNumber}`, req.url));
  }
  return NextResponse.redirect(new URL("/orders", req.url));
}

import { NextResponse } from "next/server";
import { loadOrder } from "@/lib/server/storage";

export const runtime = "nodejs";

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const order = await loadOrder(params.id);
  if (!order) {
    return NextResponse.json({ error: "order not found" }, { status: 404 });
  }
  return NextResponse.json(order);
}

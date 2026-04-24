import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: { type: string } }
) {
  try {
    const res = await fetch(`${process.env.API_BASE_URL}/signals/${params.type}`, {
      cache: "no-store",
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ detail: "Backend unavailable" }, { status: 502 });
  }
}

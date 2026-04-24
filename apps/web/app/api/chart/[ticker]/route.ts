import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { ticker: string } }
) {
  const period = req.nextUrl.searchParams.get("period") ?? "6mo";
  const interval = req.nextUrl.searchParams.get("interval") ?? "1d";
  try {
    const res = await fetch(
      `${process.env.API_BASE_URL}/chart/${params.ticker}?period=${period}&interval=${interval}`,
      { cache: "no-store" }
    );
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ detail: "Backend unavailable" }, { status: 502 });
  }
}

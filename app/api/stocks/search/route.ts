import { NextRequest, NextResponse } from "next/server";
import { searchStocks } from "@/lib/actions/finnhub.actions";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q") || undefined;

    const stocks = await searchStocks(query);

    return NextResponse.json(stocks);
  } catch (error) {
    console.error("Error in stock search API:", error);
    return NextResponse.json(
      { error: "Failed to search stocks" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const query = body?.query || body?.q || undefined;

    const stocks = await searchStocks(query);

    return NextResponse.json(stocks);
  } catch (error) {
    console.error("Error in stock search API:", error);
    return NextResponse.json(
      { error: "Failed to search stocks" },
      { status: 500 }
    );
  }
}

import { getEbayResults } from "@/app/lib/getEbayResults";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");
  const filters = searchParams.get("filters");

  if (!query) {
    return Response.json({ error: "Missing query parameter." });
  }

  try {
    const results = await getEbayResults(query);

    if (!results) {
      throw new Error("No results.");
    }

    const response = NextResponse.json({
      data: results,
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch Ebay results." },
      { status: 500 }
    );
  }
}

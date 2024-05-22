import { NextResponse } from "next/server";
import { getPoshmarkResults } from "../../lib/getPoshmarkResults";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");

  if (!query) {
    return Response.json({ error: "Missing query parameter." });
  }

  try {
    const data = await getPoshmarkResults(query);
    const results = data.data;

    const response = NextResponse.json({ data: results });
    response.headers.set(
      "Cache-Control",
      "public, s-maxage=60, stale-while-revalidate"
    );

    return response;
  } catch (error) {
    console.error("Error fetching Poshmark results: ", error);
    return NextResponse.json(
      { error: "Failed to fetch Poshmark results." },
      { status: 500 }
    );
  }
}

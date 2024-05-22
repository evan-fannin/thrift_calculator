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

    return Response.json({ data: results });
  } catch (error) {
    console.error("Error fetching Poshmark results: ", error);
    return NextResponse.json(
      { error: "Failed to fetch Poshmark results." },
      { status: 500 }
    );
  }
}

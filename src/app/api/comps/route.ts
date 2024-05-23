import { NextResponse } from "next/server";
import { getPoshmarkResults } from "../../lib/getPoshmarkResults";
import { PoshmarkResult } from "@/app/types";

interface PoshmarkAPIError {
  errorType: string;
  errorMessage: string;
  statusCode: number;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");

  if (!query) {
    return Response.json({ error: "Missing query parameter." });
  }

  try {
    const data = await getPoshmarkResults(query);

    if (data.error) {
      const error: PoshmarkAPIError = data.error;

      if (
        error.errorType === "ValidationError" &&
        error.errorMessage === null &&
        error.statusCode === 400
      ) {
        return NextResponse.json({ data: [] });
      }
    }

    const results = data.data;

    if (!results) {
      throw new Error("No results field exists.");
    }

    const response = NextResponse.json({
      data: results.map((result: PoshmarkResult) => ({
        id: result.id,
        title: result.title,
        size: result.size,
        price: result.price,
        cover_shot: {
          url_small: result.cover_shot.url_small,
        },
        postedAt: result.first_available_at || result.first_published_at,
        soldAt:
          result.inventory.last_unit_reserved_at ||
          result.inventory.status_changed_at,
      })),
    });

    return response;
  } catch (error) {
    console.error("Error fetching Poshmark results: ", error);
    return NextResponse.json(
      { error: "Failed to fetch Poshmark results." },
      { status: 500 }
    );
  }
}

"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface PoshmarkResult {
  id: number;
  title: string;
  size: string;
  price: string;
  cover_shot: {
    url_small: string;
  };
}

export default function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query");
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<PoshmarkResult[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (query) {
      setSearchQuery(query);
    }
  }, [query]);

  useEffect(() => {
    if (!searchQuery) {
      return;
    }

    async function getPoshmarkResults() {
      setError(null);
      try {
        const response = await fetch(`/api/comps/?query=${searchQuery}`, {
          cache: "force-cache",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setResults(data.data);
      } catch (error) {
        setError("Error fetching Poshmark results. Please try again.");
        console.error("Error fetching Poshmark results: ", error);
      }
    }

    getPoshmarkResults();
  }, [searchQuery]);

  const handleItemClick = (itemId: number) => {
    if (selectedItems.includes(itemId)) {
      setSelectedItems(selectedItems.filter((id) => id !== itemId));
    } else {
      setSelectedItems([...selectedItems, itemId]);
    }
  };
  return (
    <>
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {results.map((result) => (
              <div
                key={result.id}
                className={`bg-white rounded-lg shadow-lg p-4 cursor-pointer transition-transform transform hover:scale-105 ${
                  selectedItems.includes(result.id)
                    ? "ring-2 ring-blue-500"
                    : ""
                }`}
                onClick={() => handleItemClick(result.id)}
                aria-selected={selectedItems.includes(result.id)}
              >
                <Image
                  src={result["cover_shot"]["url_small"]}
                  alt={result.title}
                  width={200}
                  height={200}
                  className="mx-auto mb-4 rounded-md"
                />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {result.title}
                </h3>
                <p className="text-gray-600 mb-1">Size: {result.size}</p>
                <p className="text-gray-600">Price: {result.price}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}

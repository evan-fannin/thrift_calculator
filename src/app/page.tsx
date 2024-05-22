"use client";
import Image from "next/image";
import { useState } from "react";
import Head from "next/head";

interface PoshmarkResult {
  id: number;
  title: string;
  size: string;
  price: string;
  cover_shot: {
    url_small: string;
  };
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<PoshmarkResult[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    setError(null);
    try {
      const response = await fetch(`/api/comps/?query=${searchQuery}`);
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      setResults(data.data);
    } catch (error) {
      setError("Error fetching Poshmark results. Please try again.");
      console.error("Error fetching Poshmark results: ", error);
    }
  };

  const handleItemClick = (itemId: number) => {
    if (selectedItems.includes(itemId)) {
      setSelectedItems(selectedItems.filter((id) => id !== itemId));
    } else {
      setSelectedItems([...selectedItems, itemId]);
    }
  };

  return (
    <>
      <Head>
        <title>Poshmark Search</title>
        <meta
          name="description"
          content="Search and select items from Poshmark"
        />
      </Head>
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Poshmark"
                aria-label="Search Poshmark"
                className="w-full text-black sm:w-auto flex-grow px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 sm:mb-0 sm:mr-4"
              />
              <button
                onClick={handleSearch}
                className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              >
                Search
              </button>
            </div>
            {error && <p className="text-red-500 mt-4">{error}</p>}
          </div>
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

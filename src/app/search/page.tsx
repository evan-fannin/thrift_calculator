"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { PoshmarkResult } from "../types";

export default function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query");
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<PoshmarkResult[]>([]);
  const [selectedItems, setSelectedItems] = useState<PoshmarkResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showSummarizeButton, setShowSummarizeButton] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [userItemCost, setUserItemCost] = useState("");

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

  useEffect(() => {
    if (selectedItems.length > 0) {
      setShowSummarizeButton(true);
    } else {
      setShowSummarizeButton(false);
    }
  }, [selectedItems]);

  const handleItemClick = (item: PoshmarkResult) => {
    if (selectedItems.some((selectedItem) => selectedItem.id === item.id)) {
      setSelectedItems(
        selectedItems.filter((selectedItem) => selectedItem.id !== item.id)
      );
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const calculateAveragePrice = () => {
    const totalPrice = selectedItems.reduce((sum, item) => {
      const price = parseFloat(item.price);
      return sum + price;
    }, 0);
    return (totalPrice / selectedItems.length).toFixed(2);
  };

  const handleSummarizeClick = () => {
    setShowSummarizeButton(false);
    setShowSummaryModal(true);
  };

  const handleCloseSummaryModal = () => {
    setShowSummaryModal(false);
    setShowSummarizeButton(true);
  };

  const getDayDifference = (postedAt: string, soldAt: string) => {
    const date1 = new Date(postedAt);
    const date2 = new Date(soldAt);

    // Calculate the difference in time (milliseconds)
    const differenceInTime = Math.abs(date2.getTime() - date1.getTime());

    // Convert the difference in time to days
    const differenceInDays = Math.ceil(
      differenceInTime / (1000 * 60 * 60 * 24)
    );

    return differenceInDays;
  };

  return !results.length ? (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">No Results</div>
    </main>
  ) : (
    <>
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {results.map((result) => (
              <div
                key={result.id}
                className={`bg-white rounded-lg shadow-lg p-4 cursor-pointer transition-transform transform hover:scale-105 ${
                  selectedItems.some((item) => item.id === result.id)
                    ? "ring-2 ring-blue-500"
                    : ""
                }`}
                onClick={() => handleItemClick(result)}
                aria-selected={selectedItems.some(
                  (item) => item.id === result.id
                )}
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
                <p className="text-gray-600">
                  Days on market:{" "}
                  {getDayDifference(result.postedAt, result.soldAt)}
                </p>
              </div>
            ))}
          </div>
        </div>
        {showSummarizeButton && (
          <button
            onClick={handleSummarizeClick}
            className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white w-3/4 sm:w-64 h-16 flex items-center justify-center rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-semibold"
          >
            Summarize
          </button>
        )}
      </main>
      {showSummaryModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 w-11/12 sm:w-3/4 md:w-2/3 lg:w-1/2">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4">Summary</h2>
            <p className="text-gray-600 mb-4">
              Average Price: ${calculateAveragePrice()}
            </p>
            <div className="mb-4">
              <label
                htmlFor="userItemCost"
                className="block text-gray-700 font-semibold mb-2"
              >
                Your Item Cost:
              </label>
              <input
                type="number"
                id="userItemCost"
                value={userItemCost}
                onChange={(e) => setUserItemCost(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-6">
              <div className="bg-gray-100 p-4 rounded-md mb-4">
                <p className="text-sm font-semibold mb-2">
                  item_sale_price - platform_fee - item_cost = profit
                </p>
                <p className="text-gray-600 mb-2 text-sm">
                  item_sale_price = $
                  {(parseFloat(calculateAveragePrice()) * 0.8).toFixed(2)}
                </p>
                <p className="text-gray-600 mb-2 text-sm">
                  platform_fee = $
                  {(parseFloat(calculateAveragePrice()) * 0.2).toFixed(2)}
                </p>
                <p className="text-gray-600 mb-2 text-sm">
                  item_cost = ${userItemCost || "0"}
                </p>
              </div>
              <p className="text-lg sm:text-xl font-bold">
                Profit: $
                {(
                  parseFloat(calculateAveragePrice()) * 0.8 -
                  parseFloat(calculateAveragePrice()) * 0.2 -
                  parseFloat(userItemCost || "0")
                ).toFixed(2)}
              </p>
            </div>
            <button
              onClick={handleCloseSummaryModal}
              className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-semibold w-full sm:w-auto"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

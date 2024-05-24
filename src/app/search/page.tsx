"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { PoshmarkResult } from "../types";
import SummaryModal from "./SummaryModal";
import { getDayDifference } from "./utils";
import FancySpinner from "../components/FancySpinner";

export default function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query");
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<PoshmarkResult[]>([]);
  const [selectedItems, setSelectedItems] = useState<PoshmarkResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSummarizeButton, setShowSummarizeButton] = useState(true);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [buttonText, setButtonText] = useState("Select items to analyze");

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
        setLoading(false);
      } catch (error) {
        setError("Error fetching Poshmark results. Please try again.");
        console.error("Error fetching Poshmark results: ", error);
      }
    }

    getPoshmarkResults();
  }, [searchQuery]);

  useEffect(() => {
    if (selectedItems.length > 0) {
      setButtonText("Analyze");
    } else {
      setButtonText("Select items to analyze");
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

  const handleSummarizeClick = () => {
    setShowSummarizeButton(false);
    setShowSummaryModal(true);
  };

  const handleCloseSummaryModal = () => {
    setShowSummaryModal(false);
    setShowSummarizeButton(true);
  };

  return loading ? (
    <FancySpinner />
  ) : !results.length ? (
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
            className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 w-3/4 sm:w-64 h-16 flex items-center justify-center rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-semibold ${
              selectedItems.length < 1
                ? "bg-blue-500 text-white opacity-50 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
            disabled={selectedItems.length < 1}
          >
            {buttonText}
          </button>
        )}
      </main>
      {showSummaryModal && (
        <SummaryModal
          handleCloseSummaryModal={handleCloseSummaryModal}
          selectedItems={selectedItems}
        />
      )}
    </>
  );
}

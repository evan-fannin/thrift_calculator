"use client";

// filter by
// size
// brand
// color
// department -> clothing type -> subtype

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { PoshmarkResult } from "../types";
import SummaryModal from "./SummaryModal";
import { getDayDifference } from "./utils";
import FancySpinner from "../components/FancySpinner";
import PoshResult from "./PoshResult";

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
  const [allSelected, setAllSelected] = useState(false);

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

  const handleSelectAllClick = () => {
    if (allSelected) {
      setSelectedItems([]);
      setAllSelected(false);
    } else {
      setSelectedItems([...results]);
      setAllSelected(true);
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
          <button
            onClick={handleSelectAllClick}
            className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto w-full"
          >
            {allSelected ? "Deselect All" : "Select All"}
          </button>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {results.map((result) => (
              <PoshResult
                key={result.id}
                result={result}
                selectedItems={selectedItems}
                handleItemClick={handleItemClick}
              />
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

"use client";

// filter by
// size
// brand
// color
// department -> clothing type -> subtype

import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { PoshmarkResult } from "../types";
import SummaryModal from "./SummaryModal";
import FancySpinner from "../components/FancySpinner";
import PoshResult from "./PoshResult";
import FilterControls from "./FilterControls";
import { fetchPoshmarkResults } from "./client";

export default function SearchResults() {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("query"));
  const [results, setResults] = useState<PoshmarkResult[]>([]);
  const [selectedItems, setSelectedItems] = useState<PoshmarkResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSummarizeButton, setShowSummarizeButton] = useState(true);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [buttonText, setButtonText] = useState("Select items to analyze");
  const [allSelected, setAllSelected] = useState(false);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [filtersVisible, setFiltersVisible] = useState(false);

  const fetchResults = useCallback(async () => {
    if (!searchQuery) {
      return;
    }

    setError(null);
    try {
      const data = await fetchPoshmarkResults({
        searchQuery,
        ...(selectedColors.length && { filters: { selectedColors } }),
      });
      setResults(data);
      setLoading(false);
    } catch (error) {
      setError("Error fetching Poshmark results. Please try again.");
      console.error("Error fetching Poshmark results: ", error);
    }
  }, [searchQuery, selectedColors]);

  useEffect(() => {
    if (!searchQuery) {
      return;
    }

    fetchResults();
  }, [searchQuery, fetchResults]);

  useEffect(() => {
    if (selectedItems.length > 0) {
      setButtonText("Analyze");
    } else {
      setButtonText("Select items to analyze");
    }

    const filteredSelectedItems = selectedItems.filter((item) =>
      results.some((result) => result.id === item.id)
    );

    if (filteredSelectedItems.length !== selectedItems.length) {
      setSelectedItems(filteredSelectedItems);
      setAllSelected(false);
    }
  }, [selectedItems, results]);

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

  const toggleFiltersVisibility = () => {
    setFiltersVisible((prev) => !prev);
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
          <div className="mb-8 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <button
              onClick={toggleFiltersVisibility}
              className="w-full sm:w-auto px-6 py-3 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-300"
            >
              {filtersVisible ? "Close filters" : "Add filters"}
            </button>
            <button
              onClick={handleSelectAllClick}
              className="w-full sm:w-auto px-6 py-3 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-300"
            >
              {allSelected ? "Deselect all" : "Select all"}
            </button>
          </div>
          <div
            className={`mb-8 transition-all duration-300 ${
              filtersVisible
                ? "max-h-screen opacity-100"
                : "max-h-0 opacity-0 overflow-hidden"
            }`}
          >
            {filtersVisible && (
              <FilterControls
                results={results}
                selectedColors={selectedColors}
                setSelectedColors={setSelectedColors}
                toggleFiltersVisibility={toggleFiltersVisibility}
              />
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
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
      </main>
      {showSummarizeButton && (
        <div className="fixed bottom-4 left-4 right-4 sm:bottom-8 sm:left-auto sm:right-8">
          <button
            onClick={handleSummarizeClick}
            className={`w-full sm:w-auto px-6 py-3 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-semibold transition duration-300 ${
              selectedItems.length < 1
                ? "bg-blue-500 text-white opacity-50 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
            disabled={selectedItems.length < 1}
          >
            {buttonText}
          </button>
        </div>
      )}
      {showSummaryModal && (
        <SummaryModal
          handleCloseSummaryModal={handleCloseSummaryModal}
          selectedItems={selectedItems}
        />
      )}
    </>
  );
}

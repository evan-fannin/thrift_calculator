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
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [filtersVisible, setFiltersVisible] = useState(false);

  const filteredResults = useMemo(() => {
    let filtered = results;

    if (selectedColors.length > 0) {
      filtered = filtered.filter((result) =>
        result.colors.some((color) => selectedColors.includes(color.name))
      );
    }

    if (selectedSizes.length > 0) {
      filtered = filtered.filter((result) =>
        selectedSizes.includes(result.size)
      );
    }

    return filtered;
  }, [results, selectedColors, selectedSizes]);

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

    const filteredSelectedItems = selectedItems.filter((item) =>
      filteredResults.some((result) => result.id === item.id)
    );

    if (filteredSelectedItems.length !== selectedItems.length) {
      setSelectedItems(filteredSelectedItems);
      setAllSelected(false);
    }
  }, [selectedItems, filteredResults]);

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
      setSelectedItems([...filteredResults]);
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
              {filtersVisible ? "Hide Filters" : "Add Filters"}
            </button>
            <button
              onClick={handleSelectAllClick}
              className="w-full sm:w-auto px-6 py-3 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-300"
            >
              {allSelected ? "Deselect All" : "Select All"}
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
                selectedSizes={selectedSizes}
                setSelectedSizes={setSelectedSizes}
              />
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filteredResults.map((result) => (
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

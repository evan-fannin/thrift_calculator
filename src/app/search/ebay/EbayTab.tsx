import { useCallback, useEffect, useState } from "react";
import { EbayResultType, PoshmarkResult } from "../../types";
import { useSearchParams } from "next/navigation";
import { fetchEbayResults } from "../client";
import Results from "../poshmark/Results";
import EbaySummaryModal from "./EbaySummaryModal";
import FilterControls from "../FilterControls";
import EbayResults from "./EbayResults";

export default function EbayTab() {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("query"));
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [selectedItems, setSelectedItems] = useState<EbayResultType[]>([]);
  const [allSelected, setAllSelected] = useState(false);
  const [results, setResults] = useState<EbayResultType[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [showSummarizeButton, setShowSummarizeButton] = useState(true);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [buttonText, setButtonText] = useState("Select items to analyze");

  const fetchResults = useCallback(async () => {
    if (!searchQuery) {
      return;
    }

    setError(null);
    setLoading(true);
    try {
      const data = await fetchEbayResults({
        searchQuery,
        ...(selectedColors.length && { filters: { selectedColors } }),
      });
      setResults(data);
    } catch (error) {
      setError("Error fetching Ebay results. Please try again.");
      console.error("Error fetching Ebay results: ", error);
    } finally {
      setLoading(false);
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

  const handleItemClick = (item: EbayResultType) => {
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

  return (
    <>
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
      <EbayResults
        loading={loading}
        results={results}
        selectedItems={selectedItems}
        handleItemClick={handleItemClick}
      />
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
        <EbaySummaryModal
          handleCloseSummaryModal={handleCloseSummaryModal}
          selectedItems={selectedItems}
        />
      )}
    </>
  );
}

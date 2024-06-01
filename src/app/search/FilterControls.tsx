import { useState } from "react";
import { PoshmarkResult } from "../types";

interface FilterControlsProps {
  results: PoshmarkResult[];
  selectedColors: string[];
  setSelectedColors: (selectedColors: string[]) => void;
  toggleFiltersVisibility: () => void;
}

export default function FilterControls({
  results,
  selectedColors,
  setSelectedColors,
  toggleFiltersVisibility,
}: FilterControlsProps) {
  const [localSelectedColors, setLocalSelectedColors] =
    useState<string[]>(selectedColors);

  const uniqueColors = [
    "Black",
    "Blue",
    "Brown",
    "Cream",
    "Gray",
    "Green",
    "Orange",
    "Pink",
    "Purple",
    "Red",
    "Silver",
    "Tan",
    "White",
  ];

  const uniqueSizes = Array.from(
    new Set(results.map((result) => result.size).filter((x) => x))
  );

  const handleColorChange = (color: string) => {
    const updatedColors = localSelectedColors.includes(color)
      ? localSelectedColors.filter((c) => c !== color)
      : [...localSelectedColors, color];
    setLocalSelectedColors(updatedColors);
  };

  const handleApplyFilters = () => {
    setSelectedColors(localSelectedColors);
    toggleFiltersVisibility();
  };

  return (
    <div className="bg-white shadow-md rounded-md p-4 mb-4">
      <h3 className="text-lg font-semibold mb-4">Filter by Color</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {uniqueColors.map((color) => (
          <label key={color} className="flex items-center">
            <input
              type="checkbox"
              className="form-checkbox h-5 w-5 text-blue-500 transition duration-150 ease-in-out"
              checked={localSelectedColors.includes(color)}
              onChange={() => handleColorChange(color)}
            />
            <span className="ml-2 text-gray-700">{color}</span>
          </label>
        ))}
      </div>
      <button
        onClick={handleApplyFilters}
        className="mt-6 w-full sm:w-auto px-6 py-3 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-300"
      >
        Apply Filters
      </button>
    </div>
  );
}

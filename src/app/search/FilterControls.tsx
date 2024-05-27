import { useState } from "react";
import { PoshmarkResult } from "../types";

interface FilterControlsProps {
  results: PoshmarkResult[];
  onColorFilterChange: (selectedColors: string[]) => void;
}

export default function FilterControls({
  results,
  onColorFilterChange,
}: FilterControlsProps) {
  const [selectedColors, setSelectedColors] = useState<string[]>([]);

  const uniqueColors = Array.from(
    new Set(
      results
        .flatMap((result) => result.colors?.map((color) => color.name))
        .filter((x) => x) // filter out potential undefined values from a result not having a colors array
    )
  );

  console.log(uniqueColors);

  const handleColorChange = (color: string) => {
    const updatedColors = selectedColors.includes(color)
      ? selectedColors.filter((c) => c !== color)
      : [...selectedColors, color];

    setSelectedColors(updatedColors);
    onColorFilterChange(updatedColors);
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
              checked={selectedColors.includes(color)}
              onChange={() => handleColorChange(color)}
            />
            <span className="ml-2 text-gray-700">{color}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

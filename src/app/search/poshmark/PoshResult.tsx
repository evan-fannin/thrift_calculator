import Image from "next/image";
import { PoshmarkResult } from "../../types";
import { getDayDifference } from "../utils";

export default function PoshResult({
  result,
  selectedItems,
  handleItemClick,
}: {
  result: PoshmarkResult;
  selectedItems: PoshmarkResult[];
  handleItemClick: (result: PoshmarkResult) => void;
}) {
  return (
    <div
      key={result.id}
      className={`bg-white rounded-lg shadow-lg p-4 cursor-pointer transition-transform transform hover:scale-105 ${
        selectedItems.some((item) => item.id === result.id)
          ? "ring-2 ring-blue-500"
          : ""
      }`}
      onClick={() => handleItemClick(result)}
      aria-selected={selectedItems.some((item) => item.id === result.id)}
    >
      <Image
        src={result["cover_shot"]["url_small"]}
        alt={result.title}
        width={200}
        height={200}
        className="mx-auto mb-4 rounded-md"
        unoptimized
      />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {result.title}
      </h3>
      <p className="text-gray-600 mb-1">Size: {result.size}</p>
      <p className="text-gray-600">Price: {result.price}</p>
      <p className="text-gray-600">
        Days on market: {getDayDifference(result.postedAt, result.soldAt)}
      </p>
    </div>
  );
}

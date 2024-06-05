import Image from "next/image";
import { EbayResultType } from "../../types";
import { getDayDifference } from "../utils";

export default function EbayResult({
  result,
  selectedItems,
  handleItemClick,
}: {
  result: EbayResultType;
  selectedItems: EbayResultType[];
  handleItemClick: (result: EbayResultType) => void;
}) {
  return (
    <div
      key={result.imageUrl}
      className={`bg-white rounded-lg shadow-lg p-4 cursor-pointer transition-transform transform hover:scale-105 ${
        selectedItems.some((item) => item.id === result.id)
          ? "ring-2 ring-blue-500"
          : ""
      }`}
      onClick={() => handleItemClick(result)}
      aria-selected={selectedItems.some((item) => item.id === result.id)}
    >
      <Image
        src={result.imageUrl}
        alt={result.title}
        width={200}
        height={200}
        className="mx-auto mb-4 rounded-md"
        unoptimized
      />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {result.title}
      </h3>
      <p className="text-gray-600">Price: {result.salePrice}</p>
      <p className="text-gray-600">Sold on: {result.soldAt}</p>
    </div>
  );
}

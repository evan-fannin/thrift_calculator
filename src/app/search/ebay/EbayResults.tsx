import FancySpinner from "../../components/FancySpinner";
import { EbayResultType } from "../../types";
import EbayResult from "./EbayResult";

export default function EbayResults({
  results,
  selectedItems,
  handleItemClick,
  loading,
}: {
  results: EbayResultType[];
  selectedItems: EbayResultType[];
  handleItemClick: (item: EbayResultType) => void;
  loading: boolean;
}) {
  return loading ? (
    <FancySpinner />
  ) : !results.length ? (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      No Results
    </div>
  ) : (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      {results.map((result) => (
        <EbayResult
          key={result.id}
          result={result}
          selectedItems={selectedItems as EbayResultType[]}
          handleItemClick={handleItemClick}
        />
      ))}
    </div>
  );
}

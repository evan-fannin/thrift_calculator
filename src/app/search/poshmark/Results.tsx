import FancySpinner from "../../components/FancySpinner";
import { PoshmarkResult } from "../../types";
import PoshResult from "./PoshResult";

export default function Results({
  results,
  selectedItems,
  handleItemClick,
  loading,
}: {
  results: PoshmarkResult[];
  selectedItems: PoshmarkResult[];
  handleItemClick: (item: PoshmarkResult) => void;
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
        <PoshResult
          key={result.id}
          result={result}
          selectedItems={selectedItems}
          handleItemClick={handleItemClick}
        />
      ))}
    </div>
  );
}

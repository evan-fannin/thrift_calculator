import { useEffect, useState } from "react";
import { EbayResultType, PoshmarkResult } from "../../types";
import { getDayDifference } from "../utils";

export default function SummaryModal({
  selectedItems,
  handleCloseSummaryModal,
}: {
  selectedItems: PoshmarkResult[];
  handleCloseSummaryModal: () => void;
}) {
  const calculateAverageDaysOnMarket = () => {
    const totalDays = selectedItems.reduce((sum, item) => {
      const daysOnMarket = getDayDifference(item.postedAt, item.soldAt);
      return sum + daysOnMarket;
    }, 0);
    return (totalDays / selectedItems.length).toFixed(2);
  };

  const calculateAveragePrice = () => {
    const totalPrice = selectedItems.reduce((sum, item) => {
      const price = parseFloat(item.price);
      return sum + price;
    }, 0);
    return (totalPrice / selectedItems.length).toFixed(2);
  };

  const calculatePlatformFee = (salePrice: number) => {
    return salePrice < 15 ? 2.95 : salePrice * 0.2;
  };

  const calculateProfit = (salePrice: number, costOfGoods: number) => {
    let profit = 0;
    if (salePrice < 15) {
      profit = salePrice - costOfGoods - 2.95;
    } else {
      profit = salePrice - costOfGoods - salePrice * 0.2;
    }
    return profit.toFixed(2);
  };

  const [averagePrice] = useState(parseFloat(calculateAveragePrice()));
  const [costOfGoods, setcostOfGoods] = useState(0);
  const [platformFee, setPlatformFee] = useState(
    calculatePlatformFee(averagePrice)
  );
  const [profit, setProfit] = useState(
    calculateProfit(averagePrice, costOfGoods)
  );

  useEffect(() => {
    setPlatformFee(calculatePlatformFee(averagePrice));
  }, [averagePrice]);

  useEffect(() => {
    setProfit(calculateProfit(averagePrice, costOfGoods));
  }, [averagePrice, costOfGoods]);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 sm:w-3/4 md:w-2/3 lg:w-1/2">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Summary</h2>
          <button
            onClick={handleCloseSummaryModal}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-gray-600 mb-2">Average Price:</p>
            <p className="text-lg font-semibold">${averagePrice}</p>
          </div>
          <div>
            <p className="text-gray-600 mb-2">Average Days on Market:</p>
            <p className="text-lg font-semibold">
              {calculateAverageDaysOnMarket()}
            </p>
          </div>
        </div>
        <div className="mb-6">
          <label
            htmlFor="costOfGoods"
            className="block text-gray-700 font-semibold mb-2"
          >
            Your Item Cost:
          </label>
          <input
            type="number"
            id="costOfGoods"
            value={costOfGoods}
            onChange={(e) => setcostOfGoods(parseFloat(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="bg-gray-100 p-4 rounded-md mb-6">
          <p className="text-sm font-semibold mb-2">
            item_sale_price - platform_fee - item_cost = profit
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600 mb-2 text-sm">
                item_sale_price = ${averagePrice}
              </p>
              <p className="text-gray-600 mb-2 text-sm">
                platform_fee = ${platformFee.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-gray-600 mb-2 text-sm">
                item_cost = ${costOfGoods || "0"}
              </p>
            </div>
          </div>
        </div>
        <div className="text-center">
          <p className="text-xl font-bold mb-2">
            Profit: ${profit} |{" "}
            {((parseFloat(profit) / averagePrice) * 100).toFixed(2)}%
          </p>
          <button
            onClick={handleCloseSummaryModal}
            className="bg-blue-500 text-white px-6 py-3 rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

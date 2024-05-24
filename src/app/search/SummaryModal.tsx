import { useEffect, useState } from "react";
import { PoshmarkResult } from "../types";
import { getDayDifference } from "./utils";

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
      <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 w-11/12 sm:w-3/4 md:w-2/3 lg:w-1/2">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">Summary</h2>
        <p className="text-gray-600 mb-4">Average Price: ${averagePrice}</p>
        <p className="text-gray-600 mb-4">
          Average Days on Market: {calculateAverageDaysOnMarket()}
        </p>
        <div className="mb-4">
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
        <div className="mb-6">
          <div className="bg-gray-100 p-4 rounded-md mb-4">
            <p className="text-sm font-semibold mb-2">
              item_sale_price - platform_fee - item_cost = profit
            </p>
            <p className="text-gray-600 mb-2 text-sm">
              item_sale_price = ${averagePrice}
            </p>
            <p className="text-gray-600 mb-2 text-sm">
              platform_fee = ${platformFee.toFixed(2)}
            </p>
            <p className="text-gray-600 mb-2 text-sm">
              item_cost = ${costOfGoods || "0"}
            </p>
          </div>
          <p className="text-lg sm:text-xl font-bold">
            Profit: ${profit} |{" "}
            {((parseFloat(profit) / averagePrice) * 100).toFixed(2)}%
          </p>
        </div>
        <button
          onClick={handleCloseSummaryModal}
          className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-semibold w-full sm:w-auto"
        >
          Close
        </button>
      </div>
    </div>
  );
}

import responseData from "./response.json";

export async function getEbayResults(query: string) {
  const url = "ebay.com";

  try {
    const response = { data: responseData };
    return response.data.map((result) => ({
      title: result.title,
      imageUrl: result.image_url,
      salePrice: result.sale_price,
      shippingPrice: result.shipping_price,
      shippingDiscount: result.shipping_discount,
      soldAt: result.sold_at,
      id: crypto.randomUUID(),
    }));
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}

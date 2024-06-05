export const fetchPoshmarkResults = async ({
  searchQuery,
  filters,
}: {
  searchQuery: string;
  filters?: { selectedColors: string[] };
}) => {
  try {
    const filterParams = new URLSearchParams();
    if (filters?.selectedColors && filters?.selectedColors?.length > 0) {
      filterParams.append("color", filters.selectedColors.join(","));
    }

    const response = await fetch(
      `/api/comps/poshmark/?query=${encodeURIComponent(
        searchQuery
      )}&filters=${encodeURIComponent(filterParams.toString())}`,
      {
        cache: "force-cache",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching Poshmark results: ", error);
    throw error;
  }
};

export const fetchEbayResults = async ({
  searchQuery,
}: {
  searchQuery: string;
}) => {
  try {
    const response = await fetch(
      `/api/comps/ebay/?query=${encodeURIComponent(searchQuery)}`,
      { cache: "force-cache" }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch data.");
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching Ebay results: ", error);
    throw error;
  }
};

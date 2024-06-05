import axios from "axios";

export async function getPoshmarkResults(
  query: string,
  filters: string | null
) {
  const url = "https://poshmark.com/vm-rest/posts";

  let colors: string[] = [];

  if (filters) {
    const filterParams = new URLSearchParams(filters);
    const colorParam = filterParams.get("color");

    if (colorParam) {
      colors = colorParam.split(",");
    }
  }

  const params = {
    request: JSON.stringify({
      filters: {
        department: "All",
        inventory_status: ["sold_out"],
        ...(colors.length && { color: colors }),
      },
      query_and_facet_filters: {
        department: "All",
      },
      query,
      experience: "all",
      sizeSystem: "us",
      count: "100",
    }),
    summarize: true,
    feature_extraction_setting: null,
    suggested_filters_count: 40,
    end_of_search_v2: true,
    generate_page_links: false,
    pm_version: "2024.20.0",
  };

  try {
    const response = await axios.get(url, { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}

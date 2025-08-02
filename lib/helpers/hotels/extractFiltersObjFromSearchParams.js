export default function extractFiltersObjFromSearchParams(searchParamsObj) {
  const filterSearchParams = Object.entries(searchParamsObj).filter(([key]) =>
    key.startsWith("filter_"),
  );
  const filters = {};

  filterSearchParams.forEach(([key, value]) => {
    const filterKey = key.split("filter_")[1];
    let filterValue = value.split(",").filter(Boolean);

    if (filterKey === "priceRange") {
      filterValue = filterValue
        .map((v) => parseInt(v))
        .filter((v) => v === 0 || !isNaN(v));
    }

    if (filterKey === "rates") {
      filterValue = [...new Set(filterValue)].map(String);
    }

    if (filterKey === "features") {
      filterValue = [...new Set(filterValue)].map((el) => {
        return el.split("feature-")[1] || el;
      });
    }
    if (filterKey === "amenities") {
      filterValue = [...new Set(filterValue)].map((el) => {
        return el.split("amenity-")[1] || el;
      });
    }

    if (filterValue.length > 0) {
      filters[filterKey] = filterValue;
    }
  });

  return filters;
}

import { HotelsFilter } from "@/components/pages/hotels.search/sections/HotelsFilter";
import { getHotelDefaultFilterValues } from "@/lib/controllers/hotels";
import extractFiltersObjFromSearchParams from "@/lib/helpers/hotels/extractFiltersObjFromSearchParams";
import validateHotelSearchFilter from "@/lib/zodSchemas/hotelSearchFilterValidation";
async function FlightFilterPage({ searchParams }) {
  const filtersParams = extractFiltersObjFromSearchParams(searchParams);
  const validatedFilters = validateHotelSearchFilter(filtersParams);
  const filterValues = await getHotelDefaultFilterValues();

  return (
    <HotelsFilter
      filters={validatedFilters?.data || {}}
      defaultFiltersVals={filterValues}
    />
  );
}

export default FlightFilterPage;

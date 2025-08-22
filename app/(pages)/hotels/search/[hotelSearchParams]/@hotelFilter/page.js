import { HotelsFilter } from "@/components/pages/hotels.search/sections/HotelsFilter";
import { getHotelDefaultFilterValues } from "@/lib/services/hotels";
import extractFiltersObjFromSearchParams from "@/lib/helpers/hotels/extractFiltersObjFromSearchParams";
import validateHotelSearchFilter from "@/lib/zodSchemas/hotelSearchFilterValidation";

async function HotelFilterPage({ params }) {
  const decodedSp = decodeURIComponent(params.hotelSearchParams);
  const spObj = Object.fromEntries(new URLSearchParams(decodedSp));
  const filtersParams = extractFiltersObjFromSearchParams(spObj);
  const validatedFilters = validateHotelSearchFilter(filtersParams);
  const defaultFilterValuesPromise = getHotelDefaultFilterValues();
  return (
    <HotelsFilter
      filters={validatedFilters?.data || {}}
      hotelSearchParams={spObj}
      defaultFilterValuesPromise={defaultFilterValuesPromise}
    />
  );
}

export default HotelFilterPage;

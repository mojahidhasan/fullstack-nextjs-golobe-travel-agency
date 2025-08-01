import { FlightsFilter } from "@/components/pages/flights.search/sections/FlightFilter";
import { getManyDocs } from "@/lib/db/getOperationDB";
import { multiSegmentCombinedFareBreakDown } from "@/lib/db/schema/flightItineraries";
import { parseFlightSearchParams } from "@/lib/utils";
import validateFlightSearchFilter from "@/lib/zodSchemas/flightSearchFilterValidation";
import { endOfDay, startOfDay } from "date-fns";
import { getTimezoneOffset } from "date-fns-tz";
import { cookies } from "next/headers";
async function FlightFilterPage({ params }) {
  const decoded = decodeURIComponent(params.query);
  const pObj = Object.fromEntries(new URLSearchParams(decoded));
  const parsedSearchParams = parseFlightSearchParams(pObj);
  const {
    from,
    to,
    tripType,
    desiredDepartureDate,
    desiredReturnDate,
    class: flightClass,
    passengers,
  } = parsedSearchParams;

  const timeZone = cookies().get("timeZone")?.value || "UTC";

  const departureDate = new Date(desiredDepartureDate);
  const zoneOffset = getTimezoneOffset(timeZone, departureDate);

  const flightResults = await getManyDocs(
    "FlightItinerary",
    {
      departureAirportId: from.iataCode,
      arrivalAirportId: to.iataCode,
      date: {
        $gte: startOfDay(departureDate).getTime() - zoneOffset,
        $lte: endOfDay(departureDate).getTime() - zoneOffset,
      },
      status: "scheduled",
    },
    ["flights"],
  );

  const totalFares = [];
  const airlines = new Set();
  flightResults.forEach((flight) => {
    const { total } = multiSegmentCombinedFareBreakDown(
      flight.segmentIds,
      {
        adult: passengers.adults,
        child: passengers.children,
        infant: passengers.infants,
      },
      flightClass,
    );

    totalFares.push(total);
    airlines.add(flight.carrierInCharge._id);
  });

  const minFare = Math.min(...totalFares) || 0;
  const maxFare = Math.max(...totalFares) || 0;

  const defaultFilterObj = {
    priceRange: [Math.floor(minFare), Math.ceil(maxFare)],
    airlines: Array.from(airlines),
  };

  const filterSearchParams = Object.entries(pObj).filter(([key]) =>
    key.startsWith("filter_"),
  );
  const filters = {};

  filterSearchParams.forEach(([key, value]) => {
    const filterKey = key.split("filter_")[1];
    let filterValue = value.split(",").filter(Boolean);
    if (filterKey === "priceRange" || filterKey === "departureTime") {
      filterValue = filterValue
        .map((v) => parseInt(v))
        .filter((v) => v === 0 || !isNaN(v));
    }

    if (filterKey === "rates") {
      filterValue = [...new Set(filterValue)].map(String);
    }

    if (filterValue.length > 0) {
      filters[filterKey] = filterValue;
    }
  });

  const validatedFilters = validateFlightSearchFilter(filters);

  return (
    <FlightsFilter
      filters={validatedFilters.data || {}}
      defaultFilterObj={defaultFilterObj}
      query={params.query}
    />
  );
}

export default FlightFilterPage;

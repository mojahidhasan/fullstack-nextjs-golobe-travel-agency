import { FlightsFilter } from "@/components/pages/flights.search/sections/FlightFilter";
import { getFlights } from "@/lib/controllers/flights";
import { getManyDocs } from "@/lib/db/getOperationDB";
import { multiSegmentCombinedFareBreakDown } from "@/lib/db/schema/flightItineraries";
import { parseFlightSearchParams } from "@/lib/utils";
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

  const filterObj = {
    defaultPriceRange: [Math.floor(minFare), Math.ceil(maxFare)],
    airlines: Array.from(airlines),
  };

  return <FlightsFilter filterObj={filterObj} />;
}

export default FlightFilterPage;

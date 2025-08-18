import { unstable_cache } from "next/cache";
import { Airport } from "../db/models";

export async function getPopularFlightDestinations(flightsCount = 10) {
  const flights = await getRandomAirports(flightsCount);

  return flights;
}

export const getRandomAirports = unstable_cache(
  async (sampleFlightCount = 10) => {
    //TODO: get popular route flights from GDS API

    return await Airport.aggregate([{ $sample: { size: sampleFlightCount } }]);
  },
  ["popularFlightDestinations"],
  {
    revalidate: false, // 1 day
    tags: ["popularFlightDestinations"],
  },
);

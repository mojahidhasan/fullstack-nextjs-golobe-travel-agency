import { unstable_cache } from "next/cache";
import { getFlightsByFlightIds } from "../getOperationDB";

const revalidate = +process.env.REVALIDATION_TIME || 600;

const getFlightsByFlightIdsCached = unstable_cache(
  async (flightIdArr) => getFlightsByFlightIds(flightIdArr),
  ["favourite_flights"],
  {
    revalidate,
    tags: ["favourite_flights"],
  }
);

export { getFlightsByFlightIdsCached };

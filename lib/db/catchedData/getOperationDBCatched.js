import { unstable_cache } from "next/cache";
import {
  getUserById,
  getUserDetailsByUserId,
  getFlightById,
  getFlightsByFlightIds,
  getFlightsByDepartAndArriveAirportIataCode,
  getFlightReviews,
} from "../getOperationDB";

const revalidate = +process.env.REVALIDATION_TIME || 600;

const getUserByIdCatched = unstable_cache(
  async (id) => getUserById(id),
  ["user"],
  {
    revalidate,
    tags: ["user"],
  }
);

const getUserDetailsByUserIdCached = unstable_cache(
  async (useId) => getUserDetailsByUserId(useId),
  ["user_details"],
  {
    revalidate,
    tags: ["user_details"],
  }
);

const getFlightByIdCached = unstable_cache(
  (flightId) => getFlightById(flightId),
  ["flight"],
  {
    revalidate,
    tags: ["flight"],
  }
);

const getFlightsByFlightIdsCached = unstable_cache(
  async (flightIdArr) => getFlightsByFlightIds(flightIdArr),
  ["favourite_flights"],
  {
    revalidate,
    tags: ["favourite_flights"],
  }
);

const getFlightsByDepartAndArriveAirportIataCodeCatched = unstable_cache(
  ({ originAirportCode, destinationAirportCode }) =>
    getFlightsByDepartAndArriveAirportIataCode({
      originAirportCode,
      destinationAirportCode,
    }),
  ["flights"],
  { revalidate, tags: ["flights"] }
);

const getFlightReviewsCatched = unstable_cache(
  async ({ flightId }) => getFlightReviews({ flightId }),
  ["flight_reviews"],
  { revalidate, tags: ["flight_reviews"] }
);
export {
  getUserByIdCatched,
  getUserDetailsByUserIdCached,
  getFlightByIdCached,
  getFlightsByFlightIdsCached,
  getFlightsByDepartAndArriveAirportIataCodeCatched,
  getFlightReviewsCatched,
};

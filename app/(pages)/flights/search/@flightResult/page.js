import { FLightResult } from "@/components/pages/flights.search/sections/FlightResult";
import { auth } from "@/lib/auth";
import {
  getFlightsByDepartAndArriveAirportIataCodeCatched,
  getUserDetailsByUserIdCached,
} from "@/lib/db/catchedData/getOperationDBCatched";
import { getFlightReviews, getManyDocs } from "@/lib/db/getOperationDB";
import { ratingScale } from "@/data/ratingScale";
async function FLightResultPage({ searchParams }) {
  const departureAirportId = searchParams.departureAirportCode;
  const arrivalAirportId = searchParams.arrivalAirportCode;

  const flights = await getManyDocs("Flight", {
    expireAt: { $gt: new Date() },
  });

  const session = await auth();
  let flightResults = await getFlightsByDepartAndArriveAirportIataCodeCatched(
    searchParams
  );
  if (session?.user?.id) {
    const userDetails = await getUserDetailsByUserIdCached(session?.user?.id);

    flightResults = flightResults.map((flight) => {
      return {
        ...flight,
        liked: userDetails?.likes?.flights?.includes(flight._id),
      };
    });
  }

  flightResults = await Promise.all(
    flightResults.map(async (flight) => {
      const reviews = await getFlightReviews({ flightId: flight._id });

      const totalRating = reviews.reduce((acc, review) => {
        return acc + review.rating;
      }, 0);

      return {
        ...flight,
        reviews: reviews.length,
        rating: reviews.length
          ? (totalRating / reviews.length).toFixed(1)
          : "N/A",
        ratingScale:
          ratingScale[Math.floor(totalRating / reviews.length)] || "N/A",
      };
    })
  );

  if (flightResults?.error) {
    return <div className={"text-center font-bold"}>{flightResults.error}</div>;
  }
  if (flightResults?.length < 1) {
    return <div className={"text-center font-bold"}>No data found</div>;
  }

  return <FLightResult flightResults={flightResults} />;
}

export default FLightResultPage;

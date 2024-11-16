import { FavouritesFlightAndPlacesTab } from "@/components/pages/favourites/ui/FavouritsTab";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

import { getManyDocs, getOneDoc } from "@/lib/db/getOperationDB";
import { RATING_SCALE } from "@/lib/constants";
export default async function FavouritesPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login?callbackPath=" + encodeURIComponent("/favourites"));
  }

  const userDetails = await getOneDoc("User", { _id: session?.user?.id });

  let favouriteFlights = [];
  let favouriteHotels = [];

  if (userDetails.likes.flights.length > 0) {
    favouriteFlights = await Promise.all(
      userDetails.likes.flights.map(async (flight) => {
        const flightDetails = await getOneDoc("Flight", {
          flightNumber: flight.flightNumber,
        });
        const flightReviews = await getManyDocs("FlightReview", {
          airlineId: flight.airlineId,
          departureAirportId: flight.departureAirportId,
          arrivalAirportId: flight.arrivalAirportId,
        });
        const ratingSum = flightReviews.reduce((acc, review) => {
          return acc + review.rating;
        }, 0);
        return {
          ...flightDetails,
          price: flightDetails.price[flight.flightClass].base,
          flightClass: flight.flightClass,
          totalReviews: flightReviews.length,
          rating: flightReviews.length
            ? (ratingSum / flightReviews.length).toFixed(1)
            : "N/A",
          ratingScale:
            RATING_SCALE[Math.floor(ratingSum / flightReviews.length)] || "N/A",
          liked: true,
          expired: new Date(flight.expireAt).getTime() < new Date().getTime(),
        };
      })
    );
  }

  // will be added later
  // if (userDetails.likes.hotels.length > 0) {
  //   favouriteHotels = await getHotelssByHoteIdsCached(
  //     userDetails.likes.hotels
  //   );
  // }

  return (
    <main className={"mx-auto mb-[90px] w-[95%] sm:w-[90%]"}>
      <h1 className={"text-[2rem] my-10 font-bold"}>Favourites</h1>
      <FavouritesFlightAndPlacesTab
        favouriteFlights={favouriteFlights}
        favouriteHotels={favouriteHotels}
      />
    </main>
  );
}

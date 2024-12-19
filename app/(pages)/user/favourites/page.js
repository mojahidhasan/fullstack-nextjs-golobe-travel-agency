import { FavouritesFlightAndPlacesTab } from "@/components/pages/favourites/ui/FavouritsTab";
import { auth } from "@/lib/auth";

import { getManyDocs, getOneDoc } from "@/lib/db/getOperationDB";
import { redirect } from "next/navigation";
import { RATING_SCALE } from "@/lib/constants";
import routes from "@/data/routes.json";
export default async function FavouritesPage() {
  const session = await auth();
  const isLoggedIn = !!session?.user?.id;

  if (!isLoggedIn) {
    return redirect(
      routes.login.path +
        "?callbackPath=" +
        encodeURIComponent(routes.favourites.path)
    );
  }

  if (isLoggedIn) {
    const userDetails = await getOneDoc("User", { _id: session?.user?.id }, [
      "userDetails",
    ]);

    let favouriteFlights = [];
    let favouriteHotels = [];

    if (userDetails.likes.flights.length > 0) {
      // eslint-disable-next-line no-undef
      favouriteFlights = await Promise.all(
        userDetails.likes.flights.map(async (flight) => {
          const flightDetails = await getOneDoc(
            "Flight",
            {
              _id: flight.flightId,
            },
            [flight.flightId, "flights", flight.flightNumber]
          );
          if (Object.keys(flightDetails).length === 0) return;
          const flightReviews = await getManyDocs(
            "FlightReview",
            {
              airlineId: flightDetails.stopovers[0].airlineId._id,
              departureAirportId: flightDetails.originAirportId._id,
              arrivalAirportId: flightDetails.destinationAirportId._id,
              airplaneModelName: flightDetails.stopovers[0].airplaneId.model,
            },
            [
              flight.flightNumber + "_review",
              "flightReviews",
              flight._id + "_review",
            ]
          );
          const ratingSum = flightReviews.reduce((acc, review) => {
            return +acc + +review.rating;
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
              RATING_SCALE[Math.floor(ratingSum / flightReviews.length)] ||
              "N/A",
            liked: true,
            expired: new Date(flight.expireAt).getTime() < new Date().getTime(),
          };
        })
      );
    }

    favouriteFlights = favouriteFlights.filter(Boolean);
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
}

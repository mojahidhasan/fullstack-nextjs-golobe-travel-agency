import { FavouritesFlightAndPlacesTab } from "@/components/pages/favourites/ui/FavouritsTab";
import { auth } from "@/lib/auth";

import { getManyDocs, getOneDoc } from "@/lib/db/getOperationDB";
import { redirect } from "next/navigation";
import { RATING_SCALE } from "@/lib/constants";
import routes from "@/data/routes.json";
import { cookies } from "next/headers";
import { flightRatingCalculation } from "@/lib/helpers/flights/flightRatingCalculation";
import { parseFlightSearchParams, passengerStrToObject } from "@/lib/utils";
import { getFlight } from "@/lib/controllers/flights";

export default async function FavouritesPage() {
  const session = await auth();
  const isLoggedIn = !!session?.user?.id;

  if (!isLoggedIn) {
    return redirect(
      routes.login.path +
        "?callbackPath=" +
        encodeURIComponent(routes.favourites.path),
    );
  }

  const userDetails = await getOneDoc("User", { _id: session?.user?.id }, [
    "userDetails",
  ]);

  const timeZone = cookies().get("timeZone")?.value || "UTC";

  let favouriteFlights = [];
  let favouriteHotels = [];

  if (userDetails?.flights?.bookmarked?.length > 0) {
    const flightSearchState = parseFlightSearchParams(
      cookies().get("flightSearchState").value,
    );
    // eslint-disable-next-line no-undef
    favouriteFlights = await Promise.all(
      userDetails.flights.bookmarked.map(async (flight) => {
        const flightDetails = flight.flightId;

        if (Object.keys(flightDetails).length === 0) return;

        let currentDepartureAirport = flightDetails.departureAirportId._id,
          currentArrivalAirport = flightDetails.arrivalAirportId._id,
          currentDepartureAirline = flightDetails.carrierInCharge._id;

        const flightReviews = await getManyDocs(
          "FlightReview",
          {
            airlineId: currentDepartureAirline,
            departureAirportId: currentDepartureAirport,
            arrivalAirportId: currentArrivalAirport,
            airplaneModelName: flightDetails.segmentIds[0].airplaneId.model,
          },
          ["flightReviews"],
        );

        let ratingReviews = {
          totalReviews: 0,
          rating: 0.0,
        };

        const rating = flightRatingCalculation(flightReviews);

        ratingReviews.rating = rating;
        ratingReviews.totalReviews = flightReviews.length;

        const metaData = {
          flightClass: flight.searchState.class,
          timeZone,
          isBookmarked: true,
        };

        return {
          ...flightDetails,
          ratingReviews,
          metaData,
          searchState: flight.searchState,
        };
      }),
    );
  }

  favouriteFlights = favouriteFlights.filter(Boolean);

  if (userDetails?.hotels?.bookmarked.length > 0) {
    // eslint-disable-next-line no-undef
    favouriteHotels = await Promise.all(
      userDetails.likes.hotels.map(async (hotel) => {
        const hotelDetails = await getOneDoc(
          "Hotel",
          {
            _id: hotel,
          },
          [hotel, "hotels"],
        );
        if (Object.keys(hotelDetails).length === 0) return;
        const hotelReviews = await getManyDocs(
          "HotelReview",
          {
            hotelId: hotelDetails._id,
          },
          [hotel._id + "_review", "hotelReviews"],
        );

        const totalReviewsCount = hotelReviews.length;
        const rating = hotelReviews.reduce((acc, review) => {
          return +acc + +review.rating;
        }, 0);
        const ratingScale =
          RATING_SCALE[Math.floor(rating / totalReviewsCount)];
        const cheapestRoom = [...hotelDetails.rooms].sort((a, b) => {
          const aPrice =
            +a.price.base +
            +a.price.taxe -
            +a.price.discount +
            +a.price.serviceFee;
          const bPrice =
            +b.price.base +
            +b.price.taxe -
            +b.price.discount +
            +b.price.serviceFee;
          return aPrice - bPrice;
        })[0];
        return {
          _id: hotelDetails._id,
          slug: hotelDetails.slug,
          name: hotelDetails.name,
          address: Object.values(hotelDetails.address).join(", "),
          amenities: hotelDetails.amenities.slice(0, 5),
          price: cheapestRoom.price,
          availableRooms: hotelDetails.rooms.length,
          rating: totalReviewsCount ? rating.toFixed(1) : "N/A",
          totalReviews: totalReviewsCount,
          ratingScale: ratingScale || "N/A",
          image: hotelDetails.images[0],
          liked: true,
        };
      }),
    );
  }

  return (
    <main className={"mx-auto mb-[90px] w-[95%] sm:w-[90%]"}>
      <h1 className={"my-10 text-[2rem] font-bold"}>Favourites</h1>
      <FavouritesFlightAndPlacesTab
        favouriteFlights={favouriteFlights}
        favouriteHotels={favouriteHotels}
      />
    </main>
  );
}

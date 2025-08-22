import { FavouritesFlightAndPlacesTab } from "@/components/pages/favourites/ui/FavouritsTab";
import { auth } from "@/lib/auth";

import { getManyDocs, getOneDoc } from "@/lib/db/getOperationDB";
import { redirect } from "next/navigation";
import { RATING_SCALE } from "@/lib/constants";
import routes from "@/data/routes.json";
import { cookies } from "next/headers";
import { flightRatingCalculation } from "@/lib/helpers/flights/flightRatingCalculation";
import { isObject } from "@/lib/utils";
import { getAvailableSeats } from "@/lib/services/flights";
import { getUserDetails } from "@/lib/services/user";
import { hotelPriceCalculation } from "@/lib/helpers/hotels/priceCalculation";
import { strToObjectId } from "@/lib/db/utilsDB";

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

  const userDetails = await getUserDetails(session?.user?.id);

  const timeZone = cookies().get("timeZone")?.value || "UTC";

  let favouriteFlights = [];
  let favouriteHotels = [];

  if (userDetails?.flights?.bookmarked?.length > 0) {
    // eslint-disable-next-line no-undef
    favouriteFlights = await Promise.all(
      userDetails.flights.bookmarked?.map(async (flight) => {
        const flightDetails = flight?.flightId;
        if (
          !flightDetails ||
          (isObject(flightDetails) && Object.keys(flightDetails).length === 0)
        )
          return;

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
          isExpired: new Date(flightDetails.expireAt) < new Date(),
        };

        const availableSeats = flightDetails.segmentIds.map(async (segment) => {
          const seats = await getAvailableSeats(
            segment._id,
            flight.searchState.class,
            0,
          );
          return {
            segmentId: segment._id,
            availableSeats: seats.length,
          };
        });
        return {
          ...flightDetails,
          ratingReviews,
          metaData,
          searchState: flight.searchState,
          availableSeatsCount: await Promise.all(availableSeats),
        };
      }),
    );
    favouriteFlights = favouriteFlights.filter(Boolean);
  }

  favouriteFlights = favouriteFlights.filter(Boolean);

  if (userDetails?.hotels?.bookmarked.length > 0) {
    // eslint-disable-next-line no-undef
    favouriteHotels = await Promise.all(
      userDetails.hotels.bookmarked.map(async (hotel) => {
        const hotelDetails = await getOneDoc(
          "Hotel",
          {
            _id: strToObjectId(hotel),
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
          const aPrice = hotelPriceCalculation(a.price, 1);
          const bPrice = hotelPriceCalculation(b.price, 1);
          return aPrice.total - bPrice.total;
        })[0];
        return {
          _id: hotelDetails._id,
          slug: hotelDetails.slug,
          name: hotelDetails.name,
          address: Object.values(hotelDetails.address).join(", "),
          amenities: hotelDetails.amenities.slice(0, 5),
          price: cheapestRoom.price,
          availableRooms: hotelDetails.rooms.length,
          rating: rating,
          totalReviews: totalReviewsCount,
          ratingScale: ratingScale || "N/A",
          image: hotelDetails.images[0],
          liked: true,
        };
      }),
    );

    favouriteHotels = favouriteHotels.filter(Boolean);
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

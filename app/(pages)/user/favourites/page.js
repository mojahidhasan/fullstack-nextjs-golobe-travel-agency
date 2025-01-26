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
    if (userDetails.likes.hotels.length > 0) {
      // eslint-disable-next-line no-undef
      favouriteHotels = await Promise.all(
        userDetails.likes.hotels.map(async (hotel) => {
          const hotelDetails = await getOneDoc(
            "Hotel",
            {
              _id: hotel,
            },
            [hotel, "hotels"]
          );
          if (Object.keys(hotelDetails).length === 0) return;
          const hotelReviews = await getManyDocs(
            "HotelReview",
            {
              hotelId: hotelDetails._id,
            },
            [hotel._id + "_review", "hotelReviews"]
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
        })
      );
    }

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

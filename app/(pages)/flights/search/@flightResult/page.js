import { FLightResult } from "@/components/pages/flights.search/sections/FlightResult";
import { auth } from "@/lib/auth";
import { getManyDocs, getOneDoc } from "@/lib/db/getOperationDB";
import { RATING_SCALE } from "@/lib/constants";
import { addMilliseconds, endOfDay, startOfDay } from "date-fns";
import { objDeepCompare } from "@/lib/utils";
import { cookies } from "next/headers";
async function FLightResultPage({ searchParams }) {
  let flightResults = [];
  let searchParamsObj = {};

  const searchParamsSchema = z
    .object({
      departureAirportCode: z
        .string()
        .trim()
        .min(3, "Invalid airport code")
        .max(3, "Invalid airport code"),
      arrivalAirportCode: z.string().trim().min(3).max(3),
      tripType: z.enum(["one_way", "round_trip", "multi_city"]),
      desiredDepartureDate: z
        .string("Date is required")
        .datetime("Invalid date string"),
      desiredReturnDate: z.string("Date is required").optional(),
      class: z.enum(["economy", "premium_economy", "business", "first"]),
      passengers: z
        .string()
        .trim()
        .regex(/adult-\d+_child-\d+_infant-\d+/, "Invalid passengers format"),
    })
    .safeParse(searchParams);

  if (searchParamsSchema.success) {
    if (searchParamsSchema.success.tripType !== "one_way") {
      const desiredReturnDateValidation = z
        .object({
          desiredReturnDate: z
            .string("Date is required")
            .datetime("Invalid date string"),
        })
        .safeParse(searchParams.desiredReturnDate);
      if (desiredReturnDateValidation.success) {
        searchParamsSchema.data.desiredReturnDate =
          desiredReturnDateValidation.data.desiredReturnDate;
      }
    }
    searchParamsObj = searchParamsSchema.data;
  }

  const {
    departureAirportCode,
    arrivalAirportCode,
    tripType,
    desiredDepartureDate,
    desiredReturnDate,
    class: flightClass,
    passengers,
  } = searchParamsObj;

  const departureDate = new Date(desiredDepartureDate);
  const returnDate = new Date(desiredReturnDate);

    flightResults = (
      await getManyDocs(
        "Flight",
        {
          expireAt: {
            $gte: departDateFrom,
            $lte: departDateTo,
          },
          originAirportId: departureAirportId,
          destinationAirportId: arrivalAirportId,
          ...(filters?.airlines &&
            Object.keys(filters.airlines).length > 0 && {
              "stopovers.0.airlineId": { $in: filters.airlines },
            }),
          ...(filters?.priceRange &&
            Object.keys(filters.priceRange).length > 0 && {
              [`price.${flightClass}.base`]: {
                $gte: filters?.priceRange[0],
                $lte: filters?.priceRange[1],
              },
            }),
        },
        ["flights"]
      )
    ).filter((flight) => {
      const seats = flight.seats;
      const availableSeats = seats.filter(
        (seat) => seat.class === flightClass && seat.availability === true
      );
      return availableSeats.length >= totalPassengers;
    });
  }
  const filt = flightResults.filter((flight) => {
    return flight.stopovers[0].airplaneId == null;
  });
  // return;
  if (session?.user?.id) {
    const likedFlights = (
      await getOneDoc("User", { _id: session?.user?.id }, ["userDetails"])
    ).likes.flights;
    flightResults = flightResults.map((flight) => {
      const flightFilterQuery = {
        flightId: flight._id,
        flightNumber: flight.flightNumber,
        flightClass: searchParams.class,
      };
      return {
        ...flight,
        liked: likedFlights.some((el) => objDeepCompare(flightFilterQuery, el)),
      };
    });
  }

  // eslint-disable-next-line no-undef
  flightResults = await Promise.all(
    flightResults.map(async (flight) => {
      const currentFlightReviews = await getManyDocs(
        "FlightReview",
        {
          airlineId: flight.stopovers[0].airlineId._id,
          departureAirportId: flight.originAirportId._id,
          arrivalAirportId: flight.destinationAirportId._id,
          airplaneModelName: flight.stopovers[0].airplaneId.model,
        },
        [
          flight.flightNumber + "_review",
          flight._id + "_review",
          "flightReviews",
        ]
      );
      const currentFlightRatingsSum = currentFlightReviews.reduce(
        (acc, review) => {
          return +acc + +review.rating;
        },
        0
      );

      const rating =
        +currentFlightRatingsSum / currentFlightReviews.length || 0;
      if (filters?.rates && Object.keys(filters.rates).length > 0) {
        if (!filters.rates.map(Number).includes(Math.floor(rating))) {
          return;
        }
      }
      return {
        ...flight,
        price: flight.price[searchParams.class].base,
        timezone,
        reviews: currentFlightReviews,
        totalReviews: currentFlightReviews.length,
        rating: currentFlightReviews.length ? rating.toFixed(1) : "N/A",
        ratingScale: RATING_SCALE[Math.floor(rating)] || "N/A",
        flightClass: searchParams.class,
      };
    })
  );
  flightResults = flightResults.filter(Boolean); // clearing undefined came due to filters.rates
  if (flightResults?.error) {
    return (
      <div className={"text-center grow font-bold"}>{flightResults.error}</div>
    );
  }
  if (flightResults?.length < 1) {
    return <div className={"text-center grow font-bold"}>No data found</div>;
  }

  return <FLightResult flightResults={flightResults} />;
}

export default FLightResultPage;

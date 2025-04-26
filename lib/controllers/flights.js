import "server-only";
import { getManyDocs, getOneDoc } from "../db/getOperationDB";
import { startOfDay, endOfDay } from "date-fns";
import { Flight } from "../db/models";
import { extractFlightPriceFromAirline } from "../helpers/flights/priceCalculations";
import { flightRatingCalculation } from "../helpers/flights/flightRatingCalculation";
import { objDeepCompare } from "../utils";
export async function getFlights(
  {
    departureAirportCode,
    arrivalAirportCode,
    departureDate,
    returnDate,
    tripType,
    flightClass,
    passengersObj,
  },
  airlinePrices = [],
  bookmarkedFlights = [],
) {
  let flightResults = await getManyDocs(
    "Flight",
    {
      "departure.airport": departureAirportCode,
      "arrival.airport": arrivalAirportCode,
      "departure.scheduled": {
        $gte: startOfDay(departureDate).getTime(),
        $lte: endOfDay(departureDate).getTime(),
      },
      status: "scheduled",
    },
    ["flights"],
  );

  if (Object.keys(flightResults).length === 0) {
    return [];
  }

  flightResults = flightResults.filter((flight) => {
    const seats = flight.seatAvailability;
    const availableSeats = seats.filter((seat) => {
      if (seat.reservation.reservationExpiresAt === null) {
        return true;
      }
      return seat.reservation.reservationExpiresAt < Date.now();
    });
    return (
      availableSeats.length >= passengersObj.adults + passengersObj.children
    );
  });

  //add price and rating reviews and other neccesary data
  // eslint-disable-next-line no-undef
  flightResults = await Promise.all(
    flightResults.map(async (flight) => {
      let price = {};

      let currentDepartureAirport = flight.departure.airport.iataCode,
        currentArrivalAirport = flight.arrival.airport.iataCode,
        currentDepartureAirline = flight.airlineId.iataCode;

      price = extractFlightPriceFromAirline(
        flight,
        airlinePrices,
        flightClass,
        passengersObj,
      );
      const flightReviews = await getManyDocs("FlightReview", {
        airlineId: currentDepartureAirline,
        departureAirportId: currentDepartureAirport,
        arrivalAirportId: currentArrivalAirport,
        airplaneModelName: flight.airplaneId.model,
      });

      let ratingReviews = {
        totalReviews: 0,
        rating: 0.0,
      };

      const rating = flightRatingCalculation(flightReviews);

      ratingReviews.rating = rating;
      ratingReviews.totalReviews = flightReviews.length;

      const isBookmarked = bookmarkedFlights.some((bFlight) => {
        const f = {
          flightId: flight._id,
          flightNumber: flight.flightNumber,
          flightClass: flightClass,
        };
        return objDeepCompare(f, bFlight);
      });
      return {
        ...flight,
        price,
        ratingReviews,
        isBookmarked,
      };

      /**
       * price = {
       *    basePrice: 100,
       *    discount: 10,
       *    serviceFee: 5,
       *    taxes: 5,
       *    total: 105
       *  }
       */
    }),
  );

  return flightResults;
}

export async function getFlight(
  { flightNumber, flightClass, passengersObj },
  airlinePrices = [],
) {
  const flight = await getOneDoc("Flight", { flightNumber: flightNumber }, [
    flightNumber,
  ]);

  if (Object.keys(flight).length === 0) {
    return {};
  }

  flight.price = extractFlightPriceFromAirline(
    flight,
    airlinePrices,
    flightClass,
    passengersObj,
  );

  return flight;
}

export async function getFlightDateRange() {
  try {
    const firstFlight = await Flight.findOne({
      expireAt: { $gte: new Date() },
    }).sort({ "departure.scheduled": 1 });
    const lastFlight = await Flight.findOne({}).sort({
      "departure.scheduled": -1,
    });
    return {
      success: true,
      data: {
        from: +firstFlight.departure.scheduled,
        to: +lastFlight.departure.scheduled,
      },
    };
  } catch (e) {
    console.log(e);
    return {
      success: false,
      message: "Failed to get flight date range",
    };
  }
}

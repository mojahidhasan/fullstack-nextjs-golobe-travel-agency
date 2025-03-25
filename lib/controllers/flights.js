import "server-only";
import { getManyDocs } from "../db/getOperationDB";
import { startOfDay, endOfDay } from "date-fns";
import { Flight } from "../db/models";
export async function getFlights({
  departureAirportCode,
  arrivalAirportCode,
  departureDate,
  returnDate,
  tripType,
  class: flightClass,
  passengers,
}) {
  let flightResults = await getManyDocs("Flight", {
    "departure.airport": departureAirportCode,
    "arrival.airport": arrivalAirportCode,
    "departure.scheduled": {
      $gte: startOfDay(departureDate).getTime(),
      $lte: endOfDay(departureDate).getTime(),
    },
    status: "scheduled",
  });

  flightResults = flightResults.filter((flight) => {
    const seats = flight.seatAvailability;
    const availableSeats = seats.filter((seat) => {
      if (seat.reservation.reservationExpiresAt === null) {
        return true;
      }
      return seat.reservation.reservationExpiresAt < Date.now();
    });
    return availableSeats.length >= passengers.adults + passengers.children;
  });

  return flightResults;
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

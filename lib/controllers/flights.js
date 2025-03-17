import { getManyDocs } from "../db/getOperationDB";
import { startOfDay, endOfDay } from "date-fns";
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

  const passengersObject = passengerStrToObject(passengers);

  flightResults = flightResults.filter((flight) => {
    const seats = flight.seatAvailability;
    const availableSeats = seats.filter((seat) => {
      if (seat.reservation.reservationExpiresAt === null) {
        return true;
      }
      return seat.reservation.reservationExpiresAt < Date.now();
    });
    return (
      availableSeats.length >= passengersObject.adult + passengersObject.child
    );
  });

  return flightResults;
}

export function passengerStrToObject(passengersStr) {
  const extractPassengers = {};
  passengersStr.split("_").forEach((el) => {
    const [key, val] = el.split("-");
    extractPassengers[key] = +val;
  });
  return extractPassengers;
}

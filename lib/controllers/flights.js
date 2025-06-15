import "server-only";
import { getManyDocs, getOneDoc } from "../db/getOperationDB";
import { startOfDay, endOfDay } from "date-fns";
import { Flight } from "../db/models";
import { flightRatingCalculation } from "../helpers/flights/flightRatingCalculation";
import { objDeepCompare } from "../utils";
import { updateOneDoc } from "../db/updateOperationDB";
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

  flightResults = flightResults.filter(async (flight) => {
    const { availableSeats } = await getReservedAndAvailableSeats(
      flight.flightNumber,
      flightClass,
    );
    return (
      availableSeats.length >= passengersObj.adults + passengersObj.children
    );
  });

  //add price and rating reviews and other neccesary data
  // eslint-disable-next-line no-undef
  flightResults = await Promise.all(
    flightResults.map(async (flight) => {
      let currentDepartureAirport = flight.departure.airport.iataCode,
        currentArrivalAirport = flight.arrival.airport.iataCode,
        currentDepartureAirline = flight.airlineId.iataCode;

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

  return flight;
}

export async function getAvailableFlightDateRange() {
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
        from: +firstFlight?.departure.scheduled || 0,
        to: +lastFlight?.departure.scheduled || 0,
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

export async function getAllFlightBookings(userId) {
  if (!userId) throw new Error("User id is required");
  try {
    const flightBookings = await getManyDocs("FlightBooking", {
      userId: userId,
    });
    return flightBookings;
  } catch (e) {
    console.log(e);
    throw e;
  }
}

export async function getConfirmedFlightBookings(flightNumber) {
  try {
    const flightBookings = await getManyDocs("FlightBooking", {
      "flightSnapshot.flightNumber": flightNumber,
      bookingStatus: "confirmed",
      paymentStatus: "paid",
    });
    return flightBookings;
  } catch (e) {
    console.log(e);
    throw e;
  }
}

/**
 * @description
 * Get all confirmed seats for a given flight.
 * @param {string} flightNumber
 * @param {object} [seatClass]
 * @returns {Promise<{ reservedSeats: Array, availableSeats: Array }>}
 */
export async function getReservedAndAvailableSeats(flightNumber, seatClass) {
  if (flightNumber === undefined) {
    throw new Error("Flight number is required");
  }
  try {
    const flightBookings = await getManyDocs("FlightBooking", {
      "flightSnapshot.flightNumber": flightNumber,
      bookingStatus: ["pending", "canceled", "refunded"],
    });

    const alreadyReservedSeats = [];
    for (const flightBooking of flightBookings) {
      for (const seat of flightBooking.seats) {
        const reservationType = seat.reservation.type;
        let isReserved = false;
        if (flightBooking.bookingStatus === "pending") {
          isReserved =
            reservationType === "temporary" &&
            seat.reservation.expiresAt > Date.now();
        }
        if (isReserved) {
          alreadyReservedSeats.push(seat);
        }
      }
    }

    let flightSeats = flightBookings?.[0]?.flightSnapshot?.seats;

    if (!flightSeats) {
      const flight = await getOneDoc("Flight", { flightNumber: flightNumber });
      if (Object.keys(flight).length === 0) {
        throw new Error("Flight not found");
      }
      flightSeats = flight?.seats;
    }
    const alreadyReservedSeatNumbers = alreadyReservedSeats.map(
      (seat) => seat.seatNumber,
    );
    const availableSeats = flightSeats.filter((seat) => {
      return !alreadyReservedSeatNumbers.includes(seat.seatNumber);
    });

    if (seatClass) {
      return {
        reservedSeats: alreadyReservedSeats.filter((seat) => {
          return seat.class === seatClass;
        }),
        availableSeats: availableSeats.filter((seat) => {
          return seat.class === seatClass;
        }),
      };
    }

    return {
      reservedSeats: alreadyReservedSeats,
      availableSeats: availableSeats,
    };
  } catch (e) {
    console.log(e);
    throw e;
  }
}

export async function getExpiredTemporarylyReservedSeats(
  flightNumber,
  seatClass,
) {
  if (flightNumber === undefined) throw Error("FlightNumber is required");

  try {
    const pendingFlightBookings = await getManyDocs("FlightBooking", {
      "flightSnapshot.flightNumber": flightNumber,
      bookingStatus: ["pending"],
    });

    const temporaryReserveExpiredSeats = [];
    for (const flightBooking of pendingFlightBookings) {
      for (const seat of flightBooking.seats) {
        const reservationType = seat.reservation.type;
        const isExpired =
          reservationType === "temporary" &&
          seat.reservation.expiresAt < Date.now();
        if (isExpired) {
          temporaryReserveExpiredSeats.push(seat);
        }
      }
    }
    if (seatClass) {
      return temporaryReserveExpiredSeats.filter((seat) => {
        return seat.class === seatClass;
      });
    }
    return temporaryReserveExpiredSeats;
  } catch (e) {
    console.log(e);
  }
}

export async function findSeatsInBooking(flightNumber, seatNumber) {
  if (typeof flightNumber !== "string")
    throw Error(
      `Provide flightNumber as string. Provided as ${typeof flightNumber}`,
    );

  if (typeof seatNumber !== "string")
    throw Error(
      `Provide seattNumber as string. Provided as ${typeof seatNumber}`,
    );

  const flightBooking = await getManyDocs("FlightBooking", {
    "flightSnapshot.flightNumber": flightNumber,
    "seats.seatNumber": seatNumber,
  });

  const seats = flightBooking.map((booking) => {
    return booking.seats;
  });
  return seats.flat();
}

export async function isSeatTakenByElse(flightNumber, seatData) {
  const type = seatData.reservation.type;
  if (
    (type === "temporary" && +seatData.reservation.expiresAt > Date.now()) ||
    type === "permanent"
  ) {
    return false;
  }

  const seats = await findSeatsInBooking(flightNumber, seatData.seatNumber);

  const exlcudeYourSeat = seats.filter((seat) => {
    return seat.reservation.for !== seatData.reservation.for;
  });

  for (const seat of exlcudeYourSeat) {
    if (
      (seat.reservation.type === "temporary" &&
        +seat.reservation.expiresAt > Date.now()) ||
      seat.reservation.type === "permanent"
    ) {
      return true;
    }
  }

  return false;
}

export async function cancelBooking(bookingRef, userId, cancellationData) {
  try {
    const flightBooking = await getOneDoc("FlightBooking", {
      bookingRef: bookingRef,
      userId: userId,
    });

    if (Object.keys(flightBooking).length === 0) {
      throw new Error("Flight booking not found");
    }

    await updateOneDoc(
      "FlightBooking",
      { _id: flightBooking._id },
      {
        $set: { bookingStatus: "canceled", cancellationInfo: cancellationData },
      },
    );

    return {
      success: true,
      message: "Flight booking canceled successfully",
    };
  } catch (e) {
    console.log(e);
    throw e;
  }
}

export async function assignSeatsToFlightBooking(
  flightBookingId,
  reservationType,
  reservationExpiresAt = null,
) {
  try {
    const flightBooking = await getOneDoc("FlightBooking", {
      _id: flightBookingId,
    });

    if (Object.keys(flightBooking).length === 0) {
      throw new Error("Flight booking not found");
    }

    if (flightBooking.seats.length && reservationType === "permanent") {
      const updatedSeats = flightBooking.seats.map((s) => {
        return {
          ...s,
          reservation: {
            ...s.reservation,
            type: "permanent",
          },
        };
      });
      await updateOneDoc(
        "FlightBooking",
        { _id: flightBookingId },
        { $set: { seats: updatedSeats } },
      );

      return updatedSeats;
    }

    // eslint-disable-next-line no-undef
    const passengers = await Promise.all(
      flightBooking.passengers.map((id) => {
        return getOneDoc("Passenger", { _id: id });
      }),
    );

    const seats = await getReservedAndAvailableSeats(
      flightBooking.flightSnapshot.flightNumber,
    );

    const availableSeats = seats.availableSeats;

    const assignedSeats = [];

    for (const passenger of passengers) {
      let seat;

      const findEmptySeat = availableSeats.find((seat) => {
        return seat.class === passenger.seatClass && !seat.reservation.for;
      });
      if (findEmptySeat) {
        seat = findEmptySeat;
      } else {
        seat = availableSeats.find((seat) => {
          return seat.class === passenger.seatClass;
        });
      }

      if (seat) {
        assignedSeats.push({
          ...seat,
          reservation: {
            type: reservationType,
            expiresAt: reservationExpiresAt,
            for: passenger._id,
          },
          metaData: {
            flightBookingId: flightBookingId,
            pnr: flightBooking.bookingRef,
          },
        });
      }
    }

    const bookingsToCancel = assignedSeats.map(async (seat) => {
      const seatInfo = await findSeatsInBooking(
        flightBooking.flightSnapshot.flightNumber,
        seat.seatNumber,
      );

      seatInfo.forEach(async (s) => {
        try {
          await updateOneDoc(
            "FlightBooking",
            { _id: s.metaData.flightBookingId },
            { $set: { bookingStatus: "canceled" } },
          );
        } catch (e) {
          throw e;
        }
      });
    });
    // eslint-disable-next-line no-undef
    await Promise.all(bookingsToCancel);
    await updateOneDoc(
      "FlightBooking",
      { _id: flightBookingId },
      { $set: { seats: assignedSeats } },
    );

    return assignedSeats;
  } catch (e) {
    console.log(e);
    throw e;
  }
}

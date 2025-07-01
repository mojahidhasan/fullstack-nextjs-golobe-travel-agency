import "server-only";
import { getManyDocs, getOneDoc } from "../db/getOperationDB";
import { startOfDay, endOfDay, addYears } from "date-fns";
import { flightRatingCalculation } from "../helpers/flights/flightRatingCalculation";
import { updateOneDoc } from "../db/updateOperationDB";
import { getTimezoneOffset } from "date-fns-tz";
import { FlightItinerary, FlightSeat } from "../db/models";
import { strToObjectId } from "../db/utilsDB";
import { revalidateTag } from "next/cache";
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
  metaData = {},
) {
  const zoneOffset = getTimezoneOffset(metaData.timeZone, departureDate);
  let flightResults = await getManyDocs(
    "FlightItinerary",
    {
      departureAirportId: departureAirportCode,
      arrivalAirportId: arrivalAirportCode,
      date: {
        $gte: startOfDay(departureDate).getTime() - zoneOffset,
        $lte: endOfDay(departureDate).getTime() - zoneOffset,
      },
      status: "scheduled",
      expireAt: { $gte: Date.now() },
    },
    ["flights"],
  );

  if (Object.keys(flightResults).length === 0) {
    return [];
  }

  //add price and rating reviews and other neccesary data
  // eslint-disable-next-line no-undef
  flightResults = await Promise.all(
    flightResults.map(async (flight) => {
      let currentDepartureAirport = flight.departureAirportId._id,
        currentArrivalAirport = flight.arrivalAirportId._id,
        currentDepartureAirline = flight.carrierInCharge._id;

      const flightReviews = await getManyDocs(
        "FlightReview",
        {
          airlineId: currentDepartureAirline,
          departureAirportId: currentDepartureAirport,
          arrivalAirportId: currentArrivalAirport,
          airplaneModelName: flight.segmentIds[0].airplaneId.model,
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

      const isBookmarked = bookmarkedFlights.some((bFlight) => {
        return bFlight.flightId._id === flight._id;
      });

      const availableSeats = flight.segmentIds.map(async (segment) => {
        const seats = await getAvailableSeats(segment._id, flightClass, 0);
        return {
          segmentId: segment._id,
          availableSeats: seats.length,
        };
      });

      return {
        ...flight,
        ratingReviews,
        isBookmarked,
        availableSeatsCount: await Promise.all(availableSeats),
      };
    }),
  );

  flightResults = flightResults.filter((flight) => {
    return flight.availableSeatsCount.every(
      (seat) =>
        seat.availableSeats >= +passengersObj.adults + +passengersObj.children,
    );
  });

  return flightResults;
}

export async function getFlight(flightNumber, date) {
  const flight = await getOneDoc(
    "FlightItinerary",
    { flightCode: flightNumber, date: new Date(date) },
    ["flight"],
  );
  return flight;
}

export async function getAvailableFlightDateRange() {
  try {
    const firstFlight = await FlightItinerary.findOne({
      expireAt: { $gte: Date.now() },
    })
      .sort({ expireAt: 1 })
      .lean();
    const lastFlight = await FlightItinerary.findOne({
      expireAt: { $lte: Date.now() },
    })
      .sort({
        expireAt: -1,
      })
      .lean();
    return {
      success: true,
      data: {
        from:
          new Date(firstFlight?.expireAt)?.getTime() ||
          addYears(new Date(), 100).getTime(),
        to: new Date(lastFlight?.expireAt)?.getTime() || -1,
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

export async function getAllFlightBookings(userId, revalidate = 600) {
  if (!userId) throw new Error("User id is required");
  try {
    const flightBookings = await getManyDocs(
      "FlightBooking",
      {
        userId: userId,
      },
      ["userFlightBooking"],
      revalidate,
    );
    return flightBookings;
  } catch (e) {
    console.log(e);
    throw e;
  }
}

export async function getReservedSeats(segmentId, seatClass, revalidate = 600) {
  try {
    const flightSeats = await getManyDocs(
      "FlightSeat",
      {
        segmentId: segmentId,
        ...(seatClass && { class: seatClass }),
        $or: [
          { "reservation.type": "permanent" },
          {
            $and: [
              { "reservation.type": "temporary" },
              { "reservation.expiresAt": { $gt: Date.now() } },
            ],
          },
        ],
      },
      ["flightSeat"],
      revalidate,
    );
    return flightSeats;
  } catch (e) {
    console.log(e);
    throw e;
  }
}

export async function getAvailableSeats(
  segmentId,
  seatClass,
  revalidate = 600,
) {
  try {
    const flightSeats = await getManyDocs(
      "FlightSeat",
      {
        segmentId: segmentId.toString(),
        ...(seatClass && { class: seatClass }),
        $or: [
          { "reservation.type": null },
          {
            $and: [
              { "reservation.type": "temporary" },
              { "reservation.expiresAt": { $lt: Date.now() } },
            ],
          },
        ],
      },
      ["flightSeat"],
      revalidate,
    );

    return flightSeats;
  } catch (e) {
    console.log(e);
    throw e;
  }
}

export async function getExpiredTemporarylyReservedSeats(
  segmentId,
  seatClass,
  revalidate = 600,
) {
  if (segmentId === undefined) throw Error("FlightNumber is required");

  try {
    const reservedSeats = await getManyDocs(
      "FlightSeat",
      {
        segmentId: segmentId,
        ...(seatClass && { class: seatClass }),
        "reservation.type": "temporary",
        "reservation.expiresAt": { $lt: Date.now() },
      },
      ["flightSeat"],
      revalidate,
    );

    return reservedSeats;
  } catch (e) {
    console.log(e);
  }
}

export async function isSeatTakenByElse(seatId, currentPassengerId) {
  const seat = await getOneDoc(
    "FlightSeat",
    {
      _id: strToObjectId(seatId),
      $or: [
        { "reservation.for": strToObjectId(currentPassengerId) },
        { "reservation.for": null },
      ],
    },
    ["flightSeat"],
    0,
  );
  return Object.keys(seat).length === 0;
}

export async function cancelBooking(
  pnrCode,
  cancellationData = {},
  options = {},
) {
  try {
    await updateOneDoc(
      "FlightBooking",
      { pnrCode: pnrCode },
      {
        $set: {
          cancellationInfo: { ...cancellationData },
          ticketStatus: "canceled",
        },
      },
      options,
    );
  } catch (e) {
    console.log(e);
    throw e;
  } finally {
    revalidateTag("userFlightBooking");
  }
}

export async function assignSeatsToFlightBooking(
  bookingDbDoc,
  reservationType,
  reservationExpiresAt = null,
  session = null,
) {
  const flightBooking = bookingDbDoc;
  const pnrCode = flightBooking.pnrCode;

  if (Object.keys(flightBooking).length === 0) {
    throw new Error("Flight booking not found");
  }

  if (flightBooking.selectedSeats.length && reservationType === "permanent") {
    try {
      const updatedSeats = flightBooking.selectedSeats.map(
        async ({ passengerId, seatId }) => {
          await updateOneDoc(
            "FlightSeat",
            { _id: strToObjectId(seatId._id) },
            {
              $set: {
                reservation: {
                  type: "permanent",
                  for: strToObjectId(passengerId),
                  expiresAt: null,
                },
              },
            },
            { session: session },
          );
          return seatId;
        },
      );

      const seatIds = await Promise.all(updatedSeats);

      return seatIds;
    } catch (e) {
      throw e;
    } finally {
      revalidateTag("userFlightBooking");
      revalidateTag("flightSeat");
    }
  }

  const passengers = flightBooking.passengers;
  const segments = flightBooking.segmentIds;

  const selectedSeats = [];
  const bookingsToCancel = [];

  for (const segment of segments) {
    const segmentId = segment._id;
    const seats = [];
    const availableSeats = await getAvailableSeats(segmentId, null, 0);
    if (!availableSeats.length) throw new Error("No available seats");

    let unreservedSeats = availableSeats.filter((seat) => {
      return seat.reservation.type === null;
    });
    let expiredReservedSeats = availableSeats.filter((seat) => {
      return (
        seat.reservation.type === "temporary" &&
        +seat.reservation.expiresAt < Date.now()
      );
    });

    for (const passenger of passengers.filter(
      (p) => p.passengerType !== "infant",
    )) {
      const seat =
        unreservedSeats?.find(
          (s) =>
            s.class === passenger.seatClass &&
            seats.every((seat) => seat._id.toString() !== s._id.toString()),
        ) ??
        expiredReservedSeats?.find(
          (s) =>
            s.class === passenger.seatClass &&
            seats.every((p) => p._id.toString() !== s._id.toString()),
        );

      if (!seat) throw new Error("No available seats");
      if (seat.reservation.type === "temporary") {
        bookingsToCancel.push(seat.reservation.pnrCode);
      }

      seat.reservation = {
        pnrCode: flightBooking.pnrCode,
        for: passenger._id.toString(),
        type: reservationType,
        expiresAt: reservationExpiresAt,
      };

      seats.push(seat);
    }
    selectedSeats.push(...seats);
  }
  try {
    const flightBookingSelectedSeats = selectedSeats.map((s) => {
      return {
        passengerId: s.reservation.for,
        seatId: s._id,
      };
    });
    await updateOneDoc(
      "FlightBooking",
      { pnrCode: pnrCode },
      {
        $set: {
          selectedSeats: flightBookingSelectedSeats,
          guaranteedReservationUntil: new Date(reservationExpiresAt),
        },
      },
      { session: session },
    );

    const seatUpdates = selectedSeats.map((seat) => ({
      updateOne: {
        filter: { _id: seat._id.toString() },
        update: { $set: { reservation: seat.reservation } },
      },
    }));

    const bookingCancellation = bookingsToCancel.map(async (pnrCode) => {
      await cancelBooking(
        pnrCode,
        {
          canceledBy: "system",
          canceledAt: new Date(),
          reason:
            "Temporary reservation expired, thus taken by other passenger",
        },
        { session: session },
      );
    });

    await FlightSeat.bulkWrite(seatUpdates, { session: session });
    await Promise.all(bookingCancellation);

    return selectedSeats.map((s) => s._id);
  } catch (e) {
    throw e;
  } finally {
    revalidateTag("userFlightBooking");
    revalidateTag("flightSeat");
  }
}

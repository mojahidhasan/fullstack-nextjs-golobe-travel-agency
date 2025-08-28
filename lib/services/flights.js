import "server-only";
import { unstable_cache } from "next/cache";
import {
  FlightItinerary,
  FlightSeat,
  Airport,
  FlightBooking,
} from "../db/models";
import { getManyDocs, getOneDoc } from "../db/getOperationDB";
import { startOfDay, endOfDay, addYears } from "date-fns";
import { flightRatingCalculation } from "../helpers/flights/flightRatingCalculation";
import { updateOneDoc } from "../db/updateOperationDB";
import { getTimezoneOffset } from "date-fns-tz";
import { strToObjectId } from "../db/utilsDB";
import { revalidateTag } from "next/cache";
import { multiSegmentCombinedFareBreakDown } from "../db/schema/flightItineraries";
import { getRefundList, requestRefund } from "../paymentIntegration/stripe";

export async function getFlights(
  {
    departureAirportCode,
    arrivalAirportCode,
    departureDate,
    returnDate,
    tripType,
    flightClass,
    passengersObj,
    filters = {},
  },
  bookmarkedFlights = [],
  metaData = {},
) {
  const zoneOffset = getTimezoneOffset(metaData.timeZone, departureDate);

  const filterAirlines = filters?.airlines || [];
  const filterRatings = filters?.rates || [];
  const filterPriceRange = filters?.priceRange || [];
  const filterDepartureTime = filters?.departureTime || [];

  const oneDayInMillis = 24 * 60 * 60 * 1000;

  let flightResults = await getManyDocs(
    "FlightItinerary",
    {
      departureAirportId: departureAirportCode,
      arrivalAirportId: arrivalAirportCode,
      ...(filterAirlines.length > 0 && {
        carrierInCharge: { $in: filterAirlines },
      }),
      date: {
        $gte:
          startOfDay(departureDate).getTime() -
          zoneOffset +
          (filterDepartureTime[0] || 0),
        $lte:
          endOfDay(departureDate).getTime() -
          zoneOffset -
          (oneDayInMillis - (filterDepartureTime[1] || oneDayInMillis)),
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
      const fareBreakdown = multiSegmentCombinedFareBreakDown(
        flight.segmentIds,
        {
          adult: passengersObj.adults,
          child: passengersObj.children,
          infant: passengersObj.infants,
        },
        flightClass,
      );

      if (filterPriceRange[0] && filterPriceRange[1]) {
        if (
          fareBreakdown.total < filterPriceRange[0] ||
          fareBreakdown.total > filterPriceRange[1]
        ) {
          return null;
        }
      }

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

      if (filterRatings?.length > 0) {
        if (!filterRatings.includes(String(parseInt(rating)))) {
          return null;
        }
      }

      ratingReviews.rating = rating;
      ratingReviews.totalReviews = flightReviews.length;

      const isBookmarked = bookmarkedFlights.some((bFlight) => {
        return bFlight.flightId?._id === flight._id;
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
        fareBreakdowns: fareBreakdown,
      };
    }),
  );

  flightResults = flightResults.filter((flight) => {
    //filter nulls
    if (!flight) {
      return false;
    }

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
      expireAt: { $gte: Date.now() },
    })
      .sort({
        expireAt: -1,
      })
      .lean();
    return {
      success: true,
      message: "Success",
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
          ticketStatus: "cancelled",
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

export const getRandomAirports = unstable_cache(
  async (sampleFlightCount = 10) => {
    //TODO: get popular route flights from GDS API

    return await Airport.aggregate([{ $sample: { size: sampleFlightCount } }]);
  },
  ["popularFlightDestinations"],
  {
    revalidate: false, // 1 day
    tags: ["popularFlightDestinations"],
  },
);

export async function getPopularFlightDestinations(flightsCount = 10) {
  const flights = await getRandomAirports(flightsCount);

  return flights;
}

export async function getBookingStatusWithCancellationPolicy(pnrCode, userId) {
  const results = await FlightBooking.aggregate([
    {
      $match: {
        pnrCode,
        userId: strToObjectId(userId),
      },
    },
    {
      $lookup: {
        from: "flightitineraries",
        localField: "flightItineraryId",
        foreignField: "_id",
        as: "itinerary",
      },
    },
    { $unwind: "$itinerary" },
    {
      $lookup: {
        from: "airlines",
        localField: "itinerary.carrierInCharge",
        foreignField: "_id",
        as: "airline",
      },
    },
    { $unwind: "$airline" },
    {
      $project: {
        _id: 0,
        pnrCode: 1,
        userId: 1,
        paymentStatus: 1,
        ticketStatus: 1,
        departureDate: "$itinerary.date",
        cancellationPolicy: "$airline.airlinePolicy.cancellationPolicy",
      },
    },
  ]);

  return results[0] || null;
}

export async function refundPaymentFlightBooking(pnrCode, userId) {
  let chargeId = null;
  try {
    const booking = await getOneDoc(
      "FlightBooking",
      { pnrCode: pnrCode, userId: strToObjectId(userId) },
      ["userFlightBooking"],
    );
    chargeId = booking.paymentId?.stripe_chargeId;

    const refund = await requestRefund({
      charge: chargeId,
      reason: "requested_by_customer",
      metadata: {
        type: "flightBooking",
        flightBookingId: booking._id.toString(),
        pnrCode: booking.pnrCode,
        userId,
      },
    });

    // webhook will update the refund info in the booking

    return refund;
  } catch (e) {
    console.log(e);
    if (e.raw.code === "charge_already_refunded") {
      try {
        const refund = (await getRefundList(chargeId))[0];

        const refundInfoObj = {
          stripeRefundId: refund.id,
          status: "refunded",
          reason: refund.reason,
          currency: refund.currency,
          amount: refund.amount / 100,
          refundedAt: new Date(refund.created * 1000),
        };
        await updateOneDoc(
          "FlightBooking",
          { _id: strToObjectId(bookingId) },
          {
            $set: {
              paymentStatus: "refunded",
              bookingStatus: "cancelled",
              refundInfo: refundInfoObj,
            },
          },
        );
        revalidateTag("hotelBookings");
      } catch (e) {}
    }
    throw e;
  }
}

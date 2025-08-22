"use server";

import { cookies } from "next/headers";
import { auth } from "../auth";
import { getOneDoc } from "../db/getOperationDB";
import { nanoid, parseFlightSearchParams } from "../utils";
import { createOneDoc } from "../db/createOperationDB";
import validatePassengersDetailsAction from "./validatePassengerDetailsAction";
import validatePassengersPreferencesAction from "./validatePassengersPreferencesAction";
import createPassengersAction from "./createPassengersAction";
import { assignSeatsToFlightBooking } from "../services/flights";
import { multiSegmentCombinedFareBreakDown } from "../db/schema/flightItineraries";
import mongoose from "mongoose";
import { strToObjectId } from "../db/utilsDB";
import { revalidateTag } from "next/cache";

export async function flightReserveAction(prevState, formData) {
  const session = await auth();
  const loggedIn = !!session?.user;
  if (!loggedIn) return { success: false, message: "Please login first" };

  const data = Object.fromEntries(formData);
  let passengersDetails = JSON.parse(data.passengersDetails);
  let passengersPreferences = JSON.parse(data.passengersPreferences);
  const metaData = JSON.parse(data.metaData);

  const flightItinerary = await getOneDoc(
    "FlightItinerary",
    {
      flightCode: metaData.flightNumber,
      date: new Date(metaData.date),
    },
    ["flight"],
    0,
  );

  if (Object.keys(flightItinerary).length === 0)
    return { success: false, message: "Flight not found" };

  const reservedBooking = await getOneDoc(
    "FlightBooking",
    {
      flightItineraryId: strToObjectId(flightItinerary?._id),
      userId: strToObjectId(session.user.id),
      paymentStatus: "pending",
      ticketStatus: "pending",
    },
    ["userFlightBooking"],
    0,
  );

  if (Object.keys(reservedBooking).length > 0)
    return {
      success: false,
      message:
        "You have already reserved a flight of this flight number. Please cancel it or cofirm it first to book another flight",
    };

  if (passengersDetails.length === 0 || passengersPreferences.length === 0)
    return { success: false, message: "Please fill all the details first" };

  const pDetailsValidation =
    await validatePassengersDetailsAction(passengersDetails);
  const pPreferencesValidation = await validatePassengersPreferencesAction(
    passengersPreferences,
  );

  if (
    pDetailsValidation?.success === false ||
    pPreferencesValidation?.success === false
  ) {
    return {
      success: false,
      errors: {
        passengersPreferences: pPreferencesValidation?.errors,
        passengersDetails: pDetailsValidation?.errors,
      },
    };
  }
  const mongodbSession = await mongoose.startSession();
  mongodbSession.startTransaction();
  try {
    const searchState = JSON.parse(
      cookies().get("flightSearchState")?.value || "{}",
    );
    const { passengers: passengersCountObj, class: seatClass } =
      parseFlightSearchParams(searchState);

    if (Object.keys(searchState).length === 0) {
      return {
        success: false,
        message: "No search state found, please search again",
      };
    }
    const nanoId = (nanoid() + Date.now().toString(36)).toUpperCase();

    const passengers = await createPassengersAction(
      passengersDetails,
      passengersPreferences,
      mongodbSession,
    );

    if (passengers.success === false) return passengers;

    const reservationExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const passengersCount = {
      adult: passengersCountObj.adults,
      child: passengersCountObj.children,
      infant: passengersCountObj.infants,
    };

    const { fareBreakdowns, total } = multiSegmentCombinedFareBreakDown(
      flightItinerary.segmentIds,
      passengersCount,
      seatClass,
    );

    const bookingObj = {
      pnrCode: nanoId,
      userId: session.user.id,
      flightItineraryId: flightItinerary._id,
      segmentIds: flightItinerary.segmentIds,
      passengers: [...passengers.data],
      selectedSeats: [],
      paymentStatus: "pending",
      ticketStatus: "pending",
      fareBreakdown: fareBreakdowns,
      totalFare: total,
      paymentId: null,
      source: "web",
      userTimeZone: metaData.timeZone,
    };

    const booking = await createOneDoc("FlightBooking", bookingObj, {
      session: mongodbSession,
    });
    const assignedSeats = await assignSeatsToFlightBooking(
      booking,
      "temporary",
      reservationExpiresAt.getTime(),
      mongodbSession,
    );
    await mongodbSession.commitTransaction();
    return { success: true, message: "Reservation created successfully" };
  } catch (error) {
    console.log(error);
    if (mongodbSession.inTransaction()) await mongodbSession.abortTransaction();
    return { success: false, message: error.message };
  } finally {
    await mongodbSession.endSession();
    revalidateTag("userFlightBooking");
    revalidateTag("flightSeat");
  }
}

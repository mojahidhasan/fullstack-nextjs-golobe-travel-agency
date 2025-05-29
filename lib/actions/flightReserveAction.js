"use server";

import { cookies } from "next/headers";
import { auth } from "../auth";
import { getOneDoc } from "../db/getOperationDB";
import { nanoid } from "../utils";
import { createOneDoc } from "../db/createOperationDB";
import validatePassengersDetailsAction from "./validatePassengerDetailsAction";
import validatePassengersPreferencesAction from "./validatePassengersPreferencesAction";
import createPassengersAction from "./createPassengersAction";
import { assignSeatsToFlightBooking } from "../controllers/flights";

export async function flightReserveAction(prevState, formData) {
  const session = await auth();
  const loggedIn = !!session?.user;
  if (!loggedIn) return { success: false, message: "Please login first" };

  const data = Object.fromEntries(formData);
  let passengersDetails = JSON.parse(data.passengersDetails);
  let passengersPreferences = JSON.parse(data.passengersPreferences);
  const metaData = JSON.parse(data.metaData);

  const reservedBooking = await getOneDoc(
    "FlightBooking",
    {
      "flightSnapshot.flightNumber": metaData.flightNumber,
      userId: session.user.id,
      paymentStatus: "pending",
      bookingStatus: "pending",
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

  try {
    const flight = await getOneDoc("Flight", {
      flightNumber: metaData.flightNumber,
    });
    const searchState = JSON.parse(
      cookies().get("flightSearchState")?.value || "{}",
    );
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
    );

    if (passengers.success === false) return passengers;

    const reservationExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    const bookingObj = {
      ticketType: "refundable",
      bookingRef: nanoId,
      userId: session.user.id,
      flightSnapshot: flight,
      tripType: searchState.tripType,
      bookingStatus: "pending",
      passengers: [...passengers.data],
      totalPrice: metaData.totalPrice,
      paymentStatus: "pending",
      paymentId: null,
      seats: [],
      source: "website",
      expiresAt: reservationExpiresAt,
    };

    const booking = await createOneDoc("FlightBooking", bookingObj);

    const result = await assignSeatsToFlightBooking(
      booking._id,
      "temporary",
      reservationExpiresAt.getTime(),
    );
    return { success: true, message: "Reservation created successfully" };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Something went wrong" };
  }
}

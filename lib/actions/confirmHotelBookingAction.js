"use server";
import { auth } from "../auth";
import { confirmHotelBookingCash } from "../services/hotels";
import { HotelBooking } from "../db/models";

export async function confirmHotelBookingCashAction(bookingId) {
  const session = await auth();
  if (!session.user) return { success: false, message: "Unauthenticated" };
  const userId = session.user.id;
  try {
    const isBookingExist = await HotelBooking.exists({
      _id: bookingId,
      userId,
    });

    if (!isBookingExist)
      return { success: false, message: "Booking not found" };

    await confirmHotelBookingCash(bookingId, userId);

    return { success: true, message: "Hotel booking confirmed successfully" };
  } catch (error) {
    return { success: false, message: "Something went wrong" };
  }
}

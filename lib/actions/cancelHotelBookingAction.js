"use server";

import { auth } from "../auth";
import { cancelBooking } from "../controllers/hotels";

export default async function cancelHotelBookingAction(bookingId) {
  const session = await auth();
  if (!session.user) return { success: false, message: "Unauthenticated" };

  const userId = session.user.id;
  try {
    const result = await cancelBooking(bookingId, userId, {});
    if (result.nModified === 0) {
      return { success: false, message: "Could not cancel booking" };
    }
    return { success: true, message: "Hotel booking cancelled successfully" };
  } catch (e) {
    console.log(e);
    return { success: false, message: "Something went wrong" };
  }
}

"use server";

import { auth } from "../auth";
import { cancelBooking } from "../services/hotels";
import { HotelBooking } from "../db/models";
import { parseHotelCheckInOutPolicy } from "../helpers/hotels";
import { isHotelCancellable } from "../helpers/hotels/isHotelCancellable";
import { getBookingStatusesWithHotelPolicies } from "../services/hotels";

export default async function cancelHotelBookingAction(bookingId) {
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

    const bSummery = await getBookingStatusesWithHotelPolicies(
      bookingId,
      session.user.id,
    );

    const checkInTime = parseHotelCheckInOutPolicy(bSummery.policies.checkIn);
    const checkInDate = new Date(bSummery.checkInDate);

    checkInDate.setHours(checkInTime.hour, checkInTime.minute, 0, 0);

    const isCancellable = isHotelCancellable(
      bSummery.policies.cancellationPolicy,
      checkInDate,
      bSummery.bookingStatus,
    );

    if (!isCancellable)
      return { success: false, message: "Booking is not cancellable" };

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

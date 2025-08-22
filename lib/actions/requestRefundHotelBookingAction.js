"use server";

import { revalidateTag } from "next/cache";
import { auth } from "../auth";
import { refundPaymentHotelBooking } from "../services/hotels";
import { getBookingStatusesWithHotelPolicies } from "../services/hotels";
import { isHotelRefundable } from "../helpers/hotels/isHotelRefundable";

export default async function requestRefundHotelBookingAction(bookingId) {
  const session = await auth();
  if (!session.user) return { success: false, message: "Unauthenticated" };

  const userId = session.user.id;

  try {
    const bSummery = await getBookingStatusesWithHotelPolicies(
      bookingId,
      session.user.id,
    );

    const isRefundable = isHotelRefundable(
      bSummery.policies.refundPolicy,
      bSummery.bookingStatus,
      bSummery.paymentStatus,
    );

    if (!isRefundable) return { success: false, message: "Not refundable" };

    const requestRefund = await refundPaymentHotelBooking(bookingId, userId);

    if (requestRefund.status !== "succeeded") {
      return { success: false, message: "Refund request failed" };
    }
    revalidateTag("hotelBookings");
    return { success: true, message: "Refund request sent successfully" };
  } catch (e) {
    console.log(e);
    if (e.raw.code === "charge_already_refunded")
      return {
        success: false,
        message: "This booking has already been refunded",
      };
    return { success: false, message: "Something went wrong" };
  }
}

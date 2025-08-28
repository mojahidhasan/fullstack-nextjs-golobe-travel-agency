"use server";
import { revalidateTag } from "next/cache";
import isFlightRefundable from "../helpers/flights/isFlightRefundable";
import {
  getBookingStatusWithCancellationPolicy,
  refundPaymentFlightBooking,
} from "../services/flights";
import { auth } from "../auth";

export default async function requestRefundFlightBookingAction(pnrCode) {
  const session = await auth();
  if (!session.user) return { success: false, message: "Unauthenticated" };
  const userId = session.user.id;
  try {
    const bookingStatuses = await getBookingStatusWithCancellationPolicy(
      pnrCode,
      userId,
    );

    const isRefundable = isFlightRefundable(
      {
        paymentStatus: bookingStatuses.paymentStatus,
        ticketStatus: bookingStatuses.ticketStatus,
        departureTime: bookingStatuses.departureDate,
        fareType: "refundable",
      },
      bookingStatuses.cancellationPolicy,
    );

    if (!isRefundable) return { success: false, message: "Not refundable" };

    await refundPaymentFlightBooking(pnrCode, userId);
    revalidateTag("userFlightBooking");
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

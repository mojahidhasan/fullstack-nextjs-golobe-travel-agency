import { isHotelCancellable } from "./isHotelCancellable";
import { isHotelRefundable } from "./isHotelRefundable";

export function allowedHotelBookingActionBtns(
  bookingStatus,
  paymentStatus,
  cancellationPolicy,
  refundPolicy,
  checkInDate,
) {
  const cancelled = bookingStatus === "cancelled";
  const confirmed = bookingStatus === "confirmed";
  const pending = bookingStatus === "pending";
  const paid = paymentStatus === "paid";
  const payFailed = paymentStatus === "failed";
  const payPending = paymentStatus === "pending";

  return {
    canConfirm: !cancelled && !confirmed && !pending,
    canCancel: isHotelCancellable(
      cancellationPolicy,
      checkInDate,
      bookingStatus,
    ),
    canRefund: isHotelRefundable(refundPolicy, bookingStatus, paymentStatus),
    canDownload: confirmed && paid,
    canPay:
      !cancelled &&
      (confirmed || pending) &&
      (payPending || payFailed) &&
      !paid,
  };
}

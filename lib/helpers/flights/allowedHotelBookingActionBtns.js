import isFlightCancellable from "./isFlightCancellable";
import isFlightRefundable from "./isFlightRefundable";

export function allowedFlightBookingActionBtns(
  bookingStatus,
  paymentStatus,
  cancellationPolicy,
  departureDate,
  fareType,
) {

  //TODO: fareType will be implemented later
  
  const cancelled = bookingStatus === "cancelled";
  const confirmed = bookingStatus === "confirmed";
  const pending = bookingStatus === "pending";
  const paid = paymentStatus === "paid";
  const payFailed = paymentStatus === "failed";
  const payPending = paymentStatus === "pending";

  const isFlightExpired = new Date(departureDate) < new Date();

  return {
    canConfirm: !cancelled && !confirmed && !pending,
    canCancel: isFlightCancellable(
      {
        departureTime: departureDate,
        paymentStatus: paymentStatus,
        bookingStatus: bookingStatus,
        fareType: "refundable",
      },
      cancellationPolicy,
    ),
    canRefund: isFlightRefundable(
      {
        departureTime: departureDate,
        paymentStatus: paymentStatus,
        bookingStatus: bookingStatus,
        fareType: "refundable",
      },
      cancellationPolicy,
    ),
    canDownload: confirmed && paid,
    canPay:
      !cancelled &&
      (confirmed || pending) &&
      (payPending || payFailed) &&
      !paid &&
      !isFlightExpired,
  };
}

export function availableFlightOrHotelBookingActionBtn(
  bookingStatus,
  paymentStatus,
) {
  const cancelled = bookingStatus === "cancelled";
  const confirmed = bookingStatus === "confirmed";
  const pending = bookingStatus === "pending";
  const paid = paymentStatus === "paid";
  const payFailed = paymentStatus === "failed";
  const payPending = paymentStatus === "pending";

  return {
    canConfirm: !cancelled && !confirmed && !pending,
    canCancel: !cancelled && (confirmed || pending),
    canRefund: cancelled && paid,
    canDownload: confirmed && paid,
    canPay:
      !cancelled &&
      (confirmed || pending) &&
      (payPending || payFailed) &&
      !paid,
  };
}

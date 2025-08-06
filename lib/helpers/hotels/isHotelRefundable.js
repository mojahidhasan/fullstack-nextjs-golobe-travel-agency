/**
 * @typedef {Object} RefundPolicy
 * @property {boolean} refundable
 * @property {number} refundFee
 */
/**
 * Given a refund policy, booking status, and payment status, returns true if the
 * hotel booking is refundable, false otherwise
 * @param {Object} refundPolicy - the refund policy of the hotel
 * @param {string} bookingStatus - the status of the booking
 * @param {string} paymentStatus - the payment status of the booking
 * @returns {boolean} - whether the booking is refundable or not
 */
export function isHotelRefundable(refundPolicy, bookingStatus, paymentStatus) {
  const cancelled = bookingStatus === "cancelled";
  const paid = paymentStatus === "paid";
  return refundPolicy.refundable && cancelled && paid;
}

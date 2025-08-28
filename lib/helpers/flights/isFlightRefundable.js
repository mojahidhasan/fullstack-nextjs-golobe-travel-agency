/**
 * @typedef {Object} Booking
 * @property {string} departureTime
 * @property {string} ticketStatus
 * @property {string} paymentStatus
 * @property {"refundable" | "nonRefundable" | "promo" | "flex"} fareType
 */

/**
 * @typedef {Object} CancellationPolicy
 * @property {number} gracePeriodHours - Risk-free cancellation window (in hours) after booking.
 *                                       Example: 24 means free cancellation if done within 24h.
 * @property {number} cutoffHoursBeforeDeparture - Minimum hours before departure when cancellation is still allowed.
 *                                                 Example: 3 means cancellations are not allowed within 3h of flight.
 * @property {Object<string, FareRule>} fareRules - Cancellation and refund rules for each fare type.
 * @property {boolean} allowVoucherInsteadOfRefund - If true, airline may issue travel credit/voucher instead of cash refund.
 */

/**
 * @typedef {Object} FareRule
 * @property {boolean} cancellable - Whether this fare type can be canceled at all.
 * @property {"full" | "partial" | "voucher" | null} refundType -
 *    Defines what kind of refund is available:
 *    - "full": Full refund of fare
 *    - "partial": Partial refund (fare minus fees)
 *    - "voucher": Refund issued as travel credit/voucher
 *    - null: No refund available
 * @property {number|null} cancellationFee - Fixed fee applied upon cancellation.
 *                                           Null if not applicable.
 */

/**
 * Given a booking and an airline, returns true if the booking is refundable, false otherwise
 * @param {Booking} booking - the booking data object
 * @param {CancellationPolicy} cancellationPolicy - the airline object
 * @returns {boolean} - whether the booking is refundable or not
 */
export default function isFlightRefundable(booking, cancellationPolicy) {
  const now = new Date();

  // If flight already departed → only refundable if fare allows post-departure refunds
  if (
    now >= new Date(booking.departureTime) ||
    (booking.paymentStatus !== "paid" && booking.ticketStatus !== "confirmed")
  ) {
    return false; // simplify: assume no refunds after departure
  }

  const policy = cancellationPolicy;
  const fareRule = policy.fareRules[booking.fareType];

  if (!fareRule || !fareRule.cancellable) {
    // Grace period refunds
    const hoursSinceBooking =
      (now - new Date(booking.createdAt)) / (1000 * 60 * 60);
    if (
      policy.gracePeriodHours &&
      hoursSinceBooking <= policy.gracePeriodHours
    ) {
      return true; // always refundable in grace period
    }
    return false;
  }

  // Refund type check
  if (fareRule.refundType === "full" || fareRule.refundType === "partial") {
    return true;
  }

  if (fareRule.refundType === "voucher" && policy.allowVoucherInsteadOfRefund) {
    return true;
  }

  return false;
}

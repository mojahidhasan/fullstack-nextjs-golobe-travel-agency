/**
 * Given a booking and an airline, returns true if the booking is cancellable, false otherwise
 * @param {import('./isFlightRefundable').Booking} booking - the booking data object
 * @param {import('./isFlightRefundable').CancellationPolicy} cancellationPolicy - the airline object
 * @returns {boolean} - whether the booking is cancellable or not
 */
export default function isFlightCancellable(booking, cancellationPolicy) {
  const now = new Date();
  // Flight already departed or booking not active
  if (
    now >= new Date(booking.departureTime) ||
    (booking.paymentStatus !== "paid" && booking.ticketStatus !== "confirmed")
  ) {
    return false;
  }

  const policy = cancellationPolicy;
  const fareRule = policy.fareRules[booking.fareType];

  if (!fareRule || !fareRule.cancellable) {
    // Check 24h grace period override
    const hoursSinceBooking =
      (now - new Date(booking.createdAt)) / (1000 * 60 * 60);
    if (
      policy.gracePeriodHours &&
      hoursSinceBooking <= policy.gracePeriodHours
    ) {
      return true;
    }
    return false;
  }

  // Check cutoff before departure
  if (policy.cutoffHoursBeforeDeparture) {
    const cutoffTime = new Date(booking.departureTime);
    cutoffTime.setHours(
      cutoffTime.getHours() - policy.cutoffHoursBeforeDeparture,
    );
    if (now > cutoffTime) {
      return false;
    }
  }

  return true;
}

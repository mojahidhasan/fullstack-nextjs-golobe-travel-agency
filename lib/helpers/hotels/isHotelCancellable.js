/**
 * @typedef {Object} CancellableUntil
 * @property {"days" | "hours" | "minutes" | "seconds"} unit
 * @property {number} value
 */

import { hoursToMilliseconds } from "date-fns/hoursToMilliseconds";
import { minutesToMilliseconds } from "date-fns/minutesToMilliseconds";

/**
 * @typedef {Object} CancellationPolicy
 * @property {boolean} cancellable
 * @property {CancellableUntil} cancellableUntil
 * @property {number} cancellationFee
 * @property {string} cancellationDeadline
 */

/**
 * Given a cancellation policy, returns true if the booking is cancellable, false otherwise
 * @param {CancellationPolicy} cancellationPolicy - the cancellation policy object
 * @param {Date} checkInDate - the check-in date of the booking
 * @param {string} bookingStatus - the status of the booking
 * @param {string} paymentStatus - the payment status of the booking
 * @returns {boolean} - whether the booking is cancellable or not
 */
export function isHotelCancellable(
  cancellationPolicy,
  checkInDate,
  bookingStatus,
) {
  let cancellableUntilMs = 0;

  const cancellableUntil = cancellationPolicy.cancellableUntil;
  switch (cancellableUntil.unit) {
    case "days":
      cancellableUntilMs = hoursToMilliseconds(+cancellableUntil.value * 24);
      break;
    case "hours":
      cancellableUntilMs = hoursToMilliseconds(+cancellableUntil.value);
      break;
    case "minutes":
      cancellableUntilMs = minutesToMilliseconds(+cancellableUntil.value);
      break;
    case "seconds":
      cancellableUntilMs = +cancellableUntil.value * 1000;
      break;
    default:
      cancellableUntilMs = 0;
      break;
  }

  const checkIn = new Date(checkInDate);

  const lastTimeToCancel = checkIn.getTime() + cancellableUntilMs; // last time to be cancellable

  const cancelled = bookingStatus === "cancelled";
  const confirmed = bookingStatus === "confirmed";
  const pending = bookingStatus === "pending";

  return (
    cancellationPolicy.cancellable &&
    lastTimeToCancel > Date.now() &&
    !cancelled &&
    (confirmed || pending)
  );
}

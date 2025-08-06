import { HotelBooking } from "../db/models";
import { strToObjectId } from "../db/utilsDB";

/**
 * @typedef {Object} CancellationPolicy
 * @property {boolean} cancellable
 * @property {CancellableUntil} cancellableUntil
 * @property {number} cancellationFee
 * @property {string} cancellationDeadline
 */

/**
 * @typedef {Object} CancellableUntil
 * @property {"days" | "hours" | "minutes" | "seconds"} unit
 * @property {number} value
 */

/**
 * @typedef {Object} RefundPolicy
 * @property {boolean} refundable
 * @property {number} refundFee
 */

/**
 * @typedef {Object} Policies
 * @property {CancellationPolicy} cancellationPolicy
 * @property {RefundPolicy} refundPolicy
 */

/**
 * @typedef {Object} BookingStatusesWithHotelPolicies
 * @property {string} bookingStatus - the status of the booking
 * @property {string} paymentStatus - the status of the payment
 * @property {Date} checkInDate - the check-in date of the booking
 * @property {Object} policies - the policies of the hotel
 */

/**
 * Given a bookingId and a userId, returns an object with the booking status, payment status, check-in date, and hotel policies
 * @param {string} bookingId - the booking id
 * @param {string} userId - the user id that made the booking
 * @throws {Error} if the booking is not found
 * @returns {Promise<BookingStatusesWithHotelPolicies>} - an object with the booking status, payment status, check-in date, and hotel policies
 */
export async function getBookingStatusesWithHotelPolicies(bookingId, userId) {
  if (!bookingId || !userId) throw new Error("Missing parameters.");

  try {
    const [result] = await HotelBooking.aggregate([
      {
        $match: {
          _id: strToObjectId(bookingId),
          userId: strToObjectId(userId),
        },
      },
      {
        $lookup: {
          from: "hotels",
          localField: "hotelId",
          foreignField: "_id",
          as: "hotelInfo",
        },
      },
      { $unwind: "$hotelInfo" },
      {
        $project: {
          bookingStatus: 1,
          paymentStatus: 1,
          checkInDate: 1,
          policies: "$hotelInfo.policies",
        },
      },
    ]);

    return result;
  } catch (e) {
    throw e;
  }
}

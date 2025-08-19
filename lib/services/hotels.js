import "server-only";
import { unstable_cache } from "next/cache";
import { Hotel, HotelBooking } from "../db/models";
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

/**
 * @function getPopularHotelDestinaiton
 * @description Retrieves a list of popular hotel destinations (city-country) along with a random hotel in each destination.
 * @param {number} [limit=10] - The maximum number of records to return
 * @returns {Promise<Object[]>} - A list of hotel documents with a subset of fields (streetAddress, city, stateProvince, postalCode, country)
 */

// can be replaced with real popular destinations logic
export async function getPopularHotelDestinaiton(limit = 10) {
  const randomHotelAddresses = unstable_cache(
    () =>
      Hotel.aggregate([
        { $match: { isDeleted: { $ne: true }, status: "Opened" } },
        { $addFields: { randomSort: { $rand: {} } } },
        { $sort: { randomSort: 1 } },

        // Ensure unique city-country
        {
          $group: {
            _id: {
              city: "$address.city",
              country: "$address.country",
            },
            hotel: { $first: "$$ROOT" }, // first from shuffled list
          },
        },

        // Replace with the hotel doc
        { $replaceRoot: { newRoot: "$hotel" } },

        // Shuffle again and limit
        { $sample: { size: limit } },

        // Project only needed fields
        {
          $project: {
            _id: 0,
            category: 1,
            image: { $arrayElemAt: ["$images", 0] },
            "address.streetAddress": 1,
            "address.city": 1,
            "address.stateProvince": 1,
            "address.postalCode": 1,
            "address.country": 1,
          },
        },
      ]),
    ["popularHotelDestinations"],
    { tags: ["popularHotelDestinations"], revalidate: 24 * 60 * 60 }, // 1 day
  );

  return await randomHotelAddresses();
}

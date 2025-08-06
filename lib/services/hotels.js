import { HotelBooking } from "../db/models";
import { strToObjectId } from "../db/utilsDB";

/**
 * Given a bookingId and a userId, returns an object with the booking status, payment status, check-in date, and hotel policies
 * @param {string} bookingId - the booking id
 * @param {string} userId - the user id that made the booking
 * @throws {Error} if the booking is not found
 * @returns {object} - an object with the booking status, payment status, check-in date, and hotel policies
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

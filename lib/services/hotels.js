import "server-only";
import { unstable_cache } from "next/cache";
import { Hotel, HotelBooking } from "../db/models";
import { strToObjectId } from "../db/utilsDB";
import { revalidateTag } from "next/cache";
import { getManyDocs, getOneDoc } from "../db/getOperationDB";
import { updateOneDoc } from "../db/updateOperationDB";
import { getRefundList, requestRefund } from "../paymentIntegration/stripe";
import { singleRoomFareBreakdown } from "../helpers/hotels/priceCalculation";

export async function getHotels(searchState, options = {}) {
  const city = searchState.city;
  const country = searchState.country;
  const checkIn = searchState.checkIn;
  const checkOut = searchState.checkOut;
  const rooms = searchState.rooms;
  const guests = searchState.guests;

  const filtersPriceRange = options?.filters?.priceRange || [
    -Infinity,
    Infinity,
  ];
  const filtersRates = options?.filters?.rates || [];
  const filtersFeatures = options?.filters?.features || [];
  const filtersAmenities = options?.filters?.amenities || [];

  const featuresQuery = filtersFeatures.length
    ? {
        features: { $all: filtersFeatures },
      }
    : {};

  const amenitiesQuery = filtersAmenities.length
    ? {
        amenities: { $all: filtersAmenities },
      }
    : {};

  try {
    let hotels = await getManyDocs(
      "Hotel",
      {
        "address.city": {
          $regex: `${city.match(/.{1,2}/g).join("+?.*")}`,
          $options: "i",
        },
        "address.country": {
          $regex: `${country.match(/.{1,2}/g).join("+?.*")}`,
          $options: "i",
        },
        ...featuresQuery,
        ...amenitiesQuery,
      },
      ["hotels"],
    );

    const reservedRoomsResult = await getManyDocs(
      "HotelBooking",
      {
        checkInDate: { $lt: checkOut },
        checkOutDate: { $gt: checkIn },
        $or: [
          {
            bookingStatus: "pending",
            guaranteedReservationUntil: { $gt: new Date() },
          },
          { bookingStatus: "confirmed" },
        ],
      },
      ["hotelBookings"],
    );

    const reservedRoomsIds = reservedRoomsResult
      .map((booking) => booking.rooms)
      .flat();

    const hotelsWithAvailableRooms = hotels.map((hotel) => {
      const rooms = hotel.rooms.filter(
        (room) => !reservedRoomsIds.includes(room._id),
      );

      const isAvailableRoomsInPriceRange = rooms.some((room) => {
        const price = singleRoomFareBreakdown(room, 1).total;
        return price >= filtersPriceRange[0] && price <= filtersPriceRange[1];
      });

      if (!isAvailableRoomsInPriceRange) return null;

      return { ...hotel, rooms };
    });

    hotels = hotelsWithAvailableRooms.filter((hotel) => {
      if (!hotel) return false;

      const totalCapacity = hotel.rooms.reduce(
        (acc, room) => acc + +room.sleepsCount,
        0,
      );
      return guests <= totalCapacity;
    });
    return hotels;
  } catch (e) {
    console.log(e);
    throw e;
  }
}

export async function getHotel(slug, searchState) {
  try {
    const hotelDetails = await getOneDoc("Hotel", { slug }, ["hotel"]);
    if (Object.keys(hotelDetails).length === 0) return null;

    const checkIn = searchState.checkIn;
    const checkOut = searchState.checkOut;

    const reserveredRooms = await getManyDocs(
      "HotelBooking",
      {
        checkInDate: { $lt: checkOut },
        checkOutDate: { $gt: checkIn },
        $or: [
          {
            bookingStatus: "pending",
            guaranteedReservationUntil: { $gt: new Date() },
          },
          { bookingStatus: "confirmed" },
        ],
      },
      ["hotelBookings"],
    );
    const reservedRoomsIds = reserveredRooms.map((room) => room.rooms).flat();

    const availableRooms = hotelDetails.rooms.filter(
      (room) => !reservedRoomsIds.includes(room._id),
    );
    const hotelsWithAvailableRooms = {
      ...hotelDetails,
      rooms: availableRooms,
    };

    return hotelsWithAvailableRooms;
  } catch (e) {
    console.log(e);
    throw e;
  }
}

export async function getHotelDefaultFilterValues() {
  try {
    const amenitiesResult = await Hotel.aggregate([
      { $unwind: "$amenities" },
      { $group: { _id: "$amenities" } },
      { $sort: { _id: 1 } },
      { $project: { _id: 0, amenity: "$_id" } },
    ]);

    const featuresResult = await Hotel.aggregate([
      { $unwind: "$features" },
      { $group: { _id: "$features" } },
      { $sort: { _id: 1 } },
      { $project: { _id: 0, feature: "$_id" } },
    ]);

    const priceResult = await Hotel.aggregate([
      {
        $lookup: {
          from: "hotelrooms",
          localField: "rooms",
          foreignField: "_id",
          as: "roomDetails",
        },
      },
      { $unwind: "$roomDetails" },
      {
        $addFields: {
          calculatedPrice: {
            $add: [
              "$roomDetails.price.base",
              "$roomDetails.price.tax",
              {
                $subtract: [
                  {
                    $cond: {
                      if: {
                        $eq: ["$roomDetails.price.discount.type", "percentage"],
                      },
                      then: {
                        $multiply: [
                          "$roomDetails.price.base",
                          {
                            $divide: [
                              "$roomDetails.price.discount.amount",
                              100,
                            ],
                          },
                        ],
                      },
                      else: {
                        $cond: {
                          if: {
                            $eq: ["$roomDetails.price.discount.type", "fixed"],
                          },
                          then: "$roomDetails.price.discount.amount",
                          else: 0,
                        },
                      },
                    },
                  },
                  0,
                ],
              },
              "$roomDetails.price.serviceFee",
            ],
          },
        },
      },
      {
        $group: {
          _id: null,
          minPrice: { $min: "$calculatedPrice" },
          maxPrice: { $max: "$calculatedPrice" },
        },
      },
    ]);

    const filterValues = {
      amenities: amenitiesResult.map((item) => item.amenity),
      features: featuresResult.map((item) => item.feature),
      priceRange:
        priceResult.length > 0
          ? [
              Math.floor(priceResult[0].minPrice),
              Math.ceil(priceResult[0].maxPrice),
            ]
          : [0, 2000],
    };

    return filterValues;
  } catch (error) {
    return {
      amenities: [],
      features: [],
      priceRange: [0, 2000],
    };
  }
}

export async function getAllHotelBookings(userId, revalidate = 600) {
  if (!userId) throw new Error("User id is required");
  try {
    const hotelBookings = await getManyDocs(
      "HotelBooking",
      {
        userId: userId,
      },
      ["hotelBookings"],
      revalidate,
    );
    return hotelBookings;
  } catch (e) {
    console.log(e);
    throw e;
  }
}

export async function isRoomAvailable(roomId, checkInDate, checkOutDate) {
  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);

  try {
    const existingBooking = await getOneDoc(
      "HotelBooking",
      {
        rooms: strToObjectId(roomId),
        checkInDate: { $lt: checkOut },
        checkOutDate: { $gt: checkIn },
        $or: [
          {
            bookingStatus: "pending",
            guaranteedReservationUntil: { $gt: new Date() },
          },
          {
            bookingStatus: "confirmed",
          },
        ],
      },
      ["hotelBookings", "hotelBooking"],
    );

    return !Object.keys(existingBooking).length > 0;
  } catch (e) {
    console.error("Error checking room availability:", e);
    throw e;
  }
}

export async function isRoomTakenByElse(
  roomId,
  checkInDate,
  checkOutDate,
  currentUserId,
) {
  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);

  try {
    const existingBooking = await getOneDoc(
      "HotelBooking",
      {
        rooms: strToObjectId(roomId),
        checkInDate: { $lt: checkOut },
        checkOutDate: { $gt: checkIn },
        userId: { $ne: strToObjectId(currentUserId) },
        $or: [
          {
            bookingStatus: "pending",
            guaranteedReservationUntil: { $gt: new Date() },
          },
          {
            bookingStatus: "confirmed",
          },
        ],
      },
      ["hotelBookings", "hotelBooking"],
    );
    return Object.keys(existingBooking).length > 0;
  } catch (e) {
    console.error("Error checking room availability:", e);
    throw e;
  }
}

export async function confirmHotelBookingCash(bookingId, userId, options = {}) {
  try {
    await updateOneDoc(
      "HotelBooking",
      { _id: strToObjectId(bookingId), userId: strToObjectId(userId) },
      {
        bookingStatus: "confirmed",
        paymentStatus: "pending",
        paymentMethod: "cash",
        bookedAt: new Date(),
      },
      options,
    );
    revalidateTag("hotelBookings");
  } catch (error) {
    throw error;
  }
}

export async function cancelBooking(bookingId, userId, options = {}) {
  try {
    const result = await updateOneDoc(
      "HotelBooking",
      { _id: strToObjectId(bookingId), userId: strToObjectId(userId) },
      {
        $set: {
          bookingStatus: "cancelled",
        },
      },
      options,
    );

    revalidateTag("hotelBookings");
    return result;
  } catch (e) {
    console.log(e);
    throw e;
  }
}

export async function refundPaymentHotelBooking(bookingId, userId) {
  let chargeId = null;
  try {
    const booking = await getOneDoc(
      "HotelBooking",
      { _id: strToObjectId(bookingId), userId: strToObjectId(userId) },
      ["hotelBookings"],
    );
    chargeId = booking.paymentId?.stripe_chargeId;

    const refund = await requestRefund({
      charge: chargeId,
      reason: "requested_by_customer",
      metadata: { type: "hotelBooking", hotelBookingId: bookingId, userId },
    });

    // webhook will update the refund info in the booking

    return refund;
  } catch (e) {
    console.log(e);
    if (e.raw.code === "charge_already_refunded") {
      try {
        const refund = (await getRefundList(chargeId))[0];

        const refundInfoObj = {
          stripeRefundId: refund.id,
          status: "refunded",
          reason: refund.reason,
          currency: refund.currency,
          amount: refund.amount / 100,
          refundedAt: new Date(refund.created * 1000),
        };
        await updateOneDoc(
          "HotelBooking",
          { _id: strToObjectId(bookingId) },
          {
            $set: {
              paymentStatus: "refunded",
              bookingStatus: "cancelled",
              refundInfo: refundInfoObj,
            },
          },
        );
        revalidateTag("hotelBookings");
      } catch (e) {}
    }
    throw e;
  }
}

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

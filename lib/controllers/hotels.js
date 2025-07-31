import "server-only";
import { revalidateTag } from "next/cache";
import { getManyDocs, getOneDoc } from "../db/getOperationDB";
import { updateOneDoc } from "../db/updateOperationDB";
import { strToObjectId } from "../db/utilsDB";
import { getRefundList, requestRefund } from "../paymentIntegration/stripe";

export async function getHotels(searchState, options = {}) {
  const city = searchState.city;
  const country = searchState.country;
  const checkIn = searchState.checkIn;
  const checkOut = searchState.checkOut;
  const rooms = searchState.rooms;
  const guests = searchState.guests;

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
      },
      ["hotels"],
    );

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

    const hotelsWithAvailableRooms = hotels.map((hotel) => {
      const rooms = hotel.rooms.filter(
        (room) => !reservedRoomsIds.includes(room._id),
      );
      return { ...hotel, rooms };
    });

    hotels = hotelsWithAvailableRooms.filter((hotel) => {
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

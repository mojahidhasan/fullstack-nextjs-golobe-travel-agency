import { getManyDocs, getOneDoc } from "../db/getOperationDB";
import { strToObjectId } from "../db/utilsDB";

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

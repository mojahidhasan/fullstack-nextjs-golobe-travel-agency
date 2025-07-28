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

export async function isRoomAvailable(roomId, checkInDate, checkOutDate) {
  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);

  try {
    const existingBooking = await getOneDoc("HotelBooking", {
      rooms: strToObjectId(roomId),
      $or: [
        {
          checkInDate: { $lt: checkOut },
          checkOutDate: { $gt: checkIn },
          guaranteedReservationUntil: { $gt: new Date() },
        },
      ],
    });

    return !Object.keys(existingBooking).length;
  } catch (e) {
    console.error("Error checking room availability:", e);
    throw e;
  }
}

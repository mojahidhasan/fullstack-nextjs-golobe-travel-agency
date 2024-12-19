import hotelsData from "../primaryData/hotelsData.json";
import { ObjectId } from "mongodb";

export async function generateHotelsDB() {
  const rooms = [];
  const hotels = [];

  for (const hotel of hotelsData) {
    const roomIds = [];
    const hotelId = new ObjectId();
    for (const room of hotel.Rooms) {
      const basePrice = room.BaseRate;
      const roomObj = {
        _id: new ObjectId(),
        hotelId,
        description: room.Description,
        roomType: room.Type,
        price: {
          base: basePrice,
          tax: basePrice * 0.1,
          discount: basePrice * (Math.floor(Math.random() * 30) / 100),
          serviceFee: basePrice * 0.02,
        },
        bedOptions: room.BedOptions,
        sleepsCount: room.SleepsCount,
        smokingAllowed: room.SmokingAllowed,
        totalBeds: +room.BedOptions.trim()[0],
        availability: [],
        images: [],
        features: [],
        amenities: [],
        tags: room.Tags,
      };
      roomIds.push(roomObj._id);
      rooms.push(roomObj);
    }

    const slugify = (str) => {
      return str.toLowerCase().replace(/\s/g, "-");
    };

    const hotelObj = {
      _id: hotelId,
      slug: slugify(
        `${hotel.HotelName} lat${hotel.Location.coordinates[1]} lon${hotel.Location.coordinates[0]}`
      ),
      name: hotel.HotelName,
      description: hotel.Description,
      category: hotel.Category,
      parkingIncluded: hotel.ParkingIncluded,
      lastRenovationDate: hotel.LastRenovationDate || null,
      isDeleted: hotel.IsDeleted,
      address: {
        streetAddress: hotel.Address.StreetAddress,
        city: hotel.Address.City,
        stateProvince: hotel.Address.StateProvince,
        postalCode: hotel.Address.PostalCode,
        country: hotel.Address.Country,
      },
      coordinates: {
        lon: hotel.Location.coordinates[0],
        lat: hotel.Location.coordinates[1],
      },
      totalRooms: roomIds.length,
      rooms: roomIds,
      policies: {
        checkInTime: "14:00",
        checkOutTime: "12:00",
        cancellationPolicy: "Free cancellation",
        petPolicy: "Pets are allowed",
      },
      status: "Opened",
      images: [],
      amenities: [],
      tags: hotel.Tags,
    };
    hotels.push(hotelObj);
  }
  return {
    hotel: hotels,
    hotelRoom: rooms,
  };
}

import hotelsData from "../primaryData/hotelsData.json";
import { ObjectId } from "mongodb";

export async function generateHotelsDB() {
  const rooms = [];
  const hotels = [];

  for (const hotel of hotelsData) {
    const roomIds = [];
    const hotelId = new ObjectId();
    for (const room of hotel.rooms) {
      const basePrice = room.roomBaseRate;
      const roomObj = {
        _id: new ObjectId(),
        hotelId,
        roomNumber: room.roomNumber,
        description: room.roomDescription,
        roomType: room.roomType,
        price: {
          base: basePrice,
          tax: basePrice * 0.1,
          discount: basePrice * (Math.floor(Math.random() * 30) / 100),
          serviceFee: basePrice * 0.02,
        },
        bedOptions: room.roomBedOptions,
        sleepsCount: room.roomSleepsCount,
        smokingAllowed: room.roomSmokingAllowed,
        totalBeds: +room.roomBedOptions.trim()[0],
        availability: [],
        images: room.roomImages,
        features: room.roomFeatures,
        amenities: room.roomAmenities,
        tags: room.tags,
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
        `${hotel.hotelName} lat${hotel.coordinates.lat} lon${hotel.coordinates.lon}`
      ),
      name: hotel.hotelName,
      description: hotel.description,
      category: hotel.category,
      parkingIncluded: hotel.parkingIncluded,
      lastRenovationDate: hotel.lastRenovationDate || null,
      isDeleted: hotel.isDeleted,
      query: `${hotel.hotelName}, ${hotel.address.city}, ${hotel.address.country}`,
      address: {
        streetAddress: hotel.address.streetAddress,
        city: hotel.address.city,
        stateProvince: hotel.address.stateProvince,
        postalCode: hotel.address.postalCode,
        country: hotel.address.country,
      },
      coordinates: hotel.coordinates,
      totalRooms: roomIds.length,
      rooms: roomIds,
      policies: hotel.policies,
      availability: [],
      status: "Opened",
      images: hotel.images,
      amenities: hotel.amenities,
      features: hotel.features,
      tags: hotel.tags,
    };
    hotels.push(hotelObj);
  }
  return {
    hotel: hotels,
    hotelRoom: rooms,
  };
}

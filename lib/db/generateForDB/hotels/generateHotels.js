import { addYears } from "date-fns";
import hotelsData from "../primaryData/hotelsData.json";
import { ObjectId } from "mongodb";

export async function generateHotelsDB() {
  const rooms = [];
  const hotels = [];

  for (const hotel of hotelsData) {
    const roomIds = [];
    const hotelId = new ObjectId();
    for (const room of hotel.rooms) {
      const shouldDiscount = Math.random() < 0.3;

      const basePrice = room.roomBaseRate;

      const roomObj = {
        _id: new ObjectId(),
        hotelId,
        roomNumber: room.roomNumber,
        description: room.roomDescription,
        roomType: room.roomType,
        features: room.roomFeatures,
        amenities: room.roomAmenities,
        images: room.roomImages,
        price: {
          base: basePrice,
          tax: basePrice * 0.1,
          discount: {
            amount: shouldDiscount ? Math.floor(Math.random() * 20) : 0,
            type: "percentage",
            validUntil: shouldDiscount ? addYears(new Date(), 10) : null,
          },
          serviceFee: basePrice * 0.02,
          currency: "USD",
        },
        totalBeds: +room.roomBedOptions.trim()[0],
        bedOptions: room.roomBedOptions,
        sleepsCount: room.roomSleepsCount,
        smokingAllowed: room.roomSmokingAllowed,
        maxAdults: Math.floor(Math.random() * 4) + 1,
        maxChildren: Math.floor(Math.random() * 4) + 1,
        extraBedAllowed: Math.floor(Math.random() * 2) === 1,
        roomNumber: room.roomNumber,
        floor: Math.floor(Math.random() * 10),
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
        `${hotel.hotelName} ${hotel.category} lat${hotel.coordinates.lat} lon${hotel.coordinates.lon}`,
      ),
      name: hotel.hotelName,
      description: hotel.description,
      category: hotel.category,
      totalRooms: roomIds.length,
      rooms: roomIds,
      coordinates: hotel.coordinates,
      status: "Opened",
      address: {
        streetAddress: hotel.address.streetAddress,
        city: hotel.address.city,
        stateProvince: hotel.address.stateProvince,
        postalCode: hotel.address.postalCode,
        country: hotel.address.country,
      },
      parkingIncluded: hotel.parkingIncluded,
      lastRenovationDate: hotel.lastRenovationDate || null,
      isDeleted: hotel.isDeleted,
      query: `${hotel.hotelName}, ${hotel.address.city}, ${hotel.address.country}`,
      images: hotel.images,
      amenities: hotel.amenities,
      policies: {
        ...hotel.policies,
        paymentPolicy: {
          creditCards: true,
          cash: true,
        },
        cancellationPolicy: {
          cancellableUntil: {
            unit: "seconds",
            value: -86400, // 1 day in seconds. 1 day before check-in
          },
          cancellable: true,
          cancellationFee: 0,
        },
        refundPolicy: {
          refundable: true,
          refundFee: 0,
        },
      },
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

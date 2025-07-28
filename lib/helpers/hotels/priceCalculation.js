import { groupBy } from "@/lib/utils";

export function hotelPriceCalculation(dbPriceObj, guestsCount) {
  let discount = 0;
  let discountPercentage;
  if (dbPriceObj.discount.type === "percentage") {
    discount = +dbPriceObj.base * (+dbPriceObj.discount.amount / 100);
    discountPercentage = +dbPriceObj.discount.amount;
  }

  if (dbPriceObj.discount.type === "fixed") {
    discount = +dbPriceObj.discount.amount;
  }

  const base = +dbPriceObj.base || 0;
  const tax = +dbPriceObj.tax || 0;
  const serviceFee = +dbPriceObj.serviceFee || 0;
  const totalBeforeDiscount = base + tax + serviceFee;
  const discountedTotalPerPassenger = totalBeforeDiscount - discount;
  const total = discountedTotalPerPassenger * guestsCount;

  return {
    base: dbPriceObj.base * guestsCount,
    tax: dbPriceObj.tax * guestsCount,
    serviceFee: dbPriceObj.serviceFee * guestsCount,
    discount: discount * guestsCount,
    discountPercentage,
    totalBeforeDiscount: totalBeforeDiscount * guestsCount,
    discountedTotalPerPassenger,
    total,
    guestsCount,
    baseUnit: base,
    taxUnit: tax,
    serviceFeeUnit: serviceFee,
    discountUnit: discount,
  };
}

export function singleRoomFareBreakdown(room, guests = 1) {
  const fare = room.price;
  const fareBreakdowns = hotelPriceCalculation(fare, guests);
  const total = fareBreakdowns.total;

  return {
    fareBreakdowns,
    total,
    roomDetails: room,
  };
}

export function multiRoomCombinedFareBreakDown(selectedRooms, guests = 1) {
  const roomsSorted = [...selectedRooms].sort((a, b) => {
    let aDiscountAmount = 0;
    let bDiscountAmount = 0;

    if (a.price.discount.type === "percentage") {
      aDiscountAmount = a.price.base * (+a.price.discount.amount / 100);
    } else {
      aDiscountAmount = +a.price.discount.amount;
    }
    if (b.price.discount.type === "percentage") {
      bDiscountAmount = b.price.base * (+b.price.discount.amount / 100);
    } else {
      bDiscountAmount = +b.price.discount.amount;
    }

    const aPrice =
      +a.price.base + +a.price.tax - aDiscountAmount + +a.price.serviceFee;
    const bPrice =
      +b.price.base + +b.price.tax - bDiscountAmount + +b.price.serviceFee;

    return aPrice - bPrice;
  });
  const groupByRoomType = groupBy(roomsSorted, (room) => room.roomType);

  const roomBreakdowns = Object.entries(groupByRoomType).reduce(
    (acc, [roomType, rooms]) => {
      const breakdowns = rooms.map((room) => {
        const breakdown = singleRoomFareBreakdown(room, guests);
        return breakdown;
      });
      acc[roomType] = breakdowns;
      return acc;
    },
    {},
  );

  const combinedBreakdown = {
    fareBreakdowns: {},
    total: 0,
  };

  // Group rooms by bedOptions
  const roomsByRoomType = {};

  for (const [roomType, breakdowns] of Object.entries(roomBreakdowns)) {
    const roomsByBedOptions = {};
    breakdowns.forEach((breakdown) => {
      const bedOption = breakdown.roomDetails.bedOptions;

      if (!roomsByBedOptions[bedOption]) {
        roomsByBedOptions[bedOption] = {
          base: 0,
          tax: 0,
          serviceFee: 0,
          discount: 0,
          total: 0,
          rooms: [],
        };
      }
      // Sum up the pricing information
      const priceInfo = breakdown.fareBreakdowns;

      roomsByBedOptions[bedOption].base += priceInfo.base;
      roomsByBedOptions[bedOption].tax += priceInfo.tax;
      roomsByBedOptions[bedOption].serviceFee += priceInfo.serviceFee;
      roomsByBedOptions[bedOption].discount += priceInfo.discount;
      roomsByBedOptions[bedOption].total += priceInfo.total;

      // Add room details
      roomsByBedOptions[bedOption].rooms.push({
        description: breakdown.roomDetails.description,
        roomType: breakdown.roomDetails.roomType,
        bedOptions: breakdown.roomDetails.bedOptions,
        roomNumber: breakdown.roomDetails.roomNumber,
      });
    });

    roomsByRoomType[roomType] = roomsByBedOptions;
  }

  combinedBreakdown.fareBreakdowns = roomsByRoomType;

  const roomTypesVal = Object.values(roomsByRoomType).reduce((acc, val) => {
    return { ...acc, ...val };
  }, {});
  combinedBreakdown.total = Object.values(roomTypesVal).reduce((acc, val) => {
    return acc + val.total;
  }, 0);

  return combinedBreakdown;
}

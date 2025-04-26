/**
 * Calculates detailed flight pricing breakdown for different passenger types
 * @param {Object} flightObj - Flight data object containing airline, airports, and discount info
 * @param {Array} airlineFlightPricesArr - Array of airline pricing configurations
 * @param {string} flightClass - Travel class (e.g. 'economy', 'business')
 * @param {Object} passengersObj - Passenger counts by type {adults, children, infants}
 * @typedef {{basePrice: {base: number, count: number, total: number}, taxes: {base: number, count: number, total: number}, serviceFee: {base: number, count: number, total: number}, discount: {base: number, count: number, total: number}, total: number}} FlightPricing - Detailed flight pricing for a passenger type
 * @returns {{adults: FlightPricing, children: FlightPricing || {}, infants: FlightPricing || {}, metaData: {subTotal: number, totalDiscount: number, totalPassengers: number}}} Detailed flight pricing breakdown
 */
export const extractFlightPriceFromAirline = (
  flightObj,
  airlineFlightPricesArr,
  flightClass,
  passengersObj,
) => {
  const airlineCode = flightObj.airlineId.iataCode;
  const departureAirportCode = flightObj.departure.airport.iataCode;
  const arrivalAirportCode = flightObj.arrival.airport.iataCode;
  const discountObj = flightObj.discount;
  const flightprices = airlineFlightPricesArr?.find((airline) => {
    return (
      airline.airlineCode === airlineCode &&
      airline.departureAirportCode === departureAirportCode &&
      airline.arrivalAirportCode === arrivalAirportCode
    );
  });

  const flightPricing = {
    adults: {},
    children: {},
    infants: {},
  };
  let subTotal = 0;
  let totalDiscount = 0;
  Object.entries(passengersObj).forEach(([type, count]) => {
    const basePriceReduction = Math.round(
      calculateAmount(
        discountObj?.amountType,
        discountObj?.amount,
        flightprices.basePrice[flightClass][type],
      ),
    );

    if (count > 0) {
      const base =
        Math.round(flightprices.basePrice[flightClass][type]) -
        basePriceReduction;
      const taxes = Math.round(
        calculateAmount(
          flightprices.taxes.amountType,
          flightprices.taxes.amount,
          base,
        ),
      );
      const serviceFee = Math.round(
        calculateAmount(
          flightprices.serviceFee.amountType,
          flightprices.serviceFee.amount,
          base,
        ),
      );

      const discount = -Math.round(
        calculateAmount(
          flightprices.discount?.amountType,
          flightprices.discount?.amount,
          base,
        ),
      );

      flightPricing[type] = {
        basePrice: {
          base: base,
          count: count,
          total: base * count,
        },
        taxes: {
          base: taxes,
          count: count,
          total: taxes * count,
        },
        serviceFee: {
          base: serviceFee,
          count: count,
          total: serviceFee * count,
        },
        discount: {
          base: discount,
          count: count,
          total: discount * count,
        },
        total:
          base * count + taxes * count + serviceFee * count + discount * count,
      };

      subTotal += flightPricing[type].total;
      totalDiscount += flightPricing[type].discount.total;
    }
  });

  function calculateAmount(amountType, value, basePrice = 0) {
    return amountType === "percentage" ? +basePrice * (+value / 100) : +value;
  }

  flightPricing.metaData = {
    subTotal,
    totalDiscount,
    totalPassengers: Object.values(passengersObj).reduce((a, b) => a + b, 0),
  };

  return flightPricing;
};

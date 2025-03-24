export const extractFlightPriceFromAirline = (
  departureAirportCode,
  arrivalAirportCode,
  airlineCode,
  priceReductionMultiplierPecentage = 0,
  flightClass,
  airlinesArr
) => {
  const flightAirline = airlinesArr?.find(
    (airline) => airline.iataCode === airlineCode
  );
  const flightRoute = flightAirline?.operatingRoutes.find(
    (route) =>
      route.departureAirportCode === departureAirportCode &&
      route.arrivalAirportCode === arrivalAirportCode
  );

  if (!flightRoute) return null;

  const basePrice =
      +flightRoute.basePriceByClass[flightClass] -
      +flightRoute.basePriceByClass[flightClass] *
        +priceReductionMultiplierPecentage,
    taxes = calculateAmount(
      flightRoute.taxes.amountType,
      flightRoute.taxes.amount
    ),
    serviceFee = calculateAmount(
      flightRoute.serviceFee.amountType,
      flightRoute.serviceFee.amount
    ),
    discount = -calculateAmount(
      flightRoute.discount.amountType,
      flightRoute.discount.amount
    ),
    total = basePrice + discount + taxes + serviceFee;
  function calculateAmount(amountType, value) {
    return amountType === "percentage" ? basePrice * (+value / 100) : +value;
  }

  return {
    basePrice,
    discount,
    serviceFee,
    taxes,
    total,
  };
};

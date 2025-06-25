/**
 * Compute fare details for a single passenger type
 *
 * @param {string} passengerType - e.g. "adult", "child", "infant"
 * @param {number} count - number of passengers of this type
 * @param {string} cabinClass - e.g. "economy"
 * @param {Object} fare - the fare object as per new structure
 * @returns {{
 *   base: number,
 *   tax: number,
 *   serviceFee: number,
 *   discount: number,
 *   totalBeforeDiscount: number,
 *   discountedTotalPerPassenger: number,
 *   total: number
 * }}
 */
export function getPassengerFareDetails(
  passengerType,
  count,
  cabinClass,
  fare,
) {
  const base = +fare.basePrice?.[cabinClass]?.[passengerType] || 0;
  const taxPercent = +fare.taxes?.[passengerType]?.amount || 0;
  const feePercent = +fare.serviceFee?.[passengerType]?.amount || 0;
  const discountPercent = +fare.discount?.[passengerType]?.amount || 0;

  const tax = base * (taxPercent / 100);
  const serviceFee = base * (feePercent / 100);
  const totalBeforeDiscount = base + tax + serviceFee;

  const discount = totalBeforeDiscount * (discountPercent / 100);
  const discountedTotalPerPassenger = totalBeforeDiscount - discount;
  const total = discountedTotalPerPassenger * count;

  return {
    base: base * count,
    tax: tax * count,
    serviceFee: serviceFee * count,
    discount: discount * count,
    totalBeforeDiscount: totalBeforeDiscount * count,
    discountedTotalPerPassenger,
    total,
    count,
    baseUnit: base,
    taxUnit: tax,
    serviceFeeUnit: serviceFee,
    discountUnit: discount,
  };
}

export function singleSegmentFareBreakdown(
  segment,
  passengerCountObj,
  cabinClass,
) {
  const { fareDetails } = segment;
  const fareBreakdowns = Object.entries(passengerCountObj).reduce(
    (acc, [passengerType, count]) => {
      if (!count) return acc;
      const breakdown = getPassengerFareDetails(
        passengerType,
        count,
        cabinClass,
        fareDetails,
      );
      acc[passengerType] = breakdown;
      return acc;
    },
    {},
  );

  const computedTotal = Object.values(fareBreakdowns).reduce(
    (acc, item) => acc + item.total,
    0,
  );

  return {
    fareBreakdowns,
    total: computedTotal,
  };
}

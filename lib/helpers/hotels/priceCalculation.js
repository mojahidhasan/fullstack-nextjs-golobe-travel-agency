export default function hotelPriceCalculation(dbPriceObj) {
  let discount = 0;

  if (dbPriceObj.discount.type === "percentage") {
    discount = +(dbPriceObj.base * +dbPriceObj.discount.amount) / 100;
  }

  if (dbPriceObj.discount.type === "fixed") {
    discount = +dbPriceObj.discount.amount;
  }

  return {
    base: +dbPriceObj.base,
    tax: +dbPriceObj.tax,
    serviceFee: +dbPriceObj.serviceFee,
    discount: +discount,
    totalBeforeDiscount:
      +dbPriceObj.base + +dbPriceObj.tax + +dbPriceObj.serviceFee,
    discountedTotalPerGuest:
      +dbPriceObj.base + +dbPriceObj.tax + +dbPriceObj.serviceFee - +discount,
    total:
      +dbPriceObj.base + +dbPriceObj.tax + +dbPriceObj.serviceFee - +discount,
  };
}

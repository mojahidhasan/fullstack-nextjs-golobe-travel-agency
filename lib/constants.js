const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

const PHONE_REGEX =
  /\+(9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)\d{1,14}$/;

const FLIGHT_CLASS_PLACEHOLDERS = {
  economy: "Economy Class",
  business: "Business Class",
  first: "First Class",
  premium_economy: "Premium Economy Class",
};

const RATING_SCALE = {
  1: "Poor",
  2: "Fair",
  3: "Good",
  4: "Very Good",
  5: "Excellent",
};

const BOOKING_STATUS_TEXT_COL_TW_CLASS = {
  pending: "text-yellow-500",
  confirmed: "text-green-700",
  cancelled: "text-destructive",
  failed: "text-destructive",
};
const BOOKING_STATUS_BG_COL_TW_CLASS = {
  pending: "bg-yellow-100",
  confirmed: "bg-green-100",
  cancelled: "bg-red-100",
  failed: "bg-red-100",
};

const PAYMENT_STATUS_TEXT_COL_TW_CLASS = {
  pending: "text-yellow-500",
  "pay at property": "text-yellow-500",
  paid: "text-green-700",
  failed: "text-red-500",
  cancelled: "text-destructive",
  refunded: "text-destructive",
};

const PAYMENT_STATUS_BG_TW_CLASS = {
  pending: "bg-yellow-100",
  "pay at property": "text-yellow-500",
  paid: "bg-green-100",
  failed: "bg-red-100",
  cancelled: "bg-red-100",
  refunded: "bg-red-100",
};

export {
  PASSWORD_REGEX,
  PHONE_REGEX,
  FLIGHT_CLASS_PLACEHOLDERS,
  RATING_SCALE,
  BOOKING_STATUS_TEXT_COL_TW_CLASS,
  BOOKING_STATUS_BG_COL_TW_CLASS,
  PAYMENT_STATUS_TEXT_COL_TW_CLASS,
  PAYMENT_STATUS_BG_TW_CLASS,
};

const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

const PHONE_REGEX =
  /\+(9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)\d{1,14}$/;

const FLIGHT_CLASS_PLACEHOLDERS = {
  economy: "Economy",
  business: "Business",
  first: "First",
  premium_economy: "Premium Economy",
};

const RATING_SCALE = {
  1: "Poor",
  2: "Fair",
  3: "Good",
  4: "Very Good",
  5: "Excellent",
};
export { PASSWORD_REGEX, PHONE_REGEX, FLIGHT_CLASS_PLACEHOLDERS, RATING_SCALE };

export const UNSPLASH_BASE_URL = "https://source.unsplash.com";

export const airlineNames = ["Emirates", "Fly-Dubai", "Qatar", "Etihad"];
export const tripTypes = [
  "Round-trip",
  "One-Way",
  "Multi-City",
  "My-Dates-Are-Flexible",
];
export const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

export const PHONE_REGEX =
  /\+(9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)\d{1,14}$/;
export const API_URL = process.env.NEXT_PUBLIC_API_URL;

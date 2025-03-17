import { Schema } from "mongoose";
import airlineSchema from "./airlines";
const emailSchema = new Schema({
  _id: false,
  email: { type: String, required: true, unique: true },
  emailVerifiedAt: { type: Date, required: false, default: null },
  primary: { type: Boolean, default: false },
  inVerification: { type: Boolean, default: false },
});
const phoneSchema = new Schema({
  _id: false,
  number: { type: String, required: true },
  countryCode: { type: String, required: true },
  inVerification: { type: Boolean, default: false },
  verifiedAt: { type: Date, default: null },
  primary: { type: Boolean, default: false },
});
const favouriteFlightsSchema = new Schema({
  _id: false,
  flightId: { type: Schema.Types.ObjectId, ref: "Flight", required: true },
  flightNumber: { type: String, required: true },
  flightClass: { type: String, required: true },
});

const latestFlightSearchStateSchema = new Schema({
  _id: false,
  departureAirport: {
    code: { type: String, required: true },
    name: { type: String },
  },
  arrivalAirport: {
    code: { type: String, required: true },
    name: { type: String },
  },
  tripType: { type: String, required: true },
  desiredDepartureDate: { type: Date, required: true },
  desiredReturnDate: { type: Date },
  class: {
    type: String,
    enum: ["economy", "premium_economy", "business", "first"],
    required: true,
  },
  passengers: {
    adults: { type: Number, required: true },
    children: { type: Number },
    infants: { type: Number },
  },
});

export const hotelRelatedDataSchema = new Schema({
  _id: false,
  bookings: [{ type: Schema.Types.ObjectId, ref: "HotelBooking" }],
  searchHistory: [{ type: Schema.Types.ObjectId, ref: "SearchHistory" }],
  bookmarkedHotels: [{ type: Schema.Types.ObjectId, ref: "Hotel" }],
}); // will be updated later

export const flightRelatedDataSchema = new Schema({
  _id: false,
  latestFlightSearchState: latestFlightSearchStateSchema,
  airlines: [airlineSchema],
  bookings: [{ type: Schema.Types.ObjectId, ref: "FlightBooking" }],
  searchHistory: [{ type: Schema.Types.ObjectId, ref: "SearchHistory" }],
  bookmarked: [favouriteFlightsSchema],
  sessionTimeoutAt: { type: Number, default: null },
});

const userSchema = new Schema(
  {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    emails: [emailSchema],
    profileImage: { type: String, required: true },
    coverImage: { type: String, required: false },
    emailVerifiedAt: { type: Date, required: false, default: null },
    phoneNumbers: [phoneSchema],
    address: {
      type: String,
      default: null,
    },
    dateOfBirth: { type: Date, default: null },
    flights: flightRelatedDataSchema,
    hotels: hotelRelatedDataSchema,
  },
  {
    timestamps: true,
  }
);

export default userSchema;

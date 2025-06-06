import { Schema } from "mongoose";
import mongooseAutoPopulate from "mongoose-autopopulate";
import passengerSchema from "./passengers";
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
  dialCode: { type: String, required: true },
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

const latestSearchStateSchema = new Schema({
  _id: false,
  from: {
    type: String,
    required: true,
  },
  to: {
    type: String,
    required: true,
  },
  tripType: { type: String, required: true },
  desiredDepartureDate: { type: Date, required: true },
  desiredReturnDate: { type: Date },
  class: {
    type: String,
    enum: ["economy", "premium_economy", "business", "first"],
    required: true,
  },
  passengers: { type: String, required: true },
});

export const hotelRelatedDataSchema = new Schema({
  _id: false,
  bookings: [{ type: Schema.Types.ObjectId, ref: "HotelBooking" }],
  searchHistory: [{ type: Schema.Types.ObjectId, ref: "SearchHistory" }],
  bookmarked: [{ type: Schema.Types.ObjectId, ref: "Hotel" }],
}); // will be updated later

export const flightRelatedDataSchema = new Schema({
  _id: false,
  latestSearchState: latestSearchStateSchema,
  bookings: [{ type: Schema.Types.ObjectId, ref: "FlightBooking" }],
  searchHistory: [{ type: Schema.Types.ObjectId, ref: "SearchHistory" }],
  bookmarked: [favouriteFlightsSchema],
  passengerDetails: [passengerSchema],
});

const userSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
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
    customerId: { type: String, default: null },
    flights: flightRelatedDataSchema,
    hotels: hotelRelatedDataSchema,
  },
  {
    timestamps: true,
  },
);

userSchema.plugin(mongooseAutoPopulate);
export default userSchema;

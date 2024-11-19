import { Schema } from "mongoose";

const emailSchema = new Schema({
  _id: false,
  email: { type: String, required: true, unique: true },
  emailVerifiedAt: { type: Date || null, required: false, default: null },
  primary: { type: Boolean, default: false },
  inVerification: { type: Boolean, default: false },
});

const favouriteFlightsSchema = new Schema({
  _id: false,
  flightNumber: { type: String, required: true },
  flightClass: { type: String, required: true },
});

const userSchema = new Schema(
  {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    emails: [emailSchema],
    profileImage: { type: String, required: true },
    coverImage: { type: String, required: false },
    emailVerifiedAt: { type: Date || null, required: false, default: null },
    phone: {
      number: String,
      verified: { type: Boolean, default: false },
    } || { type: null, default: null },
    address: {
      type: String || null,
      default: null,
    },
    dateOfBirth: { type: Date || null, default: null },
    likes: {
      flights: [favouriteFlightsSchema],
      hotels: [{ type: Schema.Types.ObjectId, ref: "Hotel" }],
    },
    searchHistory: [{ type: Schema.Types.ObjectId, ref: "SearchHistory" }],
  },
  {
    timestamps: true,
  }
);

export default userSchema;

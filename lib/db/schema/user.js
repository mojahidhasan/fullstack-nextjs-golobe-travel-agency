import { Schema } from "mongoose";

const emailSchema = new Schema({
  _id: false,
  email: { type: String, required: true, unique: true },
  emailVerified: { type: Date || null, required: false, default: null },
  primary: { type: Boolean, default: false },
});

const userSchema = new Schema(
  {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    emails: [emailSchema],
    profileImage: { type: String, required: true },
    coverImage: { type: String, required: false },
    emailVerified: { type: Date || null, required: false, default: null },
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
      flights: [
        {
          airlineId: { type: String, ref: "Airline", required: true },

          departureAirportId: {
            type: String,
            ref: "Airport",
            required: true,
          },
          arrivalAirportId: {
            type: String,
            ref: "Airport",
            required: true,
          },
        },
      ],
      hotels: [{ type: Schema.Types.ObjectId, ref: "Hotel" }],
    },
    searchHistory: [{ type: Schema.Types.ObjectId, ref: "SearchHistory" }],
  },
  {
    timestamps: true,
    virtuals: {
      fullName: {
        get() {
          return `${this.firstname} ${this.lastname}`;
        },
      },
    },
  }
);

export default userSchema;

import { Schema } from "mongoose";
const passengerSchema = new Schema(
  {
    // Core Identifiers
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    middleName: { type: String },
    title: { type: String },
    passengerType: {
      type: String,
      enum: ["adult", "child", "infant"],
      // required: true,
    },

    // Contact Info
    email: { type: String, required: true, match: /.+\@.+\..+/ },
    phoneNumber: {
      number: { type: String, required: true },
      dialCode: { type: String, required: true },
    },
    address: {
      street: String,
      city: String,
      country: String,
      postalCode: String,
    },

    // Travel Documents
    passportNumber: { type: String },
    passportExpiryDate: { type: Date },
    country: { type: String },
    visaDetails: {
      number: String,
      expiry: Date,
      country: String,
    },

    // Flight Preferences
    frequentFlyerNumber: { type: String },
    frequentFlyerAirline: { type: String },
    seatPreference: { type: String, enum: ["window", "aisle", "middle"] },
    mealPreference: { type: String },
    specialAssistance: { type: String },

    // Compliance
    dateOfBirth: { type: Date, required: true },
    gender: { type: String, enum: ["male", "female"] },
    redressNumber: { type: String },
    knownTravelerNumber: { type: String },

    //meta
    isPrimary: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export default passengerSchema;

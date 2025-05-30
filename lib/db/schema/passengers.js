import { Schema } from "mongoose";

const preferencesSchema = new Schema({
  seatPreference: {
    position: {
      type: String,
      enum: ["window", "aisle", "middle", "exit", "any"],
      default: "any",
    },
    location: {
      type: String,
      enum: ["front", "middle", "back", "any"],
      default: "any",
    },
    legroom: {
      type: String,
      enum: ["extra", "standard", "none"],
      default: "none",
    },
    quietZone: Boolean,
  },
  baggagePreference: {
    type: {
      type: String,
      enum: ["carry-on", "checked", "none"],
      default: "none",
    },
    extraAllowance: Boolean,
  },
  mealPreference: {
    type: String,
    enum: [
      "vegan",
      "halal",
      "kosher",
      "child",
      "diabetic",
      "vegetarian",
      "gluten-free",
      "standard",
    ],
    default: "standard",
  },
  specialAssistance: {
    wheelChair: { type: Boolean, default: false },
    boarding: { type: Boolean, default: false },
    elderlyInfant: { type: Boolean, default: false },
    medicalEquipment: { type: Boolean, default: false },
  },
  other: {
    entertainment: { type: Boolean, default: false },
    wifi: { type: Boolean, default: false },
    pets: { type: Boolean, default: false },
    powerOutlet: { type: Boolean, default: false },
  },
});

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
    preferences: preferencesSchema,

    // Compliance
    dateOfBirth: { type: Date, required: true },
    gender: { type: String, enum: ["male", "female"] },
    redressNumber: { type: String },
    knownTravelerNumber: { type: String },

    seatClass: {
      type: String,
      enum: ["economy", "premium_economy", "business", "first"],
      required: true,
    },
    //meta
    isPrimary: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export default passengerSchema;

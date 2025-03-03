import { Schema } from "mongoose";

const routesSchema = new Schema({
  departureAirportCode: { type: String, required: true },
  arrivalAirportCode: { type: String, required: true },
  distance: {
    lengthIn: { type: String, enum: ["mi"], required: true, default: "mi" },
    value: { type: Number, required: true },
  },
  basePriceByClass: {
    economy: { type: Number, required: true },
    premium_economy: { type: Number, required: true },
    business: { type: Number, required: true },
    first: { type: Number, required: true },
  },
  discount: {
    amountType: {
      type: String,
      enum: ["percentage", "fixed"],
      required: true,
      default: "percentage",
    }, // percentage from base price
    amount: { type: Number, required: true, default: 0 },
  },
  serviceFee: {
    amountType: {
      type: String,
      enum: ["percentage", "fixed"],
      required: true,
      default: "percentage",
    }, // percentage from base price
    amount: { type: Number, required: true, default: 0 },
  },
  taxes: {
    amountType: {
      type: String,
      enum: ["percentage", "fixed"],
      required: true,
      default: "percentage",
    }, // percentage from base price
    amount: { type: Number, required: true, default: 0 },
  },
});

const airlineSchema = new Schema(
  {
    _id: { type: String, required: true }, // airline IATA code
    iataCode: { type: String },
    name: { type: String, required: true },
    logo: { type: String, default: "" }, // URL to the airline logo
    contact: {
      phone: { type: String },
      email: { type: String },
      website: { type: String },
    },
    operatingRoutes: [routesSchema],
  },
  {
    timestamps: true,
  }
);

export default airlineSchema;

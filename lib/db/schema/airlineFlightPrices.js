import { Schema } from "mongoose";
const amountSchema = {
  type: {
    type: String,
    enum: ["percentage", "fixed"],
    required: true,
    default: "percentage",
  }, // percentage from base price
  amount: { type: Number, required: true, default: 0 },
};
const airlineFlightPricesSchema = new Schema({
  airlineCode: { type: String, ref: "Airline", required: true },
  departureAirportCode: { type: String, required: true },
  arrivalAirportCode: { type: String, required: true },
  distance: {
    lengthIn: { type: String, enum: ["mi"], required: true, default: "mi" },
    value: { type: Number, required: true },
  },
  basePrice: {
    economy: {
      adult: { type: Number, required: true },
      child: { type: Number, required: true },
      infant: { type: Number, required: true },
    },
    premium_economy: {
      adult: { type: Number, required: true },
      child: { type: Number, required: true },
      infant: { type: Number, required: true },
    },
    business: {
      adult: { type: Number, required: true },
      child: { type: Number, required: true },
      infant: { type: Number, required: true },
    },
    first: {
      adult: { type: Number, required: true },
      child: { type: Number, required: true },
      infant: { type: Number, required: true },
    },
  },
  discount: amountSchema,
  serviceFee: amountSchema,
  taxes: amountSchema,
});

export default airlineFlightPricesSchema;

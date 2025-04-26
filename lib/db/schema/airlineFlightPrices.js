import { Schema } from "mongoose";

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
      adults: { type: Number, required: true },
      children: { type: Number, required: true },
      infants: { type: Number, required: true },
    },
    premium_economy: {
      adults: { type: Number, required: true },
      children: { type: Number, required: true },
      infants: { type: Number, required: true },
    },
    business: {
      adults: { type: Number, required: true },
      children: { type: Number, required: true },
      infants: { type: Number, required: true },
    },
    first: {
      adults: { type: Number, required: true },
      children: { type: Number, required: true },
      infants: { type: Number, required: true },
    },
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

export default airlineFlightPricesSchema;

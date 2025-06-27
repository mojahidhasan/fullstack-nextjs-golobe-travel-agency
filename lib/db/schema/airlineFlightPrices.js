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

const basePriceSchema = createAgeGroupSchema({
  type: Number,
  required: true,
});
const amountBasedSchema = createAgeGroupSchema(amountSchema);

const airlineFlightPricesSchema = new Schema({
  airlineCode: { type: String, ref: "Airline", required: true },
  departureAirportCode: { type: String, required: true },
  arrivalAirportCode: { type: String, required: true },
  distance: {
    lengthIn: { type: String, enum: ["mi"], required: true, default: "mi" },
    value: { type: Number, required: true },
  },
  basePrice: {
    economy: basePriceSchema,
    premium_economy: basePriceSchema,
    business: basePriceSchema,
    first: basePriceSchema,
  },
  discount: amountBasedSchema,
  serviceFee: amountBasedSchema,
  taxes: amountBasedSchema,
});

export function createAgeGroupSchema(valueSchema) {
  return {
    adult: valueSchema,
    child: valueSchema,
    infant: valueSchema,
  };
}

export default airlineFlightPricesSchema;

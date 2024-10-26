import { Schema } from "mongoose";

const flightSchema = new Schema({
  flightNumber: { type: String, required: true, unique: true },
  departureAirportId: {
    type: Schema.Types.ObjectId,
    ref: "Airport",
    required: true,
  },
  arrivalAirportId: {
    type: Schema.Types.ObjectId,
    ref: "Airport",
    required: true,
  },

  departureDateTime: { type: Date, required: true },
  arrivalDateTime: { type: Date, required: true },

  airlineId: { type: Schema.Types.ObjectId, ref: "Airline", required: true },
  airplaneId: { type: Schema.Types.ObjectId, ref: "Airplane", required: true },

  isNonStops: { type: Boolean, required: true },
  layover: [{ type: String, required: true }],
  availableSeats: [{ type: Schema.Types.ObjectId, ref: "Seat" }],
  price: {
    economy: { type: Number, default: 0 },
    premiumEconomy: { type: Number, default: 0 },
    business: { type: Number, default: 0 },
    firstClass: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    serviceFee: { type: String, default: "" },
  },
});

export default flightSchema;

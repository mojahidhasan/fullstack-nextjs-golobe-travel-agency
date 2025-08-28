import { Schema } from "mongoose";
import airlineFlightPricesSchema from "./airlineFlightPrices";
import { baggageAllowanceSchema } from "./airlines";
import mongooseAutoPopulate from "mongoose-autopopulate";

const flightSegmentSchema = new Schema(
  {
    flightNumber: { type: String, required: true, unique: false },
    date: { type: Date, required: true }, // operational date
    airlineId: {
      type: String,
      ref: "Airline",
      required: true,
      autopopulate: true,
    },
    airplaneId: {
      type: Schema.Types.ObjectId,
      ref: "Airplane",
      required: true,
      autopopulate: true,
    },
    from: {
      airport: {
        type: String,
        ref: "Airport",
        required: true,
        autopopulate: true,
      },
      scheduledDeparture: { type: Date, required: true },
      terminal: String,
      gate: String,
    },
    to: {
      airport: {
        type: String,
        ref: "Airport",
        required: true,
        autopopulate: true,
      },
      scheduledArrival: { type: Date, required: true },
      terminal: String,
      gate: String,
    },
    durationMinutes: { type: Number, required: true },
    seats: [{ type: Schema.Types.ObjectId, ref: "FlightSeat", required: true }],
    fareDetails: { type: airlineFlightPricesSchema, required: true },
    baggageAllowance: baggageAllowanceSchema.clone(),
    status: {
      type: String,
      enum: ["scheduled", "delayed", "departed", "arrived", "cancelled"],
      default: "scheduled",
    },
    expireAt: {
      type: Date,
      required: true,
      expires: 365 * 24 * 60 * 60, // 1 year in seconds
    },
  },
  { timestamps: true },
);

flightSegmentSchema.plugin(mongooseAutoPopulate);

export default flightSegmentSchema;

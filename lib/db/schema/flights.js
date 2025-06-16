import { Schema } from "mongoose";
import mongooseAutoPopulate from "mongoose-autopopulate";
import seatSchema from "./seat";
import airlineFlightPricesSchema from "./airlineFlightPrices";
import { baggageAllowanceSchema } from "./airlines";

const flightSegmentSchema = new Schema({
  from: {
    airport: {
      type: String,
      ref: "Airport",
      required: true,
      autopopulate: true,
    },
    scheduledDeparture: {
      type: Date,
      required: true,
    },
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
    scheduledArrival: {
      type: Date,
      required: true,
    },
    terminal: String,
    gate: String,
  },
  airplaneId: {
    type: Schema.Types.ObjectId,
    ref: "Airplane",
    required: true,
    autopopulate: true,
  },
  durationMinutes: {
    type: Number,
    required: true,
  },
});

const flightSchema = new Schema(
  {
    flightNumber: {
      type: String,
      required: true,
      unique: true,
    },
    airlineId: {
      type: String,
      ref: "Airline",
      required: true,
      autopopulate: true,
    },
    segments: {
      type: [flightSegmentSchema],
      required: true,
      validate: [(val) => val.length > 0, "At least one segment is required."],
    },
    totalDurationMinutes: {
      type: Number,
      required: true,
    },
    layoverDurationMinutes: {
      type: Number,
      default: 0,
    },
    seats: [seatSchema],
    status: {
      type: String,
      enum: ["scheduled", "delayed", "departed", "arrived", "canceled"],
      default: "scheduled",
    },
    baggageAllowance: baggageAllowanceSchema.clone(),
    fareDetails: airlineFlightPricesSchema,
    expireAt: {
      type: Date,
      required: true,
      expires: 0,
    },
  },
  {
    timestamps: true,
  },
);

flightSchema.plugin(mongooseAutoPopulate);

export default flightSchema;

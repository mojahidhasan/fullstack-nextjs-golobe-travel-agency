import { Schema } from "mongoose";
import mongooseAutoPopulate from "mongoose-autopopulate";
import seatSchema from "./seat";
import airlineFlightPricesSchema from "./airlineFlightPrices";

const stopoverSchema = new Schema({
  _id: false,
  departure: {
    airport: {
      type: String,
      ref: "Airport",
      required: true,
      autopopulate: true,
    },
    scheduled: { type: Number, required: true }, // ms
    terminal: String,
    gate: String,
  }, //departure from the stopover airport
  arrival: {
    airport: {
      type: String,
      ref: "Airport",
      required: true,
      autopopulate: true,
    },
    scheduled: { type: Number, required: true }, // ms
    terminal: String,
    gate: String,
  }, //Arrival at the stopover airport
  layover: { type: Number, required: true }, // Duration of the stopover in minutes
  airplaneId: {
    type: Schema.Types.ObjectId,
    ref: "Airplane",
    required: true,
    autopopulate: true,
  },
  duration: {
    arrivalFromOrigin: { type: Number, required: true },
    arrivalToDestination: { type: Number, required: true },
  },
});

const baggageSchema = new Schema({
  _id: false,
  carryOn: {
    weight: {
      measurementUnit: {
        type: String,
        required: true,
        enum: ["kg"],
        default: "kg",
      },
      value: { type: Number, required: true, default: 2 },
    }, // in kg
  },
});

const flightSchema = new Schema(
  {
    // Flight Details
    flightNumber: { type: String, required: true, unique: true },
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
    departure: {
      airport: {
        type: String,
        ref: "Airport",
        required: true,
        autopopulate: true,
      },
      scheduled: { type: Number, required: true }, // ms
      terminal: String,
      gate: String,
    },
    arrival: {
      airport: {
        type: String,
        ref: "Airport",
        required: true,
        autopopulate: true,
      },
      scheduled: { type: Number, required: true }, // ms
      terminal: String,
      gate: String,
    },
    totalDuration: { type: Number, required: true },
    stopovers: [stopoverSchema],
    seats: [seatSchema],
    status: {
      type: String,
      enum: ["scheduled", "delayed", "departed", "arrived", "canceled"],
      default: "scheduled",
    },
    baggageAllowance: baggageSchema,
    fareDetails: airlineFlightPricesSchema,
    expireAt: { type: Date, required: true, expires: 0 },
  },
  {
    timestamps: true,
  },
);
flightSchema.plugin(mongooseAutoPopulate);
export default flightSchema;

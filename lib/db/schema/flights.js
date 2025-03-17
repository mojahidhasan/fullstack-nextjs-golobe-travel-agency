import { Schema } from "mongoose";
import mongooseAutoPopulate from "mongoose-autopopulate";

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

const seatSchema = new Schema({
  seatNumber: { type: String, required: true },
  class: { type: String, required: true },
  isAvailable: { type: Boolean, default: true }, // True if available, false if reserved
  reservation: {
    reserveDurationType: {
      type: String,
      enum: ["temporary", "permanent"],
      default: null,
    },

    reservedBy: {
      type: String,
      default: null,
    }, // User (userId if loggedIn or sessionID if not loggedIn)
    reservationExpiresAt: { type: Number, default: null }, // Expiry time for temporary reservation (milliseconds)
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
    seatAvailability: [seatSchema],
    status: {
      type: String,
      enum: ["scheduled", "delayed", "departed", "arrived", "canceled"],
      default: "scheduled",
    },
    priceReductionMultiplierPecentage: { type: Number, default: 0 },
    baggageAllowance: baggageSchema,
    expireAt: { type: Date, required: true, expires: 0 },
  },
  {
    timestamps: true,
  }
);
flightSchema.plugin(mongooseAutoPopulate);
export default flightSchema;

import { Schema } from "mongoose";
import mongooseAutoPopulate from "mongoose-autopopulate";
const stopoverSchema = new Schema(
  {
    departureAirportId: {
      type: String,
      ref: "Airport",
      required: true,
      autopopulate: true,
    },
    arrivalAirportId: {
      type: String,
      ref: "Airport",
      required: true,
      autopopulate: true,
    },
    departureDateTime: { type: Date, required: true },
    arrivalDateTime: { type: Date, required: true },
    duration: { type: Number, required: true },
    airplaneId: {
      type: Schema.Types.ObjectId,
      ref: "Airplane",
      required: true,
      autopopulate: { select: "-__v -seats" },
    },
    airlineId: {
      type: String,
      ref: "Airline",
      required: true,
      autopopulate: true,
    },
  },
  {
    _id: false,
  }
);

const flightSchema = new Schema(
  {
    flightNumber: { type: String, required: true, unique: true },
    originAirportId: {
      type: String,
      ref: "Airport",
      required: true,
      autopopulate: true,
    },
    destinationAirportId: {
      type: String,
      ref: "Airport",
      required: true,
      autopopulate: true,
    },
    departureDateTime: { type: Date, required: true },
    destinationArrivalDateTime: { type: Date, required: true },
    totalDuration: { type: Number, required: true },
    stopovers: [stopoverSchema],
    seats: [
      {
        _id: Schema.Types.ObjectId,
        seatNumber: String,
        airplaneId: {
          type: Schema.Types.ObjectId,
          ref: "Airplane",
          required: true,
          autopopulate: {
            select: "-__v -seats",
          },
        },
        class: String,
        availability: { type: Boolean, default: true },
      },
    ],
    availableSeats: { type: Number, required: true },
    status: {
      type: String,
      enum: ["scheduled", "in-air", "landed", "canceled"],
      required: true,
      default: "scheduled",
    },
    price: {
      economy: {
        base: Number,
        tax: Number,
        discount: Number,
        serviceFee: Number,
      },
      premium_economy: {
        base: Number,
        tax: Number,
        discount: Number,
        serviceFee: Number,
      },
      business: {
        base: Number,
        tax: Number,
        discount: Number,
        serviceFee: Number,
      },
      first: {
        base: Number,
        tax: Number,
        discount: Number,
        serviceFee: Number,
      },
    },
    expireAt: { type: Date, required: true },
  },
  {
    timestamps: true,
  }
);

flightSchema.plugin(mongooseAutoPopulate);
export default flightSchema;

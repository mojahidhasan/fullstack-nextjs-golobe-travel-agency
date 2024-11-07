import { Schema } from "mongoose";

const stopoverSchema = new Schema(
  {
    airportId: {
      type: String,
      ref: "Airport",
      required: true,
    },
    departureDateTime: { type: Date, required: true },
    arrivalDateTime: { type: Date, required: true },
    duration: { type: Number, required: true },
    airplaneId: { type: Schema.Types.ObjectId, ref: "Airplane" },
  },
  {
    _id: false,
  }
);

const flightSchema = new Schema(
  {
    flightNumber: { type: String, required: true, unique: true },
    airlineId: { type: String, ref: "Airline", required: true },

    departureAirportId: {
      type: String,
      ref: "Airport",
      required: true,
    },
    arrivalAirportId: {
      type: String,
      ref: "Airport",
      required: true,
    },
    duration: Number,
    departureDateTime: { type: Date, required: true },
    arrivalDateTime: { type: Date, required: true },

    airplaneId: {
      type: Schema.Types.ObjectId,
      ref: "Airplane",
      required: true,
    },

    stopovers: [stopoverSchema],
    availableSeats: [
      {
        _id: Schema.Types.ObjectId,
        seatNumber: String,
        airplaneId: Schema.Types.ObjectId,
        class: String,
        availability: { type: Boolean, default: true },
      },
    ],
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
      premiumEconomy: {
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
      firstClass: {
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

export default flightSchema;

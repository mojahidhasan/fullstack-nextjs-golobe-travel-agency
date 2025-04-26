import { Schema } from "mongoose";
import flightSchema from "./flights";
const flightBookingSchema = new Schema(
  {
    bookingRef: { type: String, unique: true, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    flightSnapshot: flightSchema,
    tripType: {
      type: String,
      enum: ["one_way", "round_trip", "multi_city"],
      required: true,
    },
    bookingStatus: {
      type: String,
      enum: ["confirmed", "pending", "cancelled", "refunded"],
      default: "confirmed",
    },
    passengers: [
      {
        type: Schema.Types.ObjectId,
        ref: "Passenger",
        required: true,
      },
    ],
    primaryPassenger: {
      type: Schema.Types.ObjectId,
      ref: "Passenger",
    },

    totalPrice: { type: Number, required: true },
    currency: { type: String, default: "USD" },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["credit_card", "paypal", "bank_transfer"],
      default: null,
    },

    seats: [
      {
        seatNumber: { type: String, required: true },
        class: { type: String, required: true },
        passengerId: {
          type: Schema.Types.ObjectId,
          ref: "Passenger",
          required: true,
        },
      },
    ],
    cabinClass: {
      type: String,
      enum: ["economy", "premium_economy", "business", "first"],
    },
    baggageAllowance: {
      checked: { type: Number, default: 0 },
      carryOn: { type: Number, default: 1 },
    },

    source: {
      type: String,
      enum: ["website", "mobile_app", "api", "agent_portal"],
      default: "website",
    },
  },
  { timestamps: true },
);
export default flightBookingSchema;

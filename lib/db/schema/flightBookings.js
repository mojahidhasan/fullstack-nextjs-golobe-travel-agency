import { Schema } from "mongoose";
import flightSchema from "./flights";
import seatSchema from "./seat";
import mongooseAutoPopulate from "mongoose-autopopulate";

const refundInfoSchema = new Schema(
  {
    status: {
      type: String,
      enum: ["not_requested", "requested", "approved", "denied", "refunded"],
      default: "not_requested",
    },
    reason: { type: String },
    amount: { type: Number },
    requestedAt: { type: Date },
    refundedAt: { type: Date },
    refundableUntil: { type: Date },
    refundDeadline: { type: Date },
    penaltyFee: { type: Number },
    isManual: { type: Boolean, default: false },
  },
  { _id: false },
);

const cancellationInfoSchema = new Schema(
  {
    reason: { type: String },
    cancelableUntil: { type: Date },
    canceledAt: { type: Date },
    canceledBy: {
      type: String,
      enum: ["user", "admin", "system"],
    },
    cancellationFee: { type: Number },
  },
  { _id: false },
);

const flightSnapshotSchema = flightSchema.clone();
flightSnapshotSchema.clearIndexes();
flightSnapshotSchema.set("autoIndex", false);

const flightBookingSchema = new Schema(
  {
    bookingRef: { type: String, unique: true, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    flightSnapshot: flightSnapshotSchema,
    tripType: {
      type: String,
      enum: ["one_way", "round_trip", "multi_city"],
      required: true,
    },
    bookingStatus: {
      type: String,
      enum: ["confirmed", "pending", "canceled", "refunded"],
      default: "pending",
    },
    passengers: [
      {
        type: Schema.Types.ObjectId,
        ref: "Passenger",
        required: true,
        autopopulate: true,
      },
    ],
    seats: [seatSchema],
    totalPrice: { type: Number, required: true },
    currency: { type: String, default: "usd" },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    paymentId: {
      type: Schema.Types.ObjectId,
      ref: "FlightPayment",
      default: null,
      autopopulate: true,
    },

    ticketType: {
      type: String,
      enum: ["refundable", "non_refundable", "partially_refundable"],
      required: true,
    },

    fareClass: {
      type: String,
      default: "", // e.g., 'Y', 'B', 'J', 'F'
    },

    refundInfo: {
      type: refundInfoSchema,
      default: () => ({}),
    },

    cancellationInfo: {
      type: cancellationInfoSchema,
      default: () => ({}),
    },

    source: {
      type: String,
      enum: ["website", "mobile_app", "api", "agent_portal"],
      default: "website",
    },

    temporaryReservationExpiresAt: { type: Date, required: true },

    //metaData
    timeZone: { type: String, required: true },
  },
  { timestamps: true },
);

flightBookingSchema.plugin(mongooseAutoPopulate);

export default flightBookingSchema;

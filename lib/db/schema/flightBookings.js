import { Schema } from "mongoose";

const flightBookingSchema = new Schema(
  {
    flightId: { type: Schema.Types.ObjectId, ref: "Flight", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    passengers: [
      {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        age: { type: Number, required: true },
        gender: { type: String, enum: ["male", "female"] },
        seatNumber: { type: String, required: true },
        class: {
          type: String,
          enum: ["economy", "premium_economy", "business", "first"],
          required: true,
        },
      },
    ],
    totalPrice: { type: Number, required: true },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "cancelled", "refunded"],
      default: "pending",
    },
    bookingDate: { type: Date, default: Date.now() },
  },
  {
    timestamps: true,
  }
);

export default flightBookingSchema;

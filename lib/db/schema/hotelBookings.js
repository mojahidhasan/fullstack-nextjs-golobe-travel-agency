import { Schema } from "mongoose";

const hotelBookingSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    hotelId: { type: Schema.Types.ObjectId, ref: "Hotel", required: true },
    rooms: [{ type: Schema.Types.ObjectId, ref: "HotelRoom", required: true }],
    checkInDate: { type: Date, required: true },
    checkOutDate: { type: Date, required: true },
    totalGuests: { type: Number, required: true },
    adults: Number,
    children: Number,
    totalPrice: Number,
    status: {
      type: String,
      enum: ["confirmed", "pending", "cancelled"],
      default: "confirmed",
    },
    guaranteedReservationUntil: Date,
    payment: {
      method: { type: String, enum: ["card", "cash"], default: null }, // e.g., card, cash
      status: {
        type: String,
        enum: ["paid", "unpaid", "refunded"],
        default: "unpaid",
      },
      transactionId: { type: String, default: null },
    },
  },
  { timestamps: true },
);

export default hotelBookingSchema;

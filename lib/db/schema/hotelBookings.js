import { Schema } from "mongoose";
import mongooseAutoPopulate from "mongoose-autopopulate";
const hotelBookingSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    hotelId: { type: Schema.Types.ObjectId, ref: "Hotel", required: true },
    rooms: [{ type: Schema.Types.ObjectId, ref: "HotelRoom", required: true }],
    checkInDate: { type: Date, required: true },
    checkOutDate: { type: Date, required: true },
    guests: [
      {
        type: Schema.Types.ObjectId,
        ref: "HotelGuest",
        required: true,
        autopopulate: true,
      },
    ],
    fareBreakdown: Object,
    totalPrice: Number,
    bookingStatus: {
      type: String,
      enum: ["confirmed", "pending", "cancelled"],
      default: "confirmed",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["card", "cash"],
    },
    paymentId: {
      type: Schema.Types.ObjectId,
      ref: "HotelPayment",
      autopopulate: true,
    },
    guaranteedReservationUntil: Date,
    bookedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

hotelBookingSchema.plugin(mongooseAutoPopulate);
export default hotelBookingSchema;

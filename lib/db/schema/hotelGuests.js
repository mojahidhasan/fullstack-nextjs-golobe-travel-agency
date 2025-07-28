import { Schema } from "mongoose";

const hotelGuestSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    hotelBookingId: {
      type: Schema.Types.ObjectId,
      ref: "HotelBooking",
      required: true,
    },
    firstName: { type: String, required: true },
    lastName: { type: String },
    email: { type: String },
    phone: { type: String },
    guestType: {
      type: String,
      enum: ["adult", "child", "infant"],
      default: "adult",
    },
    age: { type: Number },
    isPrimary: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export default hotelGuestSchema;

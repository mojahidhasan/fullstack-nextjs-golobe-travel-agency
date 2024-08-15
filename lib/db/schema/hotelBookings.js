import { Schema } from "mongoose";

const hotelBookingSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  roomId: { type: Schema.Types.ObjectId, ref: "HotelRoom" },
  checkInDate: { type: Date, required: true },
  checkOutDate: { type: Date, required: true },
  totalAmount: { type: Number, required: true },
  paidAmount: { type: Number, required: false },
  bookingStatus: { type: String, required: true, default: "pending" },
  bookingDate: { type: Date, required: true },
});

export default hotelBookingSchema;

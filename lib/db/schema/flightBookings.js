import { Schema } from "mongoose";

const flightBookingSchema = new Schema({
  flightId: { type: Schema.Types.ObjectId, ref: "Flight" },
  passengerId: { type: Schema.Types.ObjectId, ref: "Passenger" },
  seatNumber: { type: String, required: true },
  bookingDate: { type: Date, required: true },
  paymentStatus: { type: String, default: "pending" },
});

export default flightBookingSchema;

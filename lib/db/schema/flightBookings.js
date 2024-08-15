import { Schema } from "mongoose";

const flightBookingSchema = new Schema({
  flightId: { type: Schema.Types.ObjectId, ref: "Flight" },
  passengerId: { type: Schema.Types.ObjectId, ref: "Passenger" },
  paymentStatus: { type: String, default: "pending" },
});

export default flightBookingSchema;

import { Schema } from "mongoose";

export const airplaneSchema = new Schema({
  airlineId: { type: Schema.Types.ObjectId, ref: "Airline", required: true },
  model: { type: String, required: true },
  facilities: [{ type: String, required: true }],
  totalSeats: Number,
  seats: [{ type: Schema.Types.ObjectId, ref: "Seat" }],
});

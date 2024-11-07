import { Schema } from "mongoose";

const airplaneSchema = new Schema({
  airlineId: { type: String, ref: "Airline", required: true },
  model: { type: String, required: true },
  classes: [{ type: String, required: true }],
  facilities: [{ type: String, required: true }],
  totalSeats: Number,
  seats: [{ type: Schema.Types.ObjectId, ref: "Seat" }],
});

export default airplaneSchema;

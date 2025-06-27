import { Schema } from "mongoose";
import seatSchema from "./seat";
const airplaneSchema = new Schema({
  airlineId: { type: String, ref: "Airline", required: true },
  model: { type: String, required: true },
  cruiseSpeed: {
    speedIn: { type: String, enum: ["mi"], required: true, default: "mi" },
    per: { type: String, enum: ["hour"], required: true, default: "hour" },
    value: { type: Number, required: true },
  },
  classes: [{ type: String, required: true }],
  facilities: [{ type: String }],
  totalSeats: { type: Number, required: true },
  seats: [seatSchema],
  images: [{ type: String }],
});

export default airplaneSchema;

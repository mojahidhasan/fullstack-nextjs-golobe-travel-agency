import { Schema } from "mongoose";

export const seatSchema = new Schema({
  seatNumber: { type: Number, required: true, unique: true },
  airplaneId: { type: Schema.Types.ObjectId, ref: "Airplane", required: true },
  class: { type: String, required: true },
  availability: { type: Boolean, required: true, default: true },
});

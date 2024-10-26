import { Schema } from "mongoose";

export const flightStatusSchema = new Schema({
  flightId: { type: Schema.Types.ObjectId, ref: "Flight" },
  status: { type: String, required: true },
  updateTimestamp: { type: Date, required: true },
});

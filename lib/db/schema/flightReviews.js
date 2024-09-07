import { Schema } from "mongoose";

const flightReviewSchema = new Schema({
  flightId: { type: Schema.Types.ObjectId, ref: "Flight" },
  reviewer: { type: Schema.Types.ObjectId, ref: "User" },
  rating: { type: Number, required: true },
  comment: { type: String, required: true },
  flaged: { type: Boolean, default: false },
  timestamp: { type: Date, required: true },
});

export default flightReviewSchema;

import { Schema } from "mongoose";

const flightReviewSchema = new Schema({
  flightId: { type: Schema.Types.ObjectId, ref: "Flight", required: true },
  reviewer: { type: Schema.Types.ObjectId, ref: "User", required: true },
  rating: { type: Number, required: true },
  comment: { type: String, required: true },
  flaged: { type: Number, default: 0 },
  timestamp: { type: Date, required: true },
});

export default flightReviewSchema;
import { Schema } from "mongoose";

const flightReviewSchema = new Schema({
  airlineId: { type: String, required: true },
  departAirportId: { type: String, required: true },
  returnAirportId: { type: String, required: true },
  reviewer: { type: Schema.Types.ObjectId, ref: "User", required: true },
  rating: { type: Number, required: true },
  comment: { type: String, required: true },
  flaged: [{ type: Schema.Types.ObjectId, ref: "User", unique: true }],
  reviewedAt: { type: Date, required: true, default: Date.now() },
  updatedAt: { type: Date, required: true, default: Date.now() },
});

export default flightReviewSchema;

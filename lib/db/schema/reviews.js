import { Schema } from "mongoose";

const flightReviewSchema = new Schema({
  flightId: { type: Schema.Types.ObjectId, ref: "Flight" },
  reviewer: { type: Schema.Types.ObjectId, ref: "User" },
  rating: { type: Number, required: true },
  comment: { type: String, required: true },
  flaged: { type: Boolean, default: false },
  timestamp: { type: Date, required: true },
});
const hotelReviewSchema = new Schema({
  hotelId: { type: Schema.Types.ObjectId, ref: "Hotel" },
  reviewer: { type: Schema.Types.ObjectId, ref: "User" },
  rating: { type: Number, required: true },
  comment: { type: String, required: true },
  flaged: { type: Boolean, default: false },
  timestamp: { type: Date, required: true },
});

const reviewSchema = new Schema({
  flightsReview: flightReviewSchema,
  hotelReview: hotelReviewSchema,
});

export default reviewSchema;

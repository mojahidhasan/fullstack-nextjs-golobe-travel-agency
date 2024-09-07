import { Schema } from "mongoose";

const hotelReviewSchema = new Schema({
  hotelId: { type: Schema.Types.ObjectId, ref: "Hotel" },
  reviewer: { type: Schema.Types.ObjectId, ref: "User" },
  rating: { type: Number, required: true },
  comment: { type: String, required: true },
  flaged: { type: Boolean, default: false },
  timestamp: { type: Date, required: true },
});

export default hotelReviewSchema;

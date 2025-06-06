import { Schema } from "mongoose";

const hotelReviewSchema = new Schema(
  {
    slug: { type: String, required: true },
    hotelId: { type: Schema.Types.ObjectId, ref: "Hotel" },
    reviewer: { type: Schema.Types.ObjectId, ref: "User" },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    flagged: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  {
    timestamps: true,
  },
);

export default hotelReviewSchema;

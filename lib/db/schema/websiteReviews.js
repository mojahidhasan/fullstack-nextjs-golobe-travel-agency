import { Schema } from "mongoose";
import mongooseAutoPopulate from "mongoose-autopopulate";

const websiteReviewSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      autopopulate: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    category: {
      type: String,
      enum: [
        "customer_support", // responsiveness, helpfulness
        "pricing", // fairness, hidden fees, transparency
        "reliability", // trust, booking confirmation accuracy
        "communication", // clarity of emails/notifications
        "overall", // overall service experience
      ],
      default: "overall",
    },
    comment: {
      type: String,
      maxlength: 1000,
    },
  },
  { timestamps: true },
);

websiteReviewSchema.plugin(mongooseAutoPopulate);

export default websiteReviewSchema;

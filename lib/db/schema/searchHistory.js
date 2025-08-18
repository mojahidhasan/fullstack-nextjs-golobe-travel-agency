import { Schema } from "mongoose";

const searchHistorySchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["flight", "hotel"], required: true },
    searchState: { type: Object, required: true },
  },
  {
    timestamps: true,
  },
);

export default searchHistorySchema;

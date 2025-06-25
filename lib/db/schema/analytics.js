import { Schema } from "mongoose";

const analyticsSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    data: {
      totalUserSignedUp: { type: Number, required: true, default: 0 },
      accountDeteted: { type: Number, required: true, default: 0 },
    },
  },
  {
    timestamps: true,
  },
);

export default analyticsSchema;

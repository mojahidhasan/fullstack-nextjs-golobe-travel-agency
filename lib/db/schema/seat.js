import { Schema } from "mongoose";

const seatSchema = new Schema({
  _id: { type: Schema.Types.ObjectId, required: true },
  seatNumber: { type: String, required: true },
  airplaneId: { type: Schema.Types.ObjectId, ref: "Airplane", required: true },
  class: {
    type: String,
    enum: ["economy", "premium_economy", "business", "first"],
    required: true,
  },
  reservation: {
    type: { type: String, enum: ["temporary", "permanent"], default: null },
    expiresAt: { type: Number, default: 0 },
    for: {
      type: Schema.Types.ObjectId,
      ref: "Passenger",
      default: null,
    },
  },
  metaData: Object,
});

export default seatSchema;

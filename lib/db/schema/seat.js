import { Schema } from "mongoose";

const seatSchema = new Schema({
  _id: { type: Schema.Types.ObjectId, required: true },
  seatNumber: { type: String, required: true },
  airplaneId: { type: Schema.Types.ObjectId, ref: "Airplane", required: true },
  class: { type: String, required: true },
  availability: { type: Boolean, required: true, default: true },
});

export default seatSchema;

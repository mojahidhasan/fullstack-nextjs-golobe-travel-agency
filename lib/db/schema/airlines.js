import { Schema } from "mongoose";

export const airlineSchema = new Schema({
  airlineId: { type: String, required: true },
  airlineName: { type: String, required: true },
  contactNumber: { type: Number, required: false, default: null },
  operatingRegion: [{ type: String, required: false }],
});

export default airlineSchema;

import { Schema } from "mongoose";

export const airlineSchema = new Schema({
  airlineId: { type: String, required: true },
  airlineName: { type: String, required: true },
  contactNumber: { type: Number, required: true },
  operatingRegion: [{ type: String, required: true }],
});

export default airlineSchema;

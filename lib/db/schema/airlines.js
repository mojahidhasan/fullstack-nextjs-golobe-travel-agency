import { Schema } from "mongoose";

export const airlineSchema = new Schema({
  name: { type: String, required: true },
  iataCode: { type: String, required: true },
  airplanes: [{ type: Schema.Types.ObjectId, ref: "Airplane", required: true }],
});

export default airlineSchema;

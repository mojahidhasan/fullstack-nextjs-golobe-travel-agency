import { Schema } from "mongoose";

export const airlineSchema = new Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    iataCode: { type: String, required: true },
    airplanes: [{ type: Schema.Types.ObjectId, ref: "Airplane" }],
  },
  {
    timestamps: true,
  }
);

export default airlineSchema;

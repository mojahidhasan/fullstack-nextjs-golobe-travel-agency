import { Schema } from "mongoose";
import { flightRelatedDataSchema, hotelRelatedDataSchema } from "./user";
const anonymousUserSchema = new Schema(
  {
    sessionId: { type: String, unique: true, required: true },
    flights: flightRelatedDataSchema,
    hotels: hotelRelatedDataSchema,
    expireAt: { type: Date, expires: 0 },
  },
  { timestamps: true }
);

export default anonymousUserSchema;

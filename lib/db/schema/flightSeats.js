import { Schema } from "mongoose";
import seatSchema from "./seat";

const flightSeatsSchema = seatSchema.clone();
flightSeatsSchema.add({
  segmentId: { type: Schema.Types.ObjectId, ref: "FlightSegment" },
});
export default flightSeatsSchema;

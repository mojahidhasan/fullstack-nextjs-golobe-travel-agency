import { Schema } from "mongoose";

const airportSchema = new Schema({
  _id: { type: String, required: true },
  iataCode: { type: String, required: true },
  name: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String || null, required: true },
  country: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  timezone: { type: String, required: true },
  facilities: [{ type: String, required: false }],
});

export default airportSchema;

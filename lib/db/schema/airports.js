import { Schema } from "mongoose";

const airportSchema = new Schema({
  airportCode: { type: String, required: true },
  airportName: { type: String, required: true },
  location: {
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
  facilities: [{ type: String, required: false }],
});

export default airportSchema;

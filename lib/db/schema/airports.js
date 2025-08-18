import { Schema } from "mongoose";

const airportSchema = new Schema(
  {
    _id: { type: String, required: true }, // airport IATA code // primary key
    iataCode: { type: String },
    name: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: false }, // Optional for countries without states
    country: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    timezone: { type: String, required: true },
    facilities: [{ type: String }], // e.g., "Wi-Fi", "Lounge", "Restaurants"
    image: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

export default airportSchema;

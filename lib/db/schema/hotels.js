import { Schema } from "mongoose";

const hotelSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  country: { type: String, required: true },
  postalCode: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  facilities: [{ type: String, required: true }],
  images: [{ type: String, required: true }],
  phoneNumber: { type: String, required: false, default: null },
  email: { type: String, required: false, default: null },
  website: { type: String, required: false, default: null },
});

export default hotelSchema;

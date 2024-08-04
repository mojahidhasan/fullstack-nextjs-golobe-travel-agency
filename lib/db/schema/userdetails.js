import { Schema } from "mongoose";

const emailSchema = new Schema({
  _id: false,
  email: { type: String, required: true, unique: true },
  emailVerified: { type: Boolean, default: null },
  primary: { type: Boolean, default: false },
});

const userDetailsSchema = new Schema({
  likes: {
    flights: [{ type: Schema.Types.ObjectId, ref: "Flight" }],
    hotels: [{ type: Schema.Types.ObjectId, ref: "Hotel" }],
  },
  searchHistory: [{ type: Schema.Types.ObjectId, ref: "SearchHistory" }],
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: [emailSchema],
  coverImage: { type: String, required: false },
  phone: {
    number: String,
    verified: { type: Boolean, default: false },
  },
  address: String || null,
  dateOfBirth: Date || null,
  userId: { type: Schema.Types.ObjectId, ref: "User" },
});

export default userDetailsSchema;

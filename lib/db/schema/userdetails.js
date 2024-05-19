import { Schema } from "mongoose";

const emailSchema = new Schema({
  _id: false,
  username: { type: String, required: true, unique: true },
  verified: { type: Boolean, default: false },
});

export const userdetailsSchema = new Schema({
  likedFlights: { type: Schema.Types.ObjectId, ref: "Flight" },
  likedHotels: { type: Schema.Types.ObjectId, ref: "Hotel" },
  searchHistory: { type: Schema.Types.ObjectId, ref: "SearchHistory" },
  profileInfo: {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: [emailSchema],
    phone: {
      number: String,
      verified: { type: Boolean, default: false },
    },
    address: String,
    dateOfBirth: Date,
    images: {
      avatar: { type: String, default: "" },
      cover: { type: String, default: "" },
    },
  },
});

import { Schema } from "mongoose";

export const userdetailsSchema = new Schema({
  likedFlights: [Schema.Types.ObjectId],
  likedHotels: [Schema.Types.ObjectId],
  searchHistory: [Schema.Types.ObjectId],
  profileInfo: {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: [Schema.Types.String, { unique: true, lowercase: true }],
    phone: String,
    address: String,
    dateOfBirth: Date,
    images: {
      avatar: String,
      cover: String,
    },
  },
});

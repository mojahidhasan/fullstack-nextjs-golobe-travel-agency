import { Schema } from "mongoose";

const hotelSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: String,
    parkingIncluded: Boolean,
    lastRenovationDate: Date || null,
    isDeleted: Boolean,
    address: {
      streetAddress: String,
      city: String,
      stateProvince: String,
      postalCode: String,
      country: String,
    },
    coordinates: {
      lat: { type: Number, required: true },
      lon: { type: Number, required: true },
    },
    amenities: [{ type: String, required: true }],
    policies: {
      checkInTime: { type: String, required: true },
      checkOutTime: { type: String, required: true },
      cancellationPolicy: { type: String, required: true },
      petPolicy: { type: String, required: true },
    },
    images: [{ type: String, required: true }],
    status: {
      type: String,
      enum: ["Opened", "Closed"],
      required: true,
      default: "Opened",
    },
    totalRooms: { type: Number, required: true },
    rooms: [{ type: Schema.Types.ObjectId, ref: "HotelRoom" }],
    reviews: [{ type: Schema.Types.ObjectId, ref: "HotelReview" }],
    tags: [{ type: String, required: true }],
  },
  {
    timestamps: true,
  }
);

export default hotelSchema;

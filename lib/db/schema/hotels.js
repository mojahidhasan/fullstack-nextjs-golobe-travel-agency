import { Schema } from "mongoose";
import mongooseAutoPopulate from "mongoose-autopopulate";
const hotelSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: String,
    parkingIncluded: Boolean,
    lastRenovationDate: Date || null,
    isDeleted: Boolean,
    query: String,
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
    features: [{ type: String, required: true }],
    policies: {
      checkIn: { type: String, required: true },
      checkOut: { type: String, required: true },
      cancellationPolicy: {
        freeCancellation: Boolean,
        cancellationFee: Number || null,
        cancellationDeadline: String,
      },
      childrenPolicy: {
        allowed: Boolean,
        freeStayUnderAge: Number,
      },
      petPolicy: {
        allowed: Boolean,
        petFee: Number || null,
      },
      smokingPolicy: {
        allowed: Boolean,
        designatedAreasOnly: Boolean,
      },
    },
    images: [{ type: String, required: true }],
    status: {
      type: String,
      enum: ["Opened", "Closed"],
      required: true,
      default: "Opened",
    },
    totalRooms: { type: Number, required: true },
    rooms: [
      { type: Schema.Types.ObjectId, ref: "HotelRoom", autopopulate: true },
    ],
    tags: [{ type: String, required: true }],
  },
  {
    timestamps: true,
  }
);

hotelSchema.plugin(mongooseAutoPopulate);
export default hotelSchema;

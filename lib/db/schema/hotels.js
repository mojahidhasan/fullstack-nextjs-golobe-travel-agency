import { Schema } from "mongoose";
import mongooseAutoPopulate from "mongoose-autopopulate";

const policiesSchema = new Schema({
  _id: false,
  checkIn: { type: String, required: true },
  checkOut: { type: String, required: true },
  cancellationPolicy: {
    cancellable: { type: Boolean, required: true },
    cancellableUntil: {
      unit: {
        type: String,
        enum: ["days", "hours", "minutes", "seconds"],
        required: true,
      },
      value: { type: Number, required: true },
    }, //relative to checkIn date. Can be negative
    cancellationFee: Number,
    cancellationDeadline: String,
  },
  refundPolicy: {
    refundable: { type: Boolean, default: true },
    refundFee: { type: Number, default: 0 },
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
  paymentPolicy: {
    creditCards: Boolean,
    cash: Boolean,
  },
});

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
      type: { type: String },
      lat: { type: Number, required: true },
      lon: { type: Number, required: true },
    },
    amenities: [{ type: String, required: true }],
    features: [{ type: String, required: true }],
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
    policies: { type: policiesSchema },
  },
  {
    timestamps: true,
  },
);

hotelSchema.plugin(mongooseAutoPopulate);
export default hotelSchema;

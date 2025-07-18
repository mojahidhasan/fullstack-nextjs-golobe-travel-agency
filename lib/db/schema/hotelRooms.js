import { Schema } from "mongoose";
const hotelRoomSchema = new Schema(
  {
    hotelId: { type: Schema.Types.ObjectId, ref: "Hotel" },
    description: { type: String, required: true },
    roomType: String,
    features: [{ type: String, required: true }],
    amenities: [{ type: String, required: true }],
    images: [{ type: String, required: true }],
    price: {
      base: { type: Number, required: true },
      tax: { type: Number, default: 0 },
      discount: {
        amount: { type: Number, default: 0 },
        type: {
          type: String,
          enum: ["percentage", "fixed"],
          default: "percentage",
        },
        validUntil: Date,
      },
      serviceFee: { type: Number, default: 0 },
      currency: { type: String, default: "USD" },
    },
    totalBeds: { type: Number, required: true, default: 1 },
    bedOptions: String,
    sleepsCount: Number,
    smokingAllowed: Boolean,
    maxAdults: Number,
    maxChildren: Number,

    extraBedAllowed: Boolean,
    floor: Number,
    roomNumber: String,

    tags: [{ type: String }],
  },
  {
    timestamps: true,
  },
);

export default hotelRoomSchema;

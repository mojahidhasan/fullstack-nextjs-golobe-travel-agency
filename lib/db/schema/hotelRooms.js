import { Schema } from "mongoose";

const availabilitySchema = new Schema({
  checkedIn: { type: Date || null, required: true },
  willCheckedOut: { type: Date || null, required: true },
})

const hotelRoomSchema = new Schema(
  {
    hotelId: { type: Schema.Types.ObjectId, ref: "Hotel" },
    description: { type: String, required: true },
    roomType: String,
    features: [{ type: String, required: true }],
    amenities: [{ type: String, required: true }],
    images: [{ type: String, required: true }],
    price: { 
      base: Number,
      tax: Number,
      discount: Number,
      serviceFee: Number
    },
    totalBeds: { type: Number, required: true, default: 1 },
    bedOptions: String,
    sleepsCount: Number,
    smokingAllowed: Boolean,
    availability: [availabilitySchema],
  },
  {
    timestamps: true,
  }
);

export default hotelRoomSchema;

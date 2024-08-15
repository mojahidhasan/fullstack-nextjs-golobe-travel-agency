import { Schema } from "mongoose";

const hotelRoomSchema = new Schema({
  hotelId: { type: Schema.Types.ObjectId, ref: "Hotel" },
  title: { type: String, required: true },
  roomType: { type: String, required: true },
  price: { type: Number, required: true },
  availabillity: { type: Boolean, required: true, default: true },
  features: [{ type: String, required: true }],
});

export default hotelRoomSchema;

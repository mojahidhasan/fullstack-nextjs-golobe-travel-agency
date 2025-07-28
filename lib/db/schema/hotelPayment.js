import { Schema } from "mongoose";

const hotelPaymentSchema = new Schema(
  {
    bookingId: { type: Schema.Types.ObjectId, ref: "HotelBooking" },
    paymentMethod: {
      id: String,
      methodType: String,
      brand: String,
      last4: String,
    },
    amount: { type: Number, required: true },
    paymentDate: { type: Number, required: true },
    transactionId: { type: String, required: true },
    receiptUrl: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

export default hotelPaymentSchema;

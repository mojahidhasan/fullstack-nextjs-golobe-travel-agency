import { Schema } from "mongoose";

const hotelPaymentSchema = new Schema(
  {
    bookingId: { type: Schema.Types.ObjectId, ref: "HotelBooking" },
    transactionId: { type: String, required: true },
    stripe_paymentIntentId: { type: String, required: true },
    stripe_chargeId: { type: String, required: true },
    paymentMethod: {
      id: String,
      methodType: String,
      brand: String,
      last4: String,
    },
    amount: { type: Number, required: true },
    paymentDate: { type: Number, required: true },
    receiptUrl: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

export default hotelPaymentSchema;

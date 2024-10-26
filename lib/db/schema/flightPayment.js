import { Schema } from "mongoose";

export const flightPaymentSchema = new Schema({
  bookingId: { type: Schema.Types.ObjectId, ref: "Flight" },
  paymentMethod: { type: String, required: true },
  amount: { type: Number, required: true },
  paymentDate: { type: Date, required: true },
  transactionId: { type: String, required: true },
});

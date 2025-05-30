import { Schema } from "mongoose";

const flightPaymentSchema = new Schema(
  {
    bookingId: { type: Schema.Types.ObjectId, ref: "FlightBooking" },
    paymentMethod: {
      id: String,
      methodType: String,
      brand: String,
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

export default flightPaymentSchema;

import { Schema } from "mongoose";

const flightSchema = new Schema({
  flightDetails: {
    airline: {
      name: { type: String, required: true },
      iataCode: { type: String, required: true },
    },
    departFrom: {
      name: { type: String, required: true },
      iataCode: { type: String, required: true },
    },
    arriveTo: {
      name: { type: String, required: true },
      iataCode: { type: String, required: true },
    },
    departTime: { type: String, required: true },
    arriveTime: { type: String, required: true },
    timeTaken: { type: Number, required: true },
    airplane: {
      name: { type: String, required: true },
      iataTypeCode: { type: String, required: true },
    },
  },
  price: {
    base: { type: String, required: true },
    tax: { type: Number, required: true },
    discount: { type: Number, required: true },
    serviceFee: { type: String, required: true },
  },
  reviews: [
    {
      rating: { type: Number, required: true },
      comment: { type: String, required: true },
      reviewer: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    },
  ],
});

export default flightSchema;

import { Schema } from "mongoose";

const flightSchema = new Schema({
  flightNumber: { type: String, required: true },
  airline: {
    name: { type: String, required: true },
    iataCode: { type: String, required: true },
  },
  departureDateTime: { type: Date, required: true },
  arrivalDateTime: { type: Date, required: true },
  originAirport: {
    name: { type: String, required: true },
    iataCode: { type: String, required: true },
  },
  destinationAirport: {
    name: { type: String, required: true },
    iataCode: { type: String, required: true },
  },
  availableSeats: { type: Number, required: true },
  airplane: {
    name: { type: String, required: true },
    iataCode: { type: String, required: true },
  },
  price: {
    base: { type: String, required: true },
    tax: { type: Number, required: true },
    discount: { type: Number, required: true },
    serviceFee: { type: String, required: true },
  },
});

export default flightSchema;

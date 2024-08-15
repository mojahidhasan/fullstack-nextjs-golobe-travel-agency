import { Schema } from "mongoose";

const passengerSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phoneNumber: { type: String, required: false },
  passportNumber: { type: Number, required: true },
});

export default passengerSchema;

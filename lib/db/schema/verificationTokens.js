import { Schema } from "mongoose";

const verificationTokenSchema = new Schema({
  identifier: { type: String, required: true },
  token: { type: String, required: true },
  expires: { type: Date, required: true },
});

export default verificationTokenSchema;

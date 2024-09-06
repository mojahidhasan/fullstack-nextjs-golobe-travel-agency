import { Schema } from "mongoose";

export const verificationTokenSchema = new Schema({
  identifier: { type: String, required: true },
  token: { type: String, required: true },
  expires: { type: Date, required: true },
});

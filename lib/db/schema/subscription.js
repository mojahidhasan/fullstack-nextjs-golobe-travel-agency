import { Schema } from "mongoose";

const emailRegex =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const subscriptionSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: emailRegex,
  },
  emailVerified: { type: Date || null, default: null },
  subscribed: { type: Boolean, default: true },
  userId: { type: Schema.Types.ObjectId || null, ref: "User", default: null },
});

export default subscriptionSchema;

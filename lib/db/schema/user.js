import { Schema } from "mongoose";

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  image: { type: String, required: false },
  emailVerified: { type: Date || null, required: false, default: null },
  passwordResetCode: Number,
});

export default userSchema;

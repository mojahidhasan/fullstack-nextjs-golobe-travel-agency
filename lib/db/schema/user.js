import { Schema } from "mongoose";

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  image: { type: String, required: true },
  emailVerified: { type: Date || null, required: false, default: null },
});

export default userSchema;

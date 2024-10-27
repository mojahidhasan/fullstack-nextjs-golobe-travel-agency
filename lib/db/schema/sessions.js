import { Schema } from "mongoose";

const sessionSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  sessionToken: { type: String, required: true },
  expires: { type: Date, required: true },
});

export default sessionSchema;

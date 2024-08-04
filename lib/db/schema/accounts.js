import { Schema } from "mongoose";

const accountsSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  type: { type: String, required: true, default: "credential" },
  provider: { type: String, required: true, default: "golob" },
  password: { type: String, required: true },
});

export default accountsSchema;

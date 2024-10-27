import { Schema } from "mongoose";

const accountsSchema = new Schema({
  password: { type: String },
  providerAccountId: { type: String, required: true },
  provider: { type: String, required: true, default: "credentials" },
  type: { type: String, required: true, default: "credentials" },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

export default accountsSchema;

import { Schema } from "mongoose";

export const userinfoSchema = new Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
});

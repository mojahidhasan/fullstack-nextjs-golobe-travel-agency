import { Schema } from "mongoose";

const analyticsSchema = new Schema(
  {
    _id: { type: String, default: "analytics" },
    totalUsersSignedUp: { type: Number, default: 0 },
    totalAccountsDeleted: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  },
);

export default analyticsSchema;

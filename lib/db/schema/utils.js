import { Schema } from "mongoose";

const utilsSchema = new Schema({
  lastFlightDate: Date,
  serverMaintenance: {
    willStartMaintenance: { type: Number, required: true }, // in ms
    estimatedDuration: { type: Number, required: true }, // in minutes
    isInMaintenance: { type: Boolean },
  },
});

export default utilsSchema;

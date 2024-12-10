import { Schema } from "mongoose";

const utilsSchema = new Schema({
  lastFlightDate: Date,
});

export default utilsSchema;

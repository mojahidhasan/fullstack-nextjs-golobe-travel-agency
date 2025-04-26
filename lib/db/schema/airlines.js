import { Schema } from "mongoose";

export const routesSchema = new Schema({
  departureAirportCode: { type: String, required: true },
  arrivalAirportCode: { type: String, required: true },
  distance: {
    lengthIn: { type: String, enum: ["mi"], required: true, default: "mi" },
    value: { type: Number, required: true },
  },
  basePriceByClass: {
    economy: { type: Number, required: true },
    premium_economy: { type: Number, required: true },
    business: { type: Number, required: true },
    first: { type: Number, required: true },
  },
  discount: {
    amountType: {
      type: String,
      enum: ["percentage", "fixed"],
      required: true,
      default: "percentage",
    }, // percentage from base price
    amount: { type: Number, required: true, default: 0 },
  },
  serviceFee: {
    amountType: {
      type: String,
      enum: ["percentage", "fixed"],
      required: true,
      default: "percentage",
    }, // percentage from base price
    amount: { type: Number, required: true, default: 0 },
  },
  taxes: {
    amountType: {
      type: String,
      enum: ["percentage", "fixed"],
      required: true,
      default: "percentage",
    }, // percentage from base price
    amount: { type: Number, required: true, default: 0 },
  },
});

const baggageAllowanceSchema = new Schema({
  cabinClass: {
    type: String,
    enum: ["Economy", "Premium Economy", "Business", "First"],
    required: true,
  },
  carryOn: {
    weightKg: Number,
    quantity: Number,
  },
  checked: {
    weightKg: Number,
    quantity: Number,
  },
  extraBaggageFeePerKg: Number,
  description: {
    type: String,
    default: "",
  },
  notes: [String], // Friendly helpful notes
  warnings: [String], // Critical points like excess fees or restrictions
});

const policyRuleSchema = new Schema({
  fareType: {
    type: String,
    enum: ["Saver", "Flex", "Premium", "Refundable"],
    required: true,
  },
  cancellationAllowed: {
    type: Boolean,
    default: false,
  },
  cancellationFee: {
    type: Number,
    default: 0,
  },
  cancellationPolicyText: {
    type: String,
    default: "",
  },
  dateChangeAllowed: {
    type: Boolean,
    default: false,
  },
  dateChangeFee: {
    type: Number,
    default: 0,
  },
  dateChangePolicyText: {
    type: String,
    default: "",
  },
  refundable: {
    type: Boolean,
    default: false,
  },
  refundPolicyText: {
    type: String,
    default: "",
  },
  notes: [String], // e.g. “Changes must be requested at least 12 hours before departure.”
  warnings: [String], // e.g. “Refunds not available after check-in.”
});

const airlinePolicySchema = new Schema({
  flightType: {
    type: String,
    enum: ["Domestic", "International"],
    required: true,
  },
  generalPolicyText: {
    type: String,
    default: "",
  },
  generalNotes: [String], // e.g. “Policies may differ for partner airlines.”
  generalWarnings: [String], // e.g. “Airport rules may override airline terms in some regions.”
  baggageAllowance: [baggageAllowanceSchema],
  policies: [policyRuleSchema],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const airlineSchema = new Schema(
  {
    _id: { type: String, required: true }, // airline IATA code
    iataCode: { type: String },
    name: { type: String, required: true },
    logo: { type: String, default: "" }, // URL to the airline logo
    contact: {
      phone: { type: String },
      email: { type: String },
      website: { type: String },
    },
    airlinePolicy: airlinePolicySchema,
  },
  {
    timestamps: true,
  },
);

export default airlineSchema;

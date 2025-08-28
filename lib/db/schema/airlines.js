import { Schema } from "mongoose";

const baggageWeightSchema = new Schema(
  {
    measurementUnit: {
      type: String,
      enum: ["kg", "lb"],
      default: "kg",
    },
    value: {
      type: Number,
      required: true,
    },
  },
  { _id: false },
);

const baggageDimensionSchema = new Schema(
  {
    length: Number,
    width: Number,
    height: Number,
    measurementUnit: {
      type: String,
      enum: ["cm", "in"],
      default: "cm",
    },
  },
  { _id: false },
);

const baggagePieceAllowanceSchema = new Schema(
  {
    maxPieces: {
      type: Number,
      required: true,
    },
    maxWeight: {
      type: baggageWeightSchema,
      required: true,
    },
    maxDimensions: {
      type: baggageDimensionSchema,
      required: false,
    },
  },
  { _id: false },
);

const baggageFeeSchema = new Schema(
  {
    feeAmount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
    feeType: {
      type: String,
      enum: ["perKg", "perPiece", "flat"],
      required: true,
    },
  },
  { _id: false },
);

const specialBaggageSchema = new Schema(
  {
    description: String,
    maxWeight: baggageWeightSchema,
    maxDimensions: baggageDimensionSchema,
  },
  { _id: false },
);

export const baggageAllowanceSchema = new Schema(
  {
    currency: {
      type: String,
      required: true,
      default: "USD",
    },
    carryOn: {
      type: baggagePieceAllowanceSchema,
      required: true,
    },
    checked: {
      type: baggagePieceAllowanceSchema,
      required: true,
    },
    excessWeightFee: {
      type: baggageFeeSchema,
      required: false,
    },
    excessPieceFee: {
      type: baggageFeeSchema,
      required: false,
    },
    specialBaggage: {
      type: specialBaggageSchema,
      required: false,
    },
  },
  { _id: false },
);

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

const cancellationPolicy = new Schema(
  {
    gracePeriodHours: Number,
    cutoffHoursBeforeDeparture: Number,
    fareRules: {
      refundable: {
        cancellable: Boolean,
        refundType: String,
        cancellationFee: Number,
      },
      nonRefundable: {
        cancellable: Boolean,
        refundType: String,
        cancellationFee: Number,
      },
      promo: {
        cancellable: Boolean,
        refundType: String,
        cancellationFee: Number,
      },
      flex: {
        cancellable: Boolean,
        refundType: String,
        cancellationFee: Number,
      },
    },
    allowVoucherInsteadOfRefund: Boolean,
    notes: String,
  },
  { _id: false },
);

const airlinePolicySchema = new Schema({
  cancellationPolicy: cancellationPolicy,
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
  baggageAllowance: { type: baggageAllowanceSchema, required: false },
  policies: {
    type: policyRuleSchema,
    required: false,
  },
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

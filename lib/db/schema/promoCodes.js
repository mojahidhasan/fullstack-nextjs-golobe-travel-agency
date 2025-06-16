import { Schema } from "mongoose";

const promoCodeSchema = new Schema({
  code: { type: String, required: true, unique: true }, // e.g., "FLY25"
  description: String,

  discountType: { type: String, enum: ["percentage", "fixed"], required: true },
  value: { type: Number, required: true }, // 25 = 25% or $25
  currency: { type: String, default: "USD" },
  maxDiscount: Number,

  applicableTo: {
    type: {
      type: String,
      enum: ["flight", "hotel", "both"],
      required: true,
      default: "both",
    },
    airlines: [String], // ["EK", "FZ"]
    hotelChains: [String],
    routes: [{ from: String, to: String }],
    destinations: [String], // country or city codes
    fareClasses: [String],
    roomTypes: [String],
  },

  conditions: {
    packageBooking: {
      requireFlight: { type: Boolean, default: false },
      requireHotel: { type: Boolean, default: false },
      requireSameItinerary: { type: Boolean, default: true },
    },
    paymentMethod: {
      acceptedMethods: [String], // e.g., ["visa", "bkash"]
    },
    firstTimeUserOnly: { type: Boolean, default: false },
    minimumAmount: Number,

    // ✅ Loyalty Tier Based Discount
    loyaltyTiers: [String], // e.g., ["gold", "platinum"]

    // ✅ Day/Time Based Promo
    validDays: [String], // e.g., ["Saturday", "Sunday"]
    validHours: {
      start: Number, // e.g., 9 (for 9AM)
      end: Number, // e.g., 18 (for 6PM)
    },
  },

  usageLimit: { type: Number, default: 1000 },
  usageCount: { type: Number, default: 0 },
  userLimit: { type: Number, default: 1 },
  userSpecific: {
    isRestricted: { type: Boolean, default: false },
    allowedUsers: [String], // userIds or emails
  },

  isActive: { type: Boolean, default: true },
  validFrom: Date,
  validUntil: Date,
  createdByAdmin: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

export default promoCodeSchema;

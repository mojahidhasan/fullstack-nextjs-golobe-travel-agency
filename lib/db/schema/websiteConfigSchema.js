import { Schema } from "mongoose";

const websiteConfigSchema = new Schema(
  {
    maintenanceMode: {
      enabled: {
        type: Boolean,
        default: false,
      },
      message: {
        type: String,
        default: "Site is under maintenance.",
      },
      startsAt: {
        type: Date,
        default: null,
      },
      endsAt: {
        type: Date,
        default: null,
      },
      type: {
        type: String,
        enum: ["full", "partial"],
        default: "full",
      },
      affectedFeatures: {
        type: [String],
        default: [],
      },
      allowlistedRoutes: {
        type: [String],
        default: [
          "/privacy-policy",
          "/terms-of-service",
          "/contact-us",
          "/support",
        ],
      },
      reason: {
        type: String,
        default: "",
      },
    },
    enableFlightBooking: {
      type: Boolean,
      default: true,
    },
    enableHotelBooking: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);
export default websiteConfigSchema;

import { afterAll, beforeAll, expect, test } from "vitest";
import { WebsiteConfig } from "./db/models";
import mongoose from "mongoose";

const config = {
  maintenanceMode: {
    enabled: false,
    message: "Site is under maintenance.",
    startsAt: null,
    endsAt: null,
    type: "full",
    affectedFeatures: [],
    allowlistedRoutes: [
      "/privacy-policy",
      "/terms-of-service",
      "/contact-us",
      "/support",
    ],
    reason: "",
  },
  enableFlightBooking: true,
  enableHotelBooking: true,
};

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
});

test("generateWebsiteConfig", { timeout: 2 * 60 * 1000 }, async () => {
  try {
    await WebsiteConfig.deleteMany({}).exec();
    await WebsiteConfig.create(config);
    expect(true).toBe(true);
  } catch (e) {
    console.log(e);
    throw e;
  }
});

afterAll(async () => {
  await mongoose.connection.close();
});

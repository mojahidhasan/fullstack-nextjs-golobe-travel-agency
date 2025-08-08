import { WebsiteConfig } from "@/admin/db/models";
import { connectToDB } from "@/lib/db/utilsDB";

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

const uploadWebsiteConfigDB = async () => {
  await connectToDB();
  await WebsiteConfig.deleteMany({}).exec();
  await WebsiteConfig.create(config);
};

export async function POST(req) {
  if (
    req.headers.get("Authorization") !==
    `Bearer ${process.env.API_SECRET_TOKEN}`
  ) {
    return new Response("Unauthorized", { status: 401 });
  }
  try {
    console.log("Uploading website config DB");
    await uploadWebsiteConfigDB();
    console.log("Website config DB uploaded successfully");
    return Response.json({
      success: true,
      message: "Website config DB uploaded successfully",
    });
  } catch (error) {
    console.error("Error uploading website config DB:", error);
    return Response.json(
      {
        success: false,
        message: "Error uploading website config DB",
      },
      { status: 500 },
    );
  }
}

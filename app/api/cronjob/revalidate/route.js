import { revalidateTag } from "next/cache";

export function GET(req) {
  if (
    req.headers.get("Authorization") !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return new Response("401", { status: 401 });
  }

  revalidateTag("popularFlightDestinations");
  revalidateTag("popularHotelDestinations");
  return Response.json({ success: true, message: "Revalidated" });
}

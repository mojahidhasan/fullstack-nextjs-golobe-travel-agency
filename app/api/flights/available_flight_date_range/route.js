import { getAvailableFlightDateRange } from "@/lib/services/flights";
export async function GET(req) {
  try {
    const flightDateRange = await getAvailableFlightDateRange();
    return Response.json(flightDateRange);
  } catch (e) {
    console.log(e);
    return Response.json({ success: false, message: "Error getting data" });
  }
}

export function POST() {}

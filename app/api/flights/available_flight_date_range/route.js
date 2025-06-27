import { getAvailableFlightDateRange } from "@/lib/controllers/flights";
export async function GET(req) {
  const flightDateRange = await getAvailableFlightDateRange();
  return Response.json(flightDateRange);
}

export function POST() {}

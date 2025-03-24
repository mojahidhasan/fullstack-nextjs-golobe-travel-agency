import { getFlightDateRange } from "@/lib/controllers/flights";
export async function GET(req) {
  const flightDateRange = await getFlightDateRange();
  return Response.json(flightDateRange);
}

export function POST() {}

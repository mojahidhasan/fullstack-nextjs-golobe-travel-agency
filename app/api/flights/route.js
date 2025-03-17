import { Flight } from "@/lib/db/models";
import { startOfDay } from "date-fns";
const validSearchParams = [
  "lastAvailableFlightDate",
  "firstAvailableFlightDate",
];

export async function GET(req) {
  const searchParams = Object.fromEntries(new URL(req.url).searchParams);
  const data = {};
  for (const [key, value] of Object.entries(searchParams)) {
    if (!validSearchParams.includes(key)) {
      return new Response("Invalid search param", { status: 400 });
    }

    if (key === "lastAvailableFlightDate") {
      const lastFlight = await Flight.find({})
        .sort({ "departure.scheduled": -1 })
        .limit(1)
        .select("departure.scheduled");

      if (lastFlight.length > 0) {
        const milliseconds = lastFlight[0].departure.scheduled;
        data[key] = milliseconds;
      } else {
        return new Response("No flights available", { status: 404 });
      }
    }
    if (key === "firstAvailableFlightDate") {
      const firstFlight = await Flight.find({
        expireAt: { $gte: startOfDay(new Date()) },
      })
        .sort({ "departure.scheduled": 1 })
        .limit(1)
        .select("departure.scheduled");

      if (firstFlight.length > 0) {
        const milliseconds = firstFlight[0].departure.scheduled;
        data[key] = milliseconds;
      } else {
        return new Response("No flights available", { status: 404 });
      }
    }
  }

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

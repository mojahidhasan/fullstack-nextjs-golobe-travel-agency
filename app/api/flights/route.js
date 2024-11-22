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
      const date = (
        await Flight.find({})
          .sort({
            departureDateTime: -1,
          })
          .limit(1)
          .select("departureDateTime")
      )[0].departureDateTime;
      data[key] = new Date(date).toString();
    }
    if (key === "firstAvailableFlightDate") {
      const date = (
        await Flight.find({
          expireAt: { $gte: startOfDay(new Date()) },
        })
          .sort({
            departureDateTime: 1,
          })
          .limit(1)
          .select("departureDateTime")
      )[0].departureDateTime;
      data[key] = new Date(date).toString();
    }
  }

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

import { Flight } from "@/lib/db/models";
import { addYears } from "date-fns";

export async function GET(req) {
  const firstFlight = await Flight.findOne({
    expireAt: { $gte: new Date() },
  }).sort({ "departure.scheduled": 1 });
  const lastFlight = await Flight.findOne({}).sort({
    "departure.scheduled": -1,
  });
  const today = new Date().getTime();
  return Response.json({
    success: true,
    data: {
      from: +firstFlight.departure.scheduled || today,
      to: +lastFlight.departure.scheduled || addYears(today, 1).getTime(),
    },
  });
}

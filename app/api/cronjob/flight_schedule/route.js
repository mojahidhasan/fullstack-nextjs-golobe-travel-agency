import { getManyDocs } from "@/lib/db/getOperationDB";
import generateOneDayFlightSchedule from "@/lib/db/generateForDB/generateFlight";
import { Flight } from "@/lib/db/models";
import mongoose from "mongoose";
import { subDays, fromUnixTime, getUnixTime } from "date-fns";
export async function GET(req) {
  if (
    req.headers.get("Authorization") !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return new Response("401", {
      status: 401,
    });
  }

  if (mongoose.connection.readyState === 0) {
    try {
      await mongoose.connect(process.env.MONGODB_URI);
    } catch (e) {
      console.log(e.message);
    }
  }

  const airports = await getManyDocs("Airport");
  const airlines = await getManyDocs("Airline");
  const flights = await generateOneDayFlightSchedule(
    airlines,
    airports,
    undefined,
    fromUnixTime(getUnixTime(subDays(new Date(), 1)))
  );

  try {
    await Flight.insertMany(flights);
    return new Response(JSON.stringify({ msg: "Success" }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ msg: "Error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}

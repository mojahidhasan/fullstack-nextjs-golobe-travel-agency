import { getManyDocs } from "@/lib/db/getOperationDB";
import generateOneDayFlightSchedule from "@/lib/db/generateForDB/generateFlight";
import { Flight } from "@/lib/db/models";
import mongoose from "mongoose";
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

  const airports = await getManyDocs("Airport", {}, ["airports"]);
  const airlines = await getManyDocs("Airline", {}, ["airlines"]);
  const airplanes = await getManyDocs("Airplane", {}, ["airplanes"]);
  const seats = await getManyDocs("Seat", {}, ["seats"]);

  console.log(airplanes);
  const lastFlightDate = (
    await Flight.find({})
      .sort({
        departureDateTime: -1,
      })
      .limit(1)
      .select("departureDateTime")
  )[0].departureDateTime;

  const flights = await generateOneDayFlightSchedule(
    airlines,
    airports,
    airplanes,
    seats,
    new Date(lastFlightDate)
  );

  try {
    await Flight.bulkWrite(
      flights.map((flight) => ({
        insertOne: {
          document: flight,
        },
      }))
    );
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

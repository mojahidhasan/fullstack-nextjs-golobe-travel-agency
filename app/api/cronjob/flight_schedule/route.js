import generateOneDayFlight from "@/lib/db/generateForDB/flights/generateOneDayFlight";
import {
  Flight,
  Airport,
  Airplane,
  Seat,
  Airline,
  Util,
} from "@/lib/db/models";
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

  const airports = await Airport.find({});
  const airlines = await Airline.find({});
  const airplanes = await Airplane.find({});

  const lastFlight = await Flight.findOne({}).sort({
    "departure.scheduled": -1,
  });
  const flights = generateOneDayFlight(
    airlines,
    airports,
    airplanes,
    new Date(+lastFlight.departure.scheduled)
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

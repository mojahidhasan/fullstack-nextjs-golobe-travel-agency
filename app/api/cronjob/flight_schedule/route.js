import generateOneDayFlightSchedule from "@/lib/db/generateForDB/generateFlight";
import {
  Flight,
  Airport,
  Airplane,
  Seat,
  Airline,
  Util,
} from "@/lib/db/models";
import mongoose from "mongoose";
import { addDays } from "date-fns";
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
  const seats = await Seat.find({});

  const { lastFlightDate } = await Util.findOne({});
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
    await Util.findOneAndUpdate(
      {},
      {
        lastFlightDate: addDays(new Date(lastFlightDate), 1),
      }
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

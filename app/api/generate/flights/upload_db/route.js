import primaryAirportData from "@/lib/db/generateForDB/primaryData/airportsData.json";
import primaryAirplanedata from "@/lib/db/generateForDB/primaryData/airplaneData.json";
import primaryAirlinedata from "@/lib/db/generateForDB/primaryData/airlinesData.json";

import {
  generateAirlineFlightPricesDB,
  generateAirlinesDB,
  generateAirplanesDB,
  generateAirportsDB,
  generateFlightsDB,
} from "@/lib/db/generateForDB/flights/generateFlights";
import { deleteManyDocs } from "@/lib/db/deleteOperationDB";
import { createManyDocs } from "@/lib/db/createOperationDB";

export async function POST(req) {
  if (
    req.headers.get("Authorization") !==
    `Bearer ${process.env.API_SECRET_TOKEN}`
  ) {
    return new Response("Unauthorized", { status: 401 });
  }
  try {
    console.log("Uploading flights DB...");
    await uploadFlightsDB();
    console.log("Flights DB uploaded successfully.");
    return Response.json({
      success: true,
      message: "Flights DB uploaded successfully.",
    });
  } catch (error) {
    console.error("Error uploading flights DB:", error);
    return Response.json(
      {
        success: false,
        message: "Error uploading flights DB",
      },
      { status: 500 },
    );
  }
}

async function uploadFlightsDB() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI not found in .env file.");
  }
  const airport = await generateAirportsDB(primaryAirportData);
  const { airplaneData: airplane, seatData: seat } =
    await generateAirplanesDB(primaryAirplanedata);
  const airline = await generateAirlinesDB(primaryAirlinedata);
  const airlineFlightPrices =
    await generateAirlineFlightPricesDB(primaryAirlinedata);
  const flight = await generateFlightsDB(
    10,
    airport,
    airplane,
    airline,
    airlineFlightPrices,
  );

  let flightItinerary = [];
  let flightSegments = [];
  let flightSeats = [];

  for (const f of flight) {
    flightItinerary = flightItinerary.concat(f.flightItinerary);
    flightSegments = flightSegments.concat(f.flightSegments);
    flightSeats = flightSeats.concat(f.flightSeats);
  }

  const data = {
    airport,
    airplane,
    airline,
    AirlineFlightPrice: airlineFlightPrices,
    FlightItinerary: flightItinerary,
    FlightSegment: flightSegments,
    FlightSeat: flightSeats,
  };

  for (const [key, value] of Object.entries(data)) {
    await deleteManyDocs(key);
    console.log("deleted", key);
    // create
    await createManyDocs(key, value);
    console.log("created", key);
  }

  return data;
}

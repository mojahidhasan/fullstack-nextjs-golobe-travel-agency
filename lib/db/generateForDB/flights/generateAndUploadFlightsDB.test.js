import primaryAirportData from "../primaryData/airportsData.json";
import primaryAirplanedata from "../primaryData/airplaneData.json";
import primaryAirlinedata from "../primaryData/airlinesData.json";
import {
  generateAirlinesDB,
  generateAirplanesDB,
  generateAirportsDB,
  generateFlightsDB,
  generateAirlineFlightPricesDB,
} from "./generateFlights";
import { createManyDocs } from "../../createOperationDB";
import { deleteManyDocs } from "../../deleteOperationDB";
import mongoose from "mongoose";
import { test, expect } from "vitest";

test("generateAndUploadFlightsDB", { timeout: 5 * 60 * 1000 }, async () => {
  await uploadFlightsDB();
  expect(true).toBe(true);
});
export async function uploadFlightsDB() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI not found in .env file.");
  }

  if (mongoose.connection.readyState === 0) {
    try {
      await mongoose.connect(process.env.MONGODB_URI);
    } catch (e) {
      console.log(e.message);
    }
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

  return true;
}

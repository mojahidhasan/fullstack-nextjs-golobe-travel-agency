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
async function uploadFlightsDB() {
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

  const data = {
    airport,
    airplane,
    seat,
    airline,
    AirlineFlightPrice: airlineFlightPrices,
    flight: flight.flat(1),
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

test("generateAndUploadFlightsDB", { timeout: 2 * 60 * 1000 }, async () => {
  await uploadFlightsDB();
  expect(true).toBe(true);
});

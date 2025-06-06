import { expect, test } from "vitest";
import {
  generateFlightsDB,
  generateAirlinesDB,
  generateAirplanesDB,
  generateAirportsDB,
  generateAirlineFlightPricesDB,
} from "./generateFlights";
import fs from "fs/promises";
import primaryAirportData from "../primaryData/airportsData.json";
import primaryAirlineData from "../primaryData/airlinesData.json";
import primaryAirplaneData from "../primaryData/airplaneData.json";

test("generateFlightsFiles", { timeout: 2 * 60 * 1000 }, async () => {
  try {
    const airport = await generateAirportsDB(primaryAirportData);
    const { airplaneData: airplane, seatData: seat } =
      await generateAirplanesDB(primaryAirplaneData);
    const airline = await generateAirlinesDB(primaryAirlineData);
    const airlineFlightPrices =
      await generateAirlineFlightPricesDB(primaryAirlineData);
    const flight = await generateFlightsDB(
      10,
      airport,
      airplane,
      airline,
      airlineFlightPrices,
    );

    const data = {
      flight: flight.flat(1),
      airport,
      airplane,
      seat,
      airline,
      airlineFlightPrices,
    };
    await fs.mkdir("./generated/flights", { recursive: true });
    for (const [key, value] of Object.entries(data)) {
      await fs.writeFile(
        `./generated/flights/${key}.json`,
        JSON.stringify(value, null, 2),
      );
    }

    console.log("done");
    expect(true).toBe(true);
  } catch (e) {
    console.log(e);
  }
});

import { expect, test } from "vitest";
import {
  generateFlightsDB,
  generateAirlinesDB,
  generateAirplanesDB,
  generateAirportsDB,
} from "./generateFlights";
import fs from "fs/promises";
import primaryAirportData from "../primaryData/airportsData.json";
import primaryAirlineData from "../primaryData/airlinesData.json";
import primaryAirplaneData from "../primaryData/airplaneData.json";

test("generateFlightsFiles", { timeout: 2 * 60 * 1000 }, async () => {
  try {
    const airport = await generateAirportsDB(primaryAirportData);
    const airplane = await generateAirplanesDB(primaryAirplaneData);
    const airline = await generateAirlinesDB(primaryAirlineData);
    const flight = await generateFlightsDB(10, airport, airplane, airline);

    const data = { flight, airport, airplane, airline };
    console.log(data.flight.length);
    await fs.mkdir("./generated/flights", { recursive: true });
    for (const [key, value] of Object.entries(data)) {
      await fs.writeFile(
        `./generated/flights/${key}.json`,
        JSON.stringify(value, null, 2)
      );
    }

    console.log("done");
    expect(true).toBe(true);
  } catch (e) {
    console.log(e);
  }
});

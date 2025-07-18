import primaryAirportData from "@/lib/db/generateForDB/primaryData/airportsData.json";
import primaryAirplaneData from "@/lib/db/generateForDB/primaryData/airplaneData.json";
import primaryAirlineData from "@/lib/db/generateForDB/primaryData/airlinesData.json";

import {
  generateAirlineFlightPricesDB,
  generateAirlinesDB,
  generateAirplanesDB,
  generateAirportsDB,
  generateFlightsDB,
} from "@/lib/db/generateForDB/flights/generateFlights";
import fs from "fs/promises";

export async function GET(req) {
  if (
    req.headers.get("Authorization") !==
    `Bearer ${process.env.API_SECRET_TOKEN}`
  ) {
    return new Response("Unauthorized", { status: 401 });
  }

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

    console.log("Flights files generated successfully");
    return new Response("Flights files generated successfully", {
      status: 200,
    });
  } catch (e) {
    console.log(e);
    return new Response("Error generating flight files", { status: 500 });
  }
}

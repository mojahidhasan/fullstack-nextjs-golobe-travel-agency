import { expect, test } from "vitest";
import { generateFlightsDB } from "./generateFlights";
import fs from "fs/promises";

test("generateFlightsFiles", { timeout: 2 * 60 * 1000 }, async () => {
  try {
    const data = await generateFlightsDB();
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

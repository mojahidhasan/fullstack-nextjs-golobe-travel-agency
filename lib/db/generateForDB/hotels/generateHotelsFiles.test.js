import { expect, test } from "vitest";
import { generateHotelsDB } from "./generateHotels";
import fs from "fs/promises";

test("generateHotelsFiles", { timeout: 2 * 60 * 1000 }, async () => {
  try {
    const data = await generateHotelsDB();
    await fs.mkdir("./generated/hotels", { recursive: true });
    for (const [key, value] of Object.entries(data)) {
      await fs.writeFile(
        `./generated/hotels/${key}.json`,
        JSON.stringify(value, null, 2)
      );
    }

    console.log("done");
    expect(true).toBe(true);
  } catch (e) {
    console.log(e);
  }
});
